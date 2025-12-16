import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';
import { ToastProvider } from '../components/ToastProvider';
import { getUserIdFromSession } from '../lib/auth';

export const metadata = {
  title: 'Chondrobindu Slot Demo',
  description: 'Demo-only slot cabinet experience. No real money.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const userId = await getUserIdFromSession();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <ToastProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#0b1021,#05060f_45%)]">
            <header className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold tracking-tight">Chondrobindu</div>
                <div className="hidden sm:flex items-center gap-3 text-sm text-slate-300 flex-wrap">
                  <Link href="/">Home</Link>
                  <Link href="/slot">Cabinet</Link>
                  <Link href="/support">Support</Link>
                  <Link href="/profile">Profile</Link>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end text-sm">
                <div className="text-xs text-slate-400 hidden sm:block">Demo only • No real money • RTP tuned</div>
                {userId ? (
                  <Link className="btn bg-slate-800 border border-slate-700" href="/profile">
                    Profile
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link className="btn bg-slate-800 border border-slate-700" href="/auth/login">
                      Login
                    </Link>
                    <Link className="btn bg-cyan-500 text-slate-900" href="/auth/register">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </header>
            <main className="max-w-5xl mx-auto px-4 pb-12">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
