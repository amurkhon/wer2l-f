import Link from 'next/link';

export default function NotFound() {
  return (
    // Rendered outside the public layout, so it opts into the `.cg` tokens itself.
    <div className="cg relative flex min-h-screen flex-col items-center justify-center gap-5 overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 50% 40%, rgb(135 42 254 / calc(.3 * var(--cg-glow))), transparent 70%)',
        }}
      />
      <h1 className="anim-blur-in relative font-display text-[clamp(120px,22vw,220px)] font-bold leading-[0.8] tracking-[-0.04em] text-cg-fg">
        404
      </h1>
      <h2 className="relative type-headline text-cg-fg">Page Not Found</h2>
      <p className="relative type-body max-w-md text-cg-fg2">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="relative btn-cg btn-cg--lg btn-cg--primary mt-3">
        Return Home
      </Link>
    </div>
  );
}
