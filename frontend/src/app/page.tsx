"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sparkles, MessageCircle } from "lucide-react";
import { SuspendedModal } from "@/components/ui/SuspendedModal";

export default function Home() {
  const [isSuspendedModalOpen, setIsSuspendedModalOpen] = useState(false);

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
          <button
            type="button"
            onClick={() => setIsSuspendedModalOpen(true)}
            className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-lg border-2 border-red-400/60 bg-transparent px-8 text-base font-medium text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-colors hover:bg-white/5 cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            Verifikasi Berita Sekarang
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Mulai verifikasi klaim berita Anda
          </p>
        </section>
      </main>

      <SuspendedModal
        isOpen={isSuspendedModalOpen}
        onClose={() => setIsSuspendedModalOpen(false)}
      />
    </div>
  );
}

