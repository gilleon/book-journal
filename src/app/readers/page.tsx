"use client";

import ModalForm from "../../components/ModalForm";
import DataTable from "../../components/DataTable";
import InputField from "../../ui/InputField";
import Button from "../../ui/Button";
import { useReaderData } from "../../hooks/useReaderData";

export default function ReadersPage() {
  const {
    readers,
    loading,
    error,
    formData,
    isEditing,
    showModal,
    confirmDeleteId,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleOpenAddModal,
    handleCloseModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    fetchReaders,
  } = useReaderData();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          Loading readers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl text-red-600 dark:text-red-400 mb-4">
          Error: {error}
        </div>
        <Button onClick={() => fetchReaders()} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Readers
        </h1>

        <Button
          onClick={handleOpenAddModal}
          className="mb-4 bg-green-700 text-white px-4 py-2 rounded"
          variant="success"
        >
          ➕ Add New Reader
        </Button>

        <ModalForm
          title={isEditing ? "Edit Reader" : "Add Reader"}
          show={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        >
          <InputField
            id="name"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter reader name"
            required
          />

          <InputField
            id="email"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter reader email"
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
              <Button
                onClick={() => handleEdit(reader)}
                variant="primary"
                size="sm"
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleOpenDeleteModal(reader.id)}
                variant="danger"
                size="sm"
              >
                Delete
              </Button>
            </>
          )}
        />

        <ModalForm
          title="Confirm Delete"
          show={confirmDeleteId !== null}
          onClose={handleCloseDeleteModal}
          onSubmit={() => {
            if (confirmDeleteId !== null) handleDelete(confirmDeleteId);
          }}
          confirmOnly
        >
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this reader?
          </p>
        </ModalForm>
      </div>
    </>
  );
}
