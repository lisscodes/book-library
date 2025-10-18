// src/components/BookSkeleton.tsx
import React from "react";

export const BookSkeleton = () => {
  return (
    <div className="w-44 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 animate-pulse">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md" />
      <div className="mt-3 h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="mt-2 h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
};


