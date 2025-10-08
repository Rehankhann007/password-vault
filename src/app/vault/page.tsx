"use client";

import { useState, useEffect } from "react";

interface VaultItem {
  _id: string;
  title: string;
  username: string;
  password: string;
  notes?: string;
}

export default function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [newItem, setNewItem] = useState({ title: "", username: "", password: "", notes: "" });
  const [message, setMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch vault items
  const fetchItems = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/vault", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error("Fetch vault items error:", err);
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();

      if (data && data._id) {
        // Add item locally
        setItems([...items, data]);
        setNewItem({ title: "", username: "", password: "", notes: "" });
        setMessage("Item added successfully!");
      } else {
        setMessage("Failed to add item.");
      }
    } catch (err) {
      console.error("Add item error:", err);
      setMessage("Error adding item.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">🔐 My Vault</h1>

      <form onSubmit={handleAddItem} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          className="p-2 rounded bg-gray-700 w-full"
        />
        <input
          type="text"
          placeholder="Username"
          value={newItem.username}
          onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
          className="p-2 rounded bg-gray-700 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={newItem.password}
          onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
          className="p-2 rounded bg-gray-700 w-full"
        />
        <textarea
          placeholder="Notes"
          value={newItem.notes}
          onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
          className="p-2 rounded bg-gray-700 w-full"
        />
        <button type="submit" className="bg-blue-600 p-2 rounded w-full">
          Add Item
        </button>
      </form>

      {message && <p className="mb-2 text-sm">{message}</p>}

      <div className="space-y-2">
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="p-2 rounded bg-gray-800">
              <h2 className="font-bold">{item.title}</h2>
              <p>Username: {item.username}</p>
              <p>Password: {item.password}</p>
              {item.notes && <p>Notes: {item.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
