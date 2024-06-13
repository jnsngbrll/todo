import React from 'react';

export default function ListSkeleton() {
  return (
    <div className="py-2 px-4 rounded-md bg-primary animate-pulse">
      <div className="py-2">
        <div className="h-1 rounded-full bg-white"></div>
      </div>
    </div>
  );
}
