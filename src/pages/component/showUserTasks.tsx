import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Trash2 } from "lucide-react";
import PopupTasks from "./popupTaskList";
import AddTaskListPopup from "./addTaskList";
interface UserTask {
  taskID: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

interface TaskList {
  listID: string;
  taskID: string;
  taskDetails: string;
  sequence: number;
  status: boolean;
}

interface UserTaskWithTaskLists {
  userTask: UserTask;
  taskLists: TaskList[];
}


const ShowUserTasks: React.FC<{ userId: string }> = ({ userId }) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  const openPopup = () => {
      console.log("openPopup");
      setIsPopupOpen(true);
  };
const closePopup = () => {
  setIsPopupOpen(false);
};
const openAddTaskPopup = () => {
  console.log("openPopup");
  setIsAddTaskPopupOpen(true);
};
const closeAddTaskPopup = () => {
  setIsAddTaskPopupOpen(false);
};

const handleConfirm = (input: string) => {
  // Handle the input data (e.g., save it to state or send it to a server).
  console.log(`Task input: ${input}`);
};
const handleAddTaskConfirm = (input: string) => {
  // Handle the input data (e.g., save it to state or send it to a server).
  console.log(`Task input: ${input}`);
};
  const { data, isLoading: dataLoading } = api.post.showUserTasks.useQuery({
    userId: userId,
  });
  const deleteTaskMutation = api.post.deleteTask.useMutation();
  const handleDeleteTask = async (taskID: string) => {
    try {
      await deleteTaskMutation.mutateAsync({taskID}).then((result) => {
        window.location.reload();
      });
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };
  
  if (dataLoading) return <div className="flex grow">load</div>;

  if (!data) return <div>Error Loading Page</div>;

  return (
    <div className="flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="py-4 text-4xl font-bold">Task List</h2>
      </div>

      {data.length > 0 ? (
        data.map((tasks) => (
          <div
            key={tasks.userTask.taskID}
            className="m-3 max-w-md rounded-lg bg-white p-6 shadow-lg"
          >
            <div className="mb-4">
              <div className="mb-2 flex items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Title: {tasks.userTask.title}
                </h2>
                <p className="cursor-pointer" onClick={openAddTaskPopup}>Add Task</p>
                <p>{tasks.userTask.taskID}</p>
                <AddTaskListPopup isOpen={isAddTaskPopupOpen} onClose={closeAddTaskPopup} onConfirm={handleAddTaskConfirm} taskId={tasks.userTask.taskID} sequenceNumber={tasks.taskLists.length}/>
              </div>
              <div>
                {tasks.taskLists.map((taskList) => (
                  <div key={taskList.listID} className="mb-2">
                    <input
                      type="checkbox"
                      checked={taskList.status}
                      disabled
                      className="mr-2 cursor-not-allowed"
                    />
                    <span className="select-none text-gray-500">
                      {taskList.taskDetails} -{" "}
                      <a href={`#`}>View Full Version</a>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Trash2 onClick={() => handleDeleteTask(tasks.userTask.taskID)} />
            <p className="cursor-pointer" onClick={openPopup}>Click to see more details</p>
           <PopupTasks isOpen={isPopupOpen} onClose={closePopup} onConfirm={handleConfirm} taskId={tasks.userTask.taskID}/>
          </div>
        ))
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default ShowUserTasks;
