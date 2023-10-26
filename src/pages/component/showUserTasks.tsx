import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

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
  const { data, isLoading: dataLoading } = api.post.showUserTasks.useQuery({
    userId: userId,
  });

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
            <a href={`#`}>Click to see more details</a>
          </div>
        ))
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default ShowUserTasks;
