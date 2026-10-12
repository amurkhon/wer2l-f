import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ScrollProgress } from '@/components/shared/ScrollProgress';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    // `.cg` scopes the public design tokens (globals.css); admin keeps its own.
    <div className="cg flex min-h-screen flex-col">
      <ScrollProgress />
      <Header />
      {/* Rounded-bottom main slides away to reveal the pinned footer */}
      <main className="site-main-reveal flex-1">{children}</main>
      <Footer />
    </div>
  );
}
