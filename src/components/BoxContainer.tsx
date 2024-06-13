import React from 'react';

export default function BoxContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="shrink-0 space-y-8 bg-white p-8 rounded-md shadow-2xl">
      {children}
    </div>
  );
}
