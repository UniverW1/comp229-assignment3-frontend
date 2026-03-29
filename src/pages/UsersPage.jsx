import { useEffect, useState } from "react";

function UsersPage() {
  const emptyForm = {
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  };

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const apiUrl = "http://localhost:3000/api/users";

  async function loadUsers() {
    const response = await fetch(apiUrl);
    const result = await response.json();
    setUsers(result.data || []);
  }

  useEffect(() => {
    loadUsers();
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
    loadUsers();
  }

  function handleEdit(user) {
    setForm({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      password: user.password || ""
    });
    setEditingId(user.id);
  }

  async function handleDelete(id) {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE"
    });
    loadUsers();
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId("");
  }

  return (
    <div>
      <h2>Users</h2>

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
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editingId ? "Update User" : "Add User"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h3>User List</h3>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersPage;