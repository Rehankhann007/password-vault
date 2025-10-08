"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "Password reset link sent!");
    } catch {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-2 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-700 w-full"
          required
        />
        <button type="submit" className="w-full bg-blue-600 p-2 rounded">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
