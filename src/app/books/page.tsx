'use client';

import ModalForm from "../../components/ModalForm";
import DataTable from "../../components/DataTable";
import FilterDropdown from "../../components/FilterDropdown";
import BookDetailsModal from "../../components/BookDetailsModal";
import InputField from "../../ui/InputField";
import Button from "@/ui/Button";
import { useBookData } from "../../hooks/useBookData";

export default function BooksPage() {
  const {
    filteredBooks,
    genres,
    formData,
    updateMethod,
    isEditing,
    showModal,
    filterGenre,
    confirmDeleteId,
    selectedBook,
    showDetailsModal,
    readerId,
    handleChange,
    setUpdateMethod,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleRowClick,
    handleCloseModal,
    handleCloseDetailsModal,
    handleOpenAddModal,
    handleCloseDeleteModal,
    handleOpenDeleteModal,
    setFilterGenre,
  } = useBookData();

  return (
    <div className="p-6 plant-list-section">
      <h1 className="text-3xl text-center font-bold mb-4 text-gray-900 dark:text-gray-100">
        Books
      </h1>

      <FilterDropdown
        label="Filter by Genre:"
        options={genres}
        value={filterGenre}
        onChange={setFilterGenre}
      />

      <DataTable
        data={filteredBooks}
        columns={[
          { header: "Title", accessor: "title" },
          { header: "Author", accessor: "author" },
          { header: "Genre", accessor: "genre" },
          { header: "Year", accessor: "published_year" },
        ]}
        actions={(book) => (
          <>
            <Button
              onClick={(e) => handleEdit(e, book)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
              variant="primary"
              size="sm"
            >
              Edit
            </Button>

            <Button
              onClick={(e) => handleOpenDeleteModal(e, book.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
              variant="danger"
              size="sm"
            >
              Delete
            </Button>
          </>
        )}
        onRowClick={handleRowClick}
      />

      <Button
        onClick={handleOpenAddModal}
        className="mb-4 bg-green-700 text-white px-4 py-2 rounded add-plant-button"
        variant="success"
        size="md"
      >
        ➕ Add New Book
      </Button>

      {/* Modals */}
      <ModalForm
        title={isEditing ? "Edit Book" : "Add Book"}
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      >
        <InputField
          id="title"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <InputField
          id="author"
          label="Author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <InputField
          id="genre"
          label="Genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
        />

        <InputField
          id="published_year"
          label="Published Year"
          type="number"
          name="published_year"
          value={formData.published_year?.toString() ?? ""}
          onChange={handleChange}
          required
        />

        {isEditing && (
          <InputField
            id="updateMethod"
            label="Update Method:"
            type="radio"
            name="updateMethod"
            value={updateMethod}
            onRadioChange={(value) => setUpdateMethod(value as "PUT" | "PATCH")}
            options={[
              { value: "PUT", label: "Full Update (PUT)" },
              { value: "PATCH", label: "Partial Update (PATCH)" },
            ]}
            className="pt-4 border-t border-gray-200 dark:border-gray-700"
          />
        )}
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
          Are you sure you want to delete this book?
        </p>
      </ModalForm>

      {showDetailsModal && selectedBook && typeof selectedBook.id === "number" && readerId !== null && (
        <BookDetailsModal
          book={selectedBook as {
            id: number;
            title: string;
            author: string;
            genre: string;
            published_year: number;
          }}
          readerId={readerId}
          show={showDetailsModal}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
}
