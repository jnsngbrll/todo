import ContextProvider from '@/context/Context';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextProvider>
      <div className="max-w-7xl mx-auto p-8 space-y-8 overflow-hidden">
        <div className="flex gap-x-8">
          <Sidebar />
          <main className="w-full">{children}</main>
        </div>
        <Footer />
      </div>
    </ContextProvider>
  );
}
