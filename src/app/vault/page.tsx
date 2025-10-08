"use client";

import { useState } from "react";

export default function VaultPage() {
  const [items, setItems] = useState<any[]>([
    // Demo items for UI
    { _id: "1", title: "Demo Item 1", username: "user1", password: "pass1" },
    { _id: "2", title: "Demo Item 2", username: "user2", password: "pass2" },
  ]);

  const [newItem, setNewItem] = useState({
    title: "",
    username: "",
    password: "",
  });

  // Add item locally (UI only)
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.username || !newItem.password) return;
    setItems([...items, { ...newItem, _id: Date.now().toString() }]);
    setNewItem({ title: "", username: "", password: "" });
  };

  // Delete item locally
  const handleDelete = (_id: string) => {
    setItems(items.filter((item) => item._id !== _id));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🔐 My Vault</h1>

      {/* Add Item Form */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          placeholder="Title"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          required
        />
        <input
          placeholder="Username"
          value={newItem.username}
          onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          value={newItem.password}
          onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
          required
        />
        <button type="submit">Add</button>
      </form>

      {/* Vault Items */}
      {items.length === 0 ? (
        <p style={{ textAlign: "center" }}>No items found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "0.5rem",
              }}
            >
              <span>
                <strong>{item.title}</strong> - {item.username} - {item.password}
              </span>
              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  padding: "0.2rem 0.5rem",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
