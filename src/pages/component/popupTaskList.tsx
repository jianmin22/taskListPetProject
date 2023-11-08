import React, { useState } from 'react';
import { useRouter } from "next/router";
import Modal from 'react-modal';
import { api } from '~/utils/api';

Modal.setAppElement('#__next');

interface CustomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (input: string) => void;
  taskId: string;
  
}

interface TaskList {
  listID: string;
  taskID: string;
  taskDetails: string;
  sequence: number;
  status: boolean;
}

const PopupTasks: React.FC<CustomPopupProps> = ({ isOpen, onClose, onConfirm, taskId  }) => {
  const { data, isLoading: dataLoading, error } = api.post.showUserTasksList.useQuery({
    taskId: taskId,
  });
  console.log(data);
  const [input, setInput] = useState('');
  const router = useRouter();
  const taskListCreateMutation = api.post.createTaskList.useMutation();

  const handleCreateTask = async () => {
    onConfirm(input);
    setInput('');
    onClose();
  };

  if (dataLoading) return <div className="flex grow">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Custom Popup"
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded p-4 shadow-md max-w-md mx-auto">
      {data.length > 0 ? (
        data.map((tasks) => (
          <div
            key={tasks.listID}
            className="m-3 max-w-md rounded-lg bg-white p-6 shadow-lg"
          >
            <div className="mb-4">
              <div className="mb-2 flex items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Title: {tasks.taskDetails}
                </h2>
              </div>
              <div>
                
              </div>
            </div>
           
            
          </div>
        ))
      ) : (

        <p>No tasks available.</p>
      )}
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

export default PopupTasks;