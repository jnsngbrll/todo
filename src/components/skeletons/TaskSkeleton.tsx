import React from 'react';

export default function TaskSkeleton() {
  return (
    <div className="p-4 bg-gray-500 rounded-md ">
      <div className="animate-pulse flex flex-col justify-between gap-y-12">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-slate-700 h-4 w-28"></div>
            <div className="rounded-full bg-slate-700 h-2 w-12"></div>
          </div>
          <div className="space-y-1">
            <div className="rounded-full bg-slate-700 h-2 w-28"></div>
            <div className="rounded-full bg-slate-700 h-2 w-16"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-slate-700 h-4 w-20"></div>
          <div className="flex gap-x-2">
            <div className="h-4 w-4 bg-slate-700 rounded"></div>
            <div className="h-4 w-4 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
