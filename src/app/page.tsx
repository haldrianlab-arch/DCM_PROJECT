import { Logo } from "@/components/sirama/logo";
import { ComponentShowcase, TokenShowcase } from "./_showcase/showcase";

/**
 * Halaman sementara PR 1: meninjau token design system di preview Vercel.
 * Di PR 2 diganti pengalihan ke halaman awal sesuai peran (design.md §5.2).
 */
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-col gap-3">
        <Logo />
        <div>
          <h1 className="text-page-title">Token design system</h1>
          <p className="text-small text-ink-muted">
            Halaman sementara untuk meninjau warna, tipografi, dan komponen dasar. Diganti saat
            fitur login selesai.
          </p>
        </div>
      </header>
      <TokenShowcase />
      <ComponentShowcase />
    </main>
  );
}
