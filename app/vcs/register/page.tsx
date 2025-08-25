import { Header } from '@/components/Header';
import { RegisterVCSForm } from '@/components/vcs/RegisterVCSForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterVCSPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="container mx-auto max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4">
                <ArrowLeft className="h-4 w-4" />
                กลับไปหน้า Dashboard
            </Link>
            <div className="flex items-center mb-6">
                <h1 className="text-lg font-semibold md:text-2xl">ลงทะเบียน VCS ใหม่</h1>
            </div>
            <RegisterVCSForm />
        </div>
      </main>
    </div>
  );
}
