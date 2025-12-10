import type { ReactNode } from 'react';

export default function TagsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-14">
      {children}
    </main>
  );
}

