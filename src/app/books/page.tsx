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
    <div className="plant-list-section mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-900 dark:text-white">
          Books
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <FilterDropdown
              label="Filter by Genre:"
              options={genres}
              value={filterGenre}
              onChange={setFilterGenre}
            />
          </div>
          
          <Button
            onClick={handleOpenAddModal}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg w-full sm:w-auto font-medium transition-colors duration-200"
            variant="success"
            size="md"
          >
            ➕ Add New Book
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <DataTable
          data={filteredBooks}
          columns={[
            { header: "Title", accessor: "title" },
            { header: "Author", accessor: "author" },
            { header: "Genre", accessor: "genre", className: "hidden sm:table-cell" },
            { header: "Year", accessor: "published_year", className: "hidden md:table-cell" },
          ]}
          actions={(book) => (
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <Button
                onClick={(e) => handleEdit(e, book)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors duration-200"
                variant="primary"
                size="sm"
              >
                Edit
              </Button>

              <Button
                onClick={(e) => handleOpenDeleteModal(e, book.id!)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors duration-200"
                variant="danger"
                size="sm"
                disabled={!book.id}
              >
                Delete
              </Button>
            </div>
          )}
          onRowClick={handleRowClick}
        />
      </div>

      <ModalForm
        title={isEditing ? "Edit Book" : "Add Book"}
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              value={formData.published_year}
              onChange={handleChange}
              required
            />
          </div>

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
        </div>
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
