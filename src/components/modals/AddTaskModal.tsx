'use client';

import React, { ChangeEvent, useContext, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import Input from '@/components/elements/Input';
import { Context } from '@/context/Context';
import BoxContainer from '@/components/BoxContainer';
import Button from '@/components/elements/Button';
import getActiveList from '@/actions/getActiveList';

export default function AddTaskModal() {
  const { projects, setAddTaskModalShow, taskModalTitle, fetchTasks } =
    useContext(Context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  const router = useRouter();

  const activeList = getActiveList();
  const [taskCategory, setTaskCategory] = useState(activeList);

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      project: '',
      description: '',
    },
  });

  const handleTaskCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTaskCategory(event.target.value);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/task', {
        ...data,
        project: taskCategory,
        description,
      });
      setAddTaskModalShow(false);
      fetchTasks();
      router.push(`/project/${response.data.project}`);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <BoxContainer>
      <h1 className="font-bold">{taskModalTitle}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          id="title"
          type="text"
          required
          placeholder="Task title"
          register={register}
          className="text-sm"
        />
        <div>
          <label
            htmlFor="description"
            className="text-xs font-semibold text-gray-500"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleChange}
            placeholder="Task description"
            className="w-full text-sm border rounded-md outline-none p-4"
          ></textarea>
        </div>
        <select
          defaultValue={activeList}
          onChange={handleTaskCategoryChange}
          className="border p-2 text-xs rounded-md outline-none"
        >
          {projects.map((project: { id: string; title: string }) => (
            <option key={project.id} value={project.title}>
              {project.title}
            </option>
          ))}
        </select>
        <div className="space-x-4">
          <Button
            type="submit"
            title={`${isLoading ? 'Adding your task...' : 'Submit'}`}
          />
          <Button
            onClick={() => setAddTaskModalShow(false)}
            type="button"
            title="Cancel"
            variant="outline"
          />
        </div>
      </form>
    </BoxContainer>
  );
}
