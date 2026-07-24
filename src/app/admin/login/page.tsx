"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const redirectTarget =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/admin/dashboard"
      : "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      toast.success("Welcome back!");
      window.location.href = redirectTarget;
    } catch {
      setError("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-primary mb-2">
            Glow & Grace
          </h1>
          <p className="text-text-secondary">Admin Panel Login</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-playfair font-semibold text-text-primary mb-6">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" fullWidth isLoading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-xs text-text-secondary text-center mt-4">
            Use the credentials set in your ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD environment variables.
          </p>
        </div>
      </div>
    </div>
  );
}
