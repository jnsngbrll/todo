import ContextProvider from '@/context/Context';
import Sidebar from '@/components/Sidebar';

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextProvider>
      <div className="max-w-7xl mx-auto h-screen p-8 flex gap-x-8 overflow-hidden">
        <Sidebar />
        <main className="w-full">{children}</main>
      </div>
    </ContextProvider>
  );
}
