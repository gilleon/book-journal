"use client";

import { useEffect, useState } from "react";
import ModalForm from "@/components/ModalForm";
import DataTable from "@/components/DataTable";

type Reader = {
  id: number;
  name: string;
  email: string;
};

export default function ReadersPage() {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const api =
    "https://sd-6310-2025-summer-express-app.onrender.com/api/readers";

  const fetchReaders = () => {
    fetch(api)
      .then((res) => res.json())
      .then(setReaders);
  };

  useEffect(() => {
    fetchReaders();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? `${api}/${editingId}` : api;

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchReaders();
      setFormData({ name: "", email: "" });
      setEditingId(null);
      setShowModal(false);
    }
  };

  const handleEdit = (reader: Reader) => {
    setEditingId(reader.id);
    setFormData({ name: reader.name, email: reader.email });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`${api}/${id}`, { method: "DELETE" });
    if (res.ok) fetchReaders();
  };

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Readers</h1>

        <button
          onClick={() => {
            setFormData({ name: "", email: "" });
            setEditingId(null);
            setShowModal(true);
          }}
          className="mb-4 bg-green-700 text-white px-4 py-2 rounded"
        >
          ➕ Add New Reader
        </button>

        <ModalForm
          title={editingId ? "Edit Reader" : "Add Reader"}
          show={showModal}
          onClose={() => {
            setFormData({ name: "", email: "" });
            setEditingId(null);
            setShowModal(false);
          }}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2"
            required
          />
        </ModalForm>

        <DataTable
          data={readers}
          columns={[
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
          ]}
          actions={(reader) => (
            <>
              <button
                onClick={() => handleEdit(reader)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(reader.id)}
                className="text-red-600 ml-2"
              >
                Delete
              </button>
            </>
          )}
        />
      </div>
    </>
  );
}
