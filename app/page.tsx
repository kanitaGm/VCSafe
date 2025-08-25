import { Header } from '@/components/Header';
import { VCSDashboardClient } from '@/components/vcs/VCSDashboardClient';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">VCS location</h1>
        </div>
        <VCSDashboardClient />
      </main>
    </div>
  );
}
