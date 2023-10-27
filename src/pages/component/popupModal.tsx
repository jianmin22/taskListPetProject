import React, { useState } from 'react';
import Modal from 'react-modal';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { useUser } from '@clerk/nextjs';

Modal.setAppElement('#__next');

interface CustomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (input: string) => void;
  userId: string;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ isOpen, onClose, onConfirm, userId }) => {
  const [input, setInput] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]); // Array to store column names
  const router = useRouter();
  const notesCreateMutation = api.post.createTask.useMutation();

  const handleCreateTask = async () => {
    try {
      await notesCreateMutation.mutateAsync({ title: input, userId: userId }).then((result) => {
        router.push('/');
      });
    } catch (err) {
      console.error("Error creating note:", err);
    }
    onConfirm(input);
    setInput('');
    onClose();
  };

  const handleAddColumn = () => {
    if (input.trim() !== '') {
      setColumns([...columns, input]);
      setInput('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Custom Popup"
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded p-4 shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-semibold">Enter Column Name</h2>
        <input
          className="w-full mt-2 p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Column name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mt-2"
          onClick={handleAddColumn}
        >
          Add Column
        </button>

        {/* Display Columns */}
        {columns.map((column, columnIndex) => (
          <div key={columnIndex}>
            <h3>{column}</h3>
            {/* You can add tasks for each column here */}
          </div>
        ))}

        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleCreateTask}
          >
            Confirm
          </button>
          <button
            className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomPopup;
