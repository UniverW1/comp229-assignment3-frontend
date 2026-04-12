import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function ServicesPage() {
  const emptyForm = { title: "", description: "" };

  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const apiUrl = `${API_BASE_URL}/services`;
  const token = localStorage.getItem("token");

  async function loadServices() {
    const response = await fetch(apiUrl);
    const result = await response.json();
    setServices(result.data || []);
  }

  useEffect(() => {
    loadServices();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (editingId) {
      await fetch(`${apiUrl}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
    }

    setForm(emptyForm);
    setEditingId("");
    loadServices();
  }

  function handleEdit(service) {
    setForm({
      title: service.title || "",
      description: service.description || "",
    });
    setEditingId(service.id);
  }

  async function handleDelete(id) {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadServices();
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId("");
  }

  return (
    <div>
      <h2>Services</h2>

      {token && (
        <form onSubmit={handleSubmit}>
          <div>
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            {editingId ? "Update Service" : "Add Service"}
          </button>
          {editingId && <button onClick={handleCancel}>Cancel</button>}
        </form>
      )}

      <hr />

      <h3>Service List</h3>

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.title}</td>
                <td>{service.description}</td>
                <td>
                  {token && (
                    <>
                      <button onClick={() => handleEdit(service)}>Edit</button>
                      <button onClick={() => handleDelete(service.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ServicesPage;