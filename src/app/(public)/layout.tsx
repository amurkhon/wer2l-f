import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ScrollProgress } from '@/components/shared/ScrollProgress';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <Header />
      {/* pt offsets the fixed header; the home hero pulls itself back up under it */}
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
