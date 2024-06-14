'use client';

import React, { useState, useEffect, useContext } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

import Input from '@/components/elements/Input';
import { Context } from '@/context/Context';
import getActiveList from '@/actions/getActiveList';

import {
  IoList,
  IoAdd,
  IoClose,
  IoLogOutOutline,
  IoEllipsisVerticalSharp,
  IoCheckmarkSharp,
} from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Sidebar() {
  const { projects, setProjects, tasks } = useContext(Context);
  const [addProject, setAddProject] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      title: '',
    },
  });

  const session = useSession();
  const activeList = getActiveList();
  const router = useRouter();

  // ASYNCHRONOUS FUNCTION THAT WILL CREATE A NEW PROJECT
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      const isProjoctExist = projects.filter(
        (project: { title: string }) => project.title === data.title
      );

      if (data.title === 'All' || 'all') {
        router.push(`/project/all`);
        setAddProject(false);
      } else {
        if (isProjoctExist) {
          router.push(`/project/${data.title}`);
          setAddProject(false);
        }
      }

      const response = await axios.post('/api/project', data);
      router.push(`/project/${response.data.title}`);
      fetchProjects();
      setAddProject(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // GET ALL CREATED PROJECT
  const fetchProjects = async () => {
    const response = await axios.get('/api/project');
    setProjects(response.data);
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  // ASYNCHRONOUS FUNCTION THAT WILL DELETE A PROJECT
  const handleDeleteProject = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete('/api/project', {
        data: { id },
      });
      fetchProjects();
      router.push('/project/all');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const countOfTaskForEachList = (title: string) => {
    return tasks.filter((task: { project: string }) => task.project === title)
      .length;
  };

  return (
    <aside className="w-96 p-4 flex flex-col justify-between bg-white rounded-md shadow-xl space-y-2">
      <div className="space-y-4">
        <div className="pb-4 border-b flex items-center gap-x-2">
          <img
            src={session?.data?.user?.image || '/avatar.png'}
            alt="Avatar"
            className="size-10 rounded-full"
          />
          <div>
            <h1 className="text-sm font-bold">{session.data?.user?.name}</h1>
            <p className="text-xs font-semibold text-gray-400">
              Tasks ({tasks.length})
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1 text-sm font-medium text-gray-500">
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <IoList size={16} />
            )}
            <h1>{isLoading ? 'Processing...' : 'My Projects'}</h1>
          </div>
          <button onClick={() => setAddProject(!addProject)}>
            {!addProject ? <IoAdd /> : <IoClose />}
          </button>
        </div>
        {addProject && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center relative"
          >
            <Input
              id="title"
              type="text"
              placeholder="Add new project"
              required
              register={register}
              className="pr-14 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 h-full px-3 bg-primary text-white rounded-r-md -mr-2"
            >
              <IoCheckmarkSharp />
            </button>
          </form>
        )}
        <div className="flex flex-col space-y-2">
          <div
            className={`flex items-center justify-between px-4 rounded-md group ${
              activeList === 'all'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Link
              href="/project/all"
              className="w-full py-2 text-sm font-medium"
            >
              All
            </Link>
            <p className="text-sm">{tasks.length}</p>
          </div>
          {projects.map((project: { id: string; title: string }) => (
            <div
              key={project.id}
              className={`flex items-center justify-between px-4 rounded-md group ${
                activeList === project.title
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Link
                href={`/project/${project.title}`}
                className="w-full py-2 text-sm font-medium"
              >
                {project.title}
              </Link>
              <p className="text-sm">{countOfTaskForEachList(project.title)}</p>
              <button
                onClick={() => handleDeleteProject(project.id)}
                className="hidden group-hover:block"
              >
                <IoEllipsisVerticalSharp />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div
        onClick={() => signOut()}
        className="flex items-center gap-x-2 py-2 px-4 bg-[#93A5CF] rounded-md cursor-pointer"
      >
        <IoLogOutOutline color="white" />
        <p className="text-sm font-bold text-white">Logout</p>
      </div>
    </aside>
  );
}
