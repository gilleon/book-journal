import { useState, useEffect, useCallback } from 'react';

interface CrudItem {
  id: number;
}

interface CrudHookOptions<T extends CrudItem> {
  endpoint: string;
  initialFormData: Omit<T, 'id'>;
  transformFormData?: (data: Omit<T, 'id'>) => any;
}

export function useCrudData<T extends CrudItem>({
  endpoint,
  initialFormData,
  transformFormData = (data) => data,
}: CrudHookOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<Omit<T, 'id'>>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
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
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${endpoint}/${editingId}` : endpoint;
      const transformedData = transformFormData(formData);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData),
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
    setEditingId(item.id);
    // Extract all properties except 'id'
    const { id, ...itemData } = item;
    setFormData(itemData as Omit<T, 'id'>);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
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
