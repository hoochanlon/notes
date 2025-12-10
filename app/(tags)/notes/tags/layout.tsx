import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function TagsLayout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-14">
        {children}
      </main>
    </HomeLayout>
  );
}

