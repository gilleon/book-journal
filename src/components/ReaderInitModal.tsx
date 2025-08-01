"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

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

    try {
      const getRes = await fetch(
        `${API_BASE_URL}/readers/by-email?email=${encodeURIComponent(readerEmail)}`
      );

      console.log("Reader lookup response status:", getRes.status);

      if (getRes.ok) {
        const existingReader = await getRes.json();
        localStorage.setItem("reader", JSON.stringify(existingReader));
        setShowModal(false);
        return;
      } else if (getRes.status === 404) {
        console.log("No existing reader found, creating new user...");
      } else {
        throw new Error(`Unexpected response: ${getRes.status}`);
      }

      const postRes = await fetch(`${API_BASE_URL}/readers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: readerName, email: readerEmail }),
      });

      if (postRes.ok) {
        const newReader = await postRes.json();
        localStorage.setItem("reader", JSON.stringify(newReader));
        setShowModal(false);
      } else {
        alert("Failed to create reader.");
      }
    } catch (error) {
      console.error("Error creating reader:", error);
      alert("Error creating reader.");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Who is using this device?</h2>
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
