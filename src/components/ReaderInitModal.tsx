"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "../lib/api";

export default function ReaderInitModal() {
  const [showModal, setShowModal] = useState(false);
  const [readerName, setReaderName] = useState("");
  const [readerEmail, setReaderEmail] = useState("");

  useEffect(() => {
    const storedReader = localStorage.getItem("reader");
    if (!storedReader) {
      setShowModal(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerName.trim() || !readerEmail.trim()) return;

    console.log("Attempting to login/create user with:", {
      name: readerName,
      email: readerEmail,
    });

    try {
      // Check if reader exists by email using the new endpoint
      const getRes = await fetch(
        `${API_BASE_URL}/readers/by-email?email=${encodeURIComponent(readerEmail)}`
      );

      console.log("Reader lookup response status:", getRes.status);

      if (getRes.ok) {
        const existingReader = await getRes.json();
        console.log("Existing reader found:", existingReader);

        localStorage.setItem("reader", JSON.stringify(existingReader));
        console.log("✅ Existing reader logged in:", existingReader);
        console.log("✅ Stored in localStorage:", JSON.stringify(existingReader));
        setShowModal(false);
        return;
      } else if (getRes.status === 404) {
        console.log("No existing reader found, creating new user...");
      } else {
        throw new Error(`Unexpected response: ${getRes.status}`);
      }

      // If no existing reader found, create a new one
      const postRes = await fetch(`${API_BASE_URL}/readers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: readerName, email: readerEmail }),
      });

      console.log("Create reader response status:", postRes.status);

      if (postRes.ok) {
        const newReader = await postRes.json();
        localStorage.setItem("reader", JSON.stringify(newReader));
        console.log("✅ New reader created and logged in:", newReader);
        console.log("✅ Stored in localStorage:", JSON.stringify(newReader));
        setShowModal(false);
      } else {
        console.error(
          "❌ Failed to create reader, response:",
          await postRes.text()
        );
        alert("Failed to create reader.");
      }
    } catch (error) {
      console.error("❌ Error with reader authentication:", error);
      alert("Error creating reader.");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Who’s using this device?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            placeholder="Enter your name"
            value={readerName}
            onChange={(e) => setReaderName(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            value={readerEmail}
            onChange={(e) => setReaderEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
