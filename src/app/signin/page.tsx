"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    // Demo sign-in: simple validation
    if (email && password) {
      router.push("/vault"); // Redirect to vault
    } else {
      setError("Please enter email and password");
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh", 
      background: "#121212", 
      fontFamily: "Arial, sans-serif" 
    }}>
      <div style={{
        background: "#1e1e1e", 
        padding: "2rem", 
        borderRadius: "12px", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)", 
        width: "100%", 
        maxWidth: "400px",
        color: "#fff"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#00e0ff" }}>Sign In</h1>

        <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              padding: "0.75rem 1rem", 
              borderRadius: "8px", 
              border: "1px solid #444", 
              background: "#2c2c2c",
              color: "#fff",
              fontSize: "1rem"
            }}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: "100%", 
                padding: "0.75rem 1rem", 
                borderRadius: "8px", 
                border: "1px solid #444", 
                background: "#2c2c2c",
                color: "#fff",
                fontSize: "1rem"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#00e0ff",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" style={{
            padding: "0.75rem", 
            background: "#00e0ff", 
            color: "#121212", 
            fontWeight: "bold", 
            borderRadius: "8px", 
            border: "none",
            cursor: "pointer",
            transition: "0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#00b5cc")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#00e0ff")}
          >
            Sign In
          </button>
        </form>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <a href="/signup" style={{ color: "#00e0ff", textDecoration: "underline" }}>Register</a>
          <a href="/forgot-password" style={{ color: "#00e0ff", textDecoration: "underline" }}>Forgot Password?</a>
        </div>

        {error && <p style={{ color: "#ff4d4f", marginTop: "1rem", textAlign: "center" }}>{error}</p>}
      </div>
    </div>
  );
}
