'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ViewToggle({ currentView }) {
  return (
    <div className="flex gap-4">
      <Link
        href="/?view=buslog"
        className={`px-4 py-2 rounded-md ${
          currentView === 'buslog' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        Bus Log
      </Link>
      <Link
        href="/?view=management"
        className={`px-4 py-2 rounded-md ${
          currentView === 'management' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        Bus Management
      </Link>
    </div>
  );
}