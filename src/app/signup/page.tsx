"use client";

import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setMessage(data.message || "Account created successfully!");
    } catch {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-2 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-700 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-700 w-full"
          required
        />
        <button type="submit" className="w-full bg-blue-600 p-2 rounded">
          Sign Up
        </button>
      </form>
      <p className="mt-2 text-gray-400">
        Already have an account? <a href="/signin" className="text-blue-400">Sign In</a>
      </p>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
