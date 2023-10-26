import React, { useState } from 'react';
import { useRouter } from "next/router";
import Modal from 'react-modal';
import { api } from '~/utils/api';
Modal.setAppElement('#__next');

interface CustomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (input: string) => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ isOpen, onClose, onConfirm }) => {
  
  const [input, setInput] = useState('');
  const router = useRouter(); // Importing useRouter hook for navigation
const notesCreateMutation = api.post.createTask.useMutation();
const handleCreateTask = async () => {
  try {
      await notesCreateMutation.mutateAsync({ title:input,userId:"user_2XDgEvWkWgkngCNkoDhriH3ZYan" }).then((result) => {
          router.push('/'); // Navigate back to index page
      });
  } catch (err) {
      console.error("Error creating note:", err);
  }
  onConfirm(input);
    setInput('');
    onClose();
};
  const handleConfirm = () => {
    
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Custom Popup"
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded p-4 shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-semibold">Enter Task Title</h2>
        <input
          className="w-full mt-2 p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Task name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
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
