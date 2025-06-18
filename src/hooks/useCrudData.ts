import { useState, useEffect } from 'react';

interface CrudConfig<T, F = Record<string, unknown>> {
  endpoint: string;
  initialFormData: F;
  transformFormData?: (data: F) => Partial<T>;
}

export function useCrudData<T extends { id?: number }, F = Record<string, unknown>>({
  endpoint,
  initialFormData,
  transformFormData
}: CrudConfig<T, F>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState<F>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
      console.error('Error fetching items:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    } as F);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = transformFormData ? transformFormData(formData) : formData;
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${endpoint}/${editingId}` : endpoint;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingId ? 'update' : 'create'} item: ${response.statusText}`);
      }

      await fetchItems();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item: T) => {
    if (item.id !== undefined) {
      setEditingId(item.id);
    }
    // Convert item back to form data format
    setFormData(item as unknown as F);
    setShowModal(true);
  };

  const handleDelete = async (itemId: number) => {
    try {
      const response = await fetch(`${endpoint}/${itemId}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
      }
      
      await fetchItems();
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      console.error('Error deleting item:', err);
    }
  };

  const handleOpenAddModal = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    resetForm();
  };

  const handleOpenDeleteModal = (itemId: number) => {
    setConfirmDeleteId(itemId);
  };

  const handleCloseDeleteModal = () => {
    setConfirmDeleteId(null);
  };

  const clearError = () => {
    setError('');
  };

  const isEditing = editingId !== null;

  return {
    items,
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
    fetchItems,
    clearError,
  };
}
