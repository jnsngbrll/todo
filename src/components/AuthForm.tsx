'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

import Input from '@/components/elements/Input';
import AuthButton from '@/components/elements/AuthButton';
import Button from '@/components/elements/Button';
import BoxContainer from './BoxContainer';

import { IoLogoGithub } from 'react-icons/io5';
import { TbEyeClosed, TbEye } from 'react-icons/tb';

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/tasks/all');
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    setVariant(variant === 'LOGIN' ? 'REGISTER' : 'LOGIN');
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (variant === 'REGISTER') {
      try {
        setIsLoading(true);
        axios.post('/api/register', data);
        toast.success('You are successfully registered!');
        setVariant('LOGIN');
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong.');
      } finally {
        setIsLoading(false);
      }
    }

    if (variant === 'LOGIN') {
      setIsLoading(true);
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials.');
          }
          if (callback?.ok && !callback?.error) {
            toast.success('You are successfully logged in!');
            router.push('/tasks/all');
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials.');
        }
        if (callback?.ok && !callback?.error) {
          toast.success('You are successfully logged in!');
          router.push('/tasks/all');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <BoxContainer>
      <h1 className="font-bold text-center">
        {variant === 'LOGIN' ? 'Login' : 'Register'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {variant === 'REGISTER' && (
          <Input
            label="Name"
            id="name"
            type="text"
            required
            placeholder="Your name"
            register={register}
            className="placeholder:text-sm"
          />
        )}
        <Input
          label="Email"
          id="email"
          type="email"
          required
          placeholder="Your email"
          register={register}
          className="placeholder:text-sm"
        />
        <div className="flex relative">
          <Input
            label="Password"
            id="password"
            type={!showPassword ? 'password' : 'text'}
            required
            placeholder="Your password"
            register={register}
            className="placeholder:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-9 right-4"
          >
            {!showPassword ? <TbEyeClosed /> : <TbEye />}
          </button>
        </div>
        <Button
          type="submit"
          title={
            variant === 'LOGIN'
              ? `${isLoading ? 'Loading...' : 'Login'}`
              : `${isLoading ? 'Loading...' : 'Register'}`
          }
        />
      </form>
      <p className="text-sm text-center text-gray-500">
        {variant === 'LOGIN'
          ? 'Dont have an accout?'
          : 'Already have an accout?'}{' '}
        <button onClick={toggleVariant} className="font-semibold text-black">
          {variant === 'LOGIN' ? 'Register' : 'Login'}
        </button>
      </p>
      <div className="border-b flex items-center justify-center relative">
        <span className="absolute bg-white px-2 text-sm text-gray-500">
          Or continue with
        </span>
      </div>
      <AuthButton
        onClick={() => socialAction('github')}
        icon={IoLogoGithub}
        title="Github"
      />
    </BoxContainer>
  );
}
