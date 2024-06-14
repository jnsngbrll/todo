import React, { useContext, useState } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import axios from 'axios';

import { Context } from '@/context/Context';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import TaskSkeleton from '../skeletons/TaskSkeleton';
import toast from 'react-hot-toast';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  isCompleted,
  createdAt,
}) => {
  const { setAddTaskModalShow, setTaskModalTitle, fetchTasks } =
    useContext(Context);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCompletedButtonClick = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.put('/api/task/', {
        id,
        isCompleted: isCompleted === false ? true : false,
      });
      setIsLoading(false);
      if (isCompleted === false) {
        toast.success('1 task completed!');
      }
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete('/api/task', {
        data: { id },
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createdAtDate = new Date(createdAt);
  const date = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'short',
  });

  const handleEditButtonClick = async (id: string) => {
    try {
      const response = await axios.get(`/api/task?id=${id}`);
      console.log(response.data);
      setTaskModalTitle('Edit task');
      setAddTaskModalShow(true);
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading ? (
    <TaskSkeleton />
  ) : (
    <div
      className={`${
        isCompleted ? 'bg-white shadow-xl' : 'bg-gray-100'
      } p-4 rounded-md flex flex-col justify-between gap-y-12`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-xs font-medium">{date.format(createdAtDate)}</p>
        </div>
        <p className="text-xs font-semibold text-gray-500">{description}</p>
      </div>
      <div className="flex justify-between">
        <button onClick={() => handleCompletedButtonClick(id)}>
          {!isCompleted ? (
            <p className="text-xs py-1 px-2 bg-red-500 text-white rounded-full">
              Incomplete
            </p>
          ) : (
            <p className="text-xs py-1 px-2 bg-green-500 text-white rounded-full">
              Completed
            </p>
          )}
        </button>
        <div className="space-x-1">
          <button onClick={() => handleEditButtonClick(id)}>
            <FiEdit />
          </button>
          <button onClick={() => handleDeleteTask(id)}>
            <FiTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
