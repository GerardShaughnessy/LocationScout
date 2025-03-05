'use client';
import LoginForm from '../components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </Link>
        </div>
      </div>
    </>
  );
} 