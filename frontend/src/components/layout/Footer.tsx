import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface FooterProps {
  currentLang?: "id" | "en";
}

export function Footer({ currentLang = "id" }: FooterProps) {
  const isId = currentLang === "id";

  return (
    <footer className="border-t border-white/5 bg-[#080A0E] py-12 text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white font-bold tracking-tight mb-3"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <span>VERIFAI</span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed mb-4">
              {isId
                ? "Platform verifikasi fakta berita online berbahasa Indonesia dengan rujukan bukti media massa terpercaya."
                : "Indonesian news fact-checking platform delivering evidence-based verification from trusted media."}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-md">
              {isId
                ? "Pemberitahuan: VerifAI adalah instrumen bantu penelusuran informasi digital dan bukan merupakan putusan hukum atau pengganti pertimbangan redaksional resmi."
                : "Disclaimer: VerifAI operates as an informational verification instrument and is not a judicial verdict or a substitute for professional editorial judgment."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              {isId ? "Navigasi" : "Navigation"}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#cara-kerja" className="hover:text-white transition-colors">
                  {isId ? "Cara Kerja" : "How It Works"}
                </a>
              </li>
              <li>
                <a href="#kepercayaan" className="hover:text-white transition-colors">
                  {isId ? "Kredibilitas & Sumber" : "Credibility & Sources"}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  {isId ? "Pertanyaan Umum" : "FAQ"}
                </a>
              </li>
              <li>
                <Link href="/verification" className="hover:text-white transition-colors">
                  {isId ? "Ruang Verifikasi" : "Verification Tool"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contacts */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              {isId ? "Inisiatif & Kontak" : "Initiative & Contact"}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">
                  {isId ? "Pengembang:" : "Developer:"} VerifAILabs
                </span>
              </li>
              <li>
                <a
                  href="mailto:arya@adwira.dev"
                  className="hover:text-white transition-colors font-mono"
                >
                  arya@adwira.dev
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  {isId ? "Kebijakan Privasi Data" : "Data Privacy"}
                </a>
              </li>
              <li>
                <a href="#kepercayaan" className="hover:text-white transition-colors">
                  {isId ? "Ketentuan Penggunaan" : "Terms of Use"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            &copy; 2025 VerifAILabs. {isId ? "Seluruh hak cipta dilindungi undang-undang." : "All rights reserved."}
          </div>
          <div>
            {isId ? "Inisiatif Riset Verifikasi Fakta" : "Fact-Checking Research Initiative"}
          </div>
        </div>
      </div>
    </footer>
  );
}
