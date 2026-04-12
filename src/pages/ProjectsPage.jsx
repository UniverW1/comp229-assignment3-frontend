import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function ProjectsPage() {
  const emptyForm = { title: "", completion: "", description: "" };

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const apiUrl = `${API_BASE_URL}/projects`;
  const token = localStorage.getItem("token");

  async function loadProjects() {
    const response = await fetch(apiUrl);
    const result = await response.json();
    setProjects(result.data || []);
  }

  useEffect(() => {
    loadProjects();
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
    loadProjects();
  }

  function handleEdit(project) {
    setForm({
      title: project.title || "",
      completion: project.completion ? project.completion.slice(0, 10) : "",
      description: project.description || "",
    });
    setEditingId(project.id);
  }

  async function handleDelete(id) {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadProjects();
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId("");
  }

  return (
    <div>
      <h2>Projects</h2>

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
              name="completion"
              type="date"
              value={form.completion}
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
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && <button onClick={handleCancel}>Cancel</button>}
        </form>
      )}

      <hr />

      <h3>Project List</h3>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Completion</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.completion ? project.completion.slice(0, 10) : ""}</td>
                <td>{project.description}</td>
                <td>
                  {token && (
                    <>
                      <button onClick={() => handleEdit(project)}>Edit</button>
                      <button onClick={() => handleDelete(project.id)}>
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

export default ProjectsPage;