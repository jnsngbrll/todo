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
  const { categories, setCategpries, tasks } = useContext(Context);
  const [addCategory, setAddCategory] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      title: '',
    },
  });

  const session = useSession();
  const activeList = getActiveList();
  const router = useRouter();

  // ASYNCHRONOUS FUNCTION THAT WILL CREATE A NEW CATEGORY
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/category', data);
      router.push(`/tasks/${response.data.title}`);
      fetchCategories();
      setAddCategory(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // GET ALL CREATED CATEGORY
  const fetchCategories = async () => {
    const response = await axios.get('/api/category');
    setCategpries(response.data);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  // ASYNCHRONOUS FUNCTION THAT WILL DELETE A CATEGORY
  const handleDeleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete('/api/category', {
        data: { id },
      });
      fetchCategories();
      router.push('/tasks/all');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const countOfTaskForEachList = (title: string) => {
    return tasks.filter((task: { category: string }) => task.category === title)
      .length;
  };

  return (
    <aside className="w-72 p-4 flex flex-col justify-between bg-white rounded-md shadow-xl space-y-2">
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
            <h1>{isLoading ? 'Processing...' : 'Your list'}</h1>
          </div>
          <button onClick={() => setAddCategory(!addCategory)}>
            {!addCategory ? <IoAdd /> : <IoClose />}
          </button>
        </div>
        {addCategory && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center relative"
          >
            <Input
              id="title"
              type="text"
              placeholder="New list"
              required
              register={register}
              className="pr-10 text-sm"
            />
            <button
              type="submit"
              className="absolute right-4 p-1 bg-primary text-white rounded-md -mr-2"
            >
              <IoCheckmarkSharp />
            </button>
          </form>
        )}
        <div className="flex flex-col space-y-2">
          <Link
            href="/tasks/all"
            className={`py-2 px-4 rounded-md text-sm ${
              activeList === 'all'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            All
          </Link>
          {categories.map((category: { id: string; title: string }) => (
            <div
              key={category.id}
              className={`flex items-center justify-between px-4 rounded-md group ${
                activeList === category.title
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <p>{countOfTaskForEachList(category.title)}</p>
              <Link
                href={`/tasks/${category.title}`}
                className="w-full py-2 text-sm font-medium"
              >
                {category.title}
              </Link>
              <button
                onClick={() => handleDeleteCategory(category.id)}
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
