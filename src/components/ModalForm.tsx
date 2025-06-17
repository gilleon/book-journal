"use client";

interface ModalFormProps {
  title: string;
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  confirmOnly?: boolean;
}

export default function ModalForm({
  title,
  show,
  onClose,
  onSubmit,
  children,
  confirmOnly = false,
}: ModalFormProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={onSubmit} className="grid gap-4">
          {children}
          <div className="flex justify-end space-x-2">
            {confirmOnly ? (
              <>
                <button
                  type="button"
                  onClick={onSubmit as () => void}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="bg-green-800 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
