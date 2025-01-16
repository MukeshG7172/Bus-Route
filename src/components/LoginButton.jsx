'use client';
import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';

export default function LoginButton({ session }) {
  if (!session) {
    return (
      <button
        onClick={() => signIn('google')}
        className="bg-yellow-400 text-black px-4 py-2 rounded-md"
      >
        Admin Login
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut()}
      className="bg-yellow-400 text-black px-4 py-2 rounded-md"
    >
      Logout
    </button>
  );
}