"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchItems = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/vault", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error("Fetch vault items error:", err);
    }
  };

  useEffect(() => { fetchItems(); }, [token]);

  const handleAddOrEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const url = editingItem ? `/api/vault?id=${editingItem._id}` : "/api/vault";
    const method = editingItem ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (data._id) {
        setMessage(editingItem ? "Item updated!" : "Item added!");
        setNewItem({ title: "", username: "", password: "", notes: "" });
        setEditingItem(null);
        fetchItems();
      } else {
        setMessage("Failed to save item.");
      }
    } catch (err) {
      console.error("Add/Edit item error:", err);
      setMessage("Error saving item.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`/api/vault?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Item deleted!");
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error("Delete item error:", err);
      setMessage("Error deleting item.");
    }
  };

  const handleEdit = (item: VaultItem) => {
    setEditingItem(item);
    setNewItem({ title: item.title, username: item.username, password: item.password, notes: item.notes || "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">🔐 My Vault</h1>
        <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
      </div>

      <form onSubmit={handleAddOrEdit} className="mb-4 space-y-2">
        <input type="text" placeholder="Title" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} className="p-2 rounded bg-gray-700 w-full"/>
        <input type="text" placeholder="Username" value={newItem.username} onChange={e => setNewItem({ ...newItem, username: e.target.value })} className="p-2 rounded bg-gray-700 w-full"/>
        <input type="password" placeholder="Password" value={newItem.password} onChange={e => setNewItem({ ...newItem, password: e.target.value })} className="p-2 rounded bg-gray-700 w-full"/>
        <textarea placeholder="Notes" value={newItem.notes} onChange={e => setNewItem({ ...newItem, notes: e.target.value })} className="p-2 rounded bg-gray-700 w-full"/>
        <button type="submit" className="bg-blue-600 p-2 rounded w-full">{editingItem ? "Update Item" : "Add Item"}</button>
      </form>

      {message && <p className="mb-2 text-sm">{message}</p>}

      <div className="space-y-2">
        {items.length === 0 ? <p>No items found.</p> : items.map(item => (
          <div key={item._id} className="p-2 rounded bg-gray-800 flex justify-between items-center">
            <div>
              <h2 className="font-bold">{item.title}</h2>
              <p>Username: {item.username}</p>
              <p>Password: {item.password}</p>
              {item.notes && <p>Notes: {item.notes}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="bg-yellow-600 px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="bg-red-600 px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
