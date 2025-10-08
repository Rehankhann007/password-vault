"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e: any) => {
    e.preventDefault();
    setMessage(
      "Password reset link sent to your email (demo mode — no email actually sent)."
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
          >
            Send Reset Link
          </button>
        </form>

        {message && <p className="text-green-400 text-sm mt-3">{message}</p>}

        <div className="text-center mt-4 text-sm text-gray-400">
          <a href="/signin" className="text-blue-400 hover:underline">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
