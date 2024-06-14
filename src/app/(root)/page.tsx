import AuthForm from '@/components/AuthForm';

export default function RootPage() {
  return (
    <div className="w-full h-screen py-4 px-16 ">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-center">
        <div className="hidden md:block col-span-2 space-y-4">
          <h1 className="text-9xl font-black">ToDo.</h1>
          <p className="text-2xl text-white text-balance shrink animate-pulse">
            Let&apos;s Manage your tasks, set priorities, and stay organized
            with customizable lists and easy-to-use features.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
