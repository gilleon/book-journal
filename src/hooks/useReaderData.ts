import { useCrudData } from './useCrudData';
import { API_BASE_URL } from '@/lib/api';

export interface Reader {
  id: number;
  name: string;
  email: string;
}

export function useReaderData() {
  const {
    items: readers,
    loading,
    error,
    formData,
    editingId,
    showModal,
    confirmDeleteId,
    isEditing,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleOpenAddModal,
    handleCloseModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    fetchItems: fetchReaders,
    clearError,
  } = useCrudData<Reader>({
    endpoint: `${API_BASE_URL}/readers`,
    initialFormData: {
      name: '',
      email: ''
    }
  });

  return {
    readers,
    loading,
    error,
    formData,
    editingId,
    showModal,
    confirmDeleteId,
    isEditing,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleOpenAddModal,
    handleCloseModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    fetchReaders,
    clearError,
  };
}