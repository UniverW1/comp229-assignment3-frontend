import { useEffect, useState } from "react";

function ProjectsPage() {
  const emptyForm = {
    title: "",
    completion: "",
    description: ""
  };

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const apiUrl = "http://localhost:3000/api/projects";

  async function loadProjects() {
    const response = await fetch(apiUrl);
    const result = await response.json();
    setProjects(result.data || []);
  }

  useEffect(() => {
    loadProjects();
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
    loadProjects();
  }

  function handleEdit(project) {
    setForm({
      title: project.title || "",
      completion: project.completion ? project.completion.slice(0, 10) : "",
      description: project.description || ""
    });
    setEditingId(project.id);
  }

  async function handleDelete(id) {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE"
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

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="date"
            name="completion"
            value={form.completion}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editingId ? "Update Project" : "Add Project"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h3>Project List</h3>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table border="1" cellPadding="8">
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
                  <button onClick={() => handleEdit(project)}>Edit</button>
                  <button onClick={() => handleDelete(project.id)}>Delete</button>
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