import { useEffect, useState } from "react";

function ReferencesPage() {
  const emptyForm = {
    firstname: "",
    lastname: "",
    email: "",
    position: "",
    company: ""
  };

  const [referencesList, setReferencesList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const apiUrl = "https://comp229-assignment2-f86t.onrender.com/api/references";

  async function loadReferences() {
    const response = await fetch(apiUrl);
    const result = await response.json();
    setReferencesList(result.data || []);
  }

  useEffect(() => {
    loadReferences();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (editingId) {
      await fetch(`${apiUrl}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } else {
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    }

    setForm(emptyForm);
    setEditingId("");
    loadReferences();
  }

  function handleEdit(reference) {
    setForm({
      firstname: reference.firstname || "",
      lastname: reference.lastname || "",
      email: reference.email || "",
      position: reference.position || "",
      company: reference.company || ""
    });
    setEditingId(reference.id);
  }

  async function handleDelete(id) {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE"
    });
    loadReferences();
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId("");
  }

  return (
    <div>
      <h2>References</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editingId ? "Update Reference" : "Add Reference"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h3>Reference List</h3>

      {referencesList.length === 0 ? (
        <p>No references found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {referencesList.map((reference) => (
              <tr key={reference.id}>
                <td>{reference.firstname}</td>
                <td>{reference.lastname}</td>
                <td>{reference.email}</td>
                <td>{reference.position}</td>
                <td>{reference.company}</td>
                <td>
                  <button onClick={() => handleEdit(reference)}>Edit</button>
                  <button onClick={() => handleDelete(reference.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReferencesPage;