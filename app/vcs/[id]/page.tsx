import { Header } from '@/components/Header';
import { VCSDetailClient } from '@/components/vcs/VCSDetailClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return []; 
}

export default function VCSPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <VCSDetailClient deviceId={id} />
      </main>
    </div>
  );
}
