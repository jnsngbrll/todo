import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

import ToastProvider from '@/providers/ToastProvider';
import AuthProvider from '@/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToDo.',
  description:
    'Manage your tasks, set priorities, and stay organized with customizable lists and easy-to-use features.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-r from-[#93A5CF] to-[#E4EfE9]`}
      >
        <AuthProvider>
          <ToastProvider />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
