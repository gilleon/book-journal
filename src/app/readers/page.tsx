"use client";

import ModalForm from "../../components/ModalForm";
import DataTable from "../../components/DataTable";
import InputField from "../../ui/InputField";
import Button from "../../ui/Button";
import { useReaderData } from "../../hooks/useReaderData";
import LoadingSpinner from "../../ui/LoadingSpinner";

export default function ReadersPage() {
  const {
    readers,
    formData,
    isEditing,
    showModal,
    confirmDeleteId,
    loading,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleOpenAddModal,
    handleCloseModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
  } = useReaderData();

  if (loading) {
    return <LoadingSpinner message="Loading readers..." />;
  }

  return (
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors duration-200"
              variant="primary"
              size="sm"
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
        title={isEditing ? "Edit Reader" : "Add Reader"}
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      >
        <InputField
          id="name"
          label="Name"
          name="name"
          value={formData.name as string}
          onChange={handleChange}
          placeholder="Enter reader name"
          required
        />

        <InputField
          id="email"
          label="Email"
          type="email"
          name="email"
          value={formData.email as string}
          onChange={handleChange}
          placeholder="Enter reader email"
          required
        />
      </ModalForm>

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
  );
}
