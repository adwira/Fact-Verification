import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Sparkles, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <section className="mb-12 text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary/90">
            <Sparkles className="h-4 w-4" aria-hidden />
            Welcome to VerifAI
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Instantly Verify The Fact
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
            Share your news to verify the truth. Enter your news and verify the
            fact with VerifAI.
          </p>
        </section>

        <section className="mx-auto flex max-w-md flex-col items-center gap-4">
          <Link
            href="/verification"
            className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-lg border-2 border-indigo-400/60 bg-transparent px-8 text-base font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-colors hover:bg-white/5"
          >
            <MessageCircle className="h-5 w-5" />
            Chat / Verifikasi
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            Mulai verifikasi klaim berita Anda
          </p>
        </section>
      </main>
    </div>
  );
}
