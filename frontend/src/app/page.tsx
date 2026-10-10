"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronDown,
  Users,
  Building2,
  GraduationCap,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const [lang, setLang] = useState<"id" | "en">("id");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const isId = lang === "id";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Header currentLang={lang} onLanguageChange={setLang} />

      <main className="flex-1">
        {/* ================= 1. HERO SECTION ================= */}
        <section
          id="hero"
          className="relative border-b border-white/5 py-20 md:py-28 overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-3.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-md mb-6">
              <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>
                {isId
                  ? "Platform Verifikasi Fakta Berita Indonesia"
                  : "Indonesian News Fact-Checking Platform"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight md:leading-[1.15]">
              {isId
                ? "Periksa Kebenaran Klaim Berita dengan Bukti dan Sumber Tepercaya"
                : "Verify News Claims with Reliable Evidence and Credible Sources"}
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {isId
                ? "VerifAI membantu Anda menguji keabsahan informasi yang beredar di ruang digital Indonesia melalui penelusuran bukti berbasis liputan media massa kredibel."
                : "VerifAI helps you assess digital claims circulating in Indonesia by cross-referencing evidence against credible mass media reporting."}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/verification"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {isId ? "Coba Verifikasi" : "Try Verification"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#cara-kerja"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                {isId ? "Lihat Cara Kerja" : "How It Works"}
              </a>
            </div>
          </div>
        </section>

        {/* ================= 2. MASALAH ================= */}
        <section id="masalah" className="border-b border-white/5 py-14 bg-card/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="rounded-xl border border-white/10 bg-card/40 p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                {isId ? "Tantangan Informasi" : "The Information Challenge"}
              </h2>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                {isId
                  ? "Disinformasi dan klaim palsu menyebar dalam hitungan detik di media sosial dan grup percakapan, sedangkan proses verifikasi manual membutuhkan waktu yang panjang. Akibatnya, publik rentan mengambil keputusan penting berdasarkan informasi keliru sebelum klarifikasi faktual tersedia."
                  : "Misinformation and false claims spread in seconds across social networks and chat groups, whereas manual fact-checking takes considerable time. Consequently, the public is often left to make critical decisions based on false reports before verified clarifications emerge."}
              </p>
            </div>
          </div>
        </section>

        {/* ================= 3. CARA KERJA ================= */}
        <section id="cara-kerja" className="border-b border-white/5 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isId ? "Cara Kerja Sederhana" : "How It Works in 3 Steps"}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                {isId
                  ? "Tiga tahapan ringkas untuk memperoleh rujukan verifikasi yang jelas."
                  : "Three straightforward steps to access clear verification references."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Langkah 1 */}
              <div className="rounded-xl border border-white/10 bg-card/50 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-white font-mono font-bold text-sm mb-4 border border-primary/30">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isId ? "Masukkan Klaim Berita" : "Submit Claim or Text"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isId
                      ? "Salin dan tempel kalimat berita, pernyataan, atau kutipan yang ingin Anda telusuri ke dalam kolom periksa."
                      : "Paste the headline, quote, or news statement you want to examine into the check field."}
                  </p>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="rounded-xl border border-white/10 bg-card/50 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-white font-mono font-bold text-sm mb-4 border border-primary/30">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isId ? "Pencarian Bukti Kredibel" : "Cross-Check Evidence"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isId
                      ? "Sistem menelusuri laporan dan bukti faktual dari arsip media massa tepercaya yang terverifikasi."
                      : "The system gathers factual reports and evidence from reputable, verified news archives."}
                  </p>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="rounded-xl border border-white/10 bg-card/50 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-white font-mono font-bold text-sm mb-4 border border-primary/30">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isId ? "Terima Hasil & Sumber" : "Review Verdict & Sources"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isId
                      ? "Dapatkan label status yang jelas, ringkasan penjelasan konteks, serta tautan langsung ke artikel sumber."
                      : "Receive a clear status label, concise explanatory context, and direct links to source articles."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. CONTOH HASIL ================= */}
        <section id="contoh-hasil" className="border-b border-white/5 py-16 sm:py-20 bg-card/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isId ? "Contoh Hasil Analisis" : "Sample Verification Output"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {isId
                  ? "Gambaran format informasi yang akan Anda peroleh setelah proses verifikasi selesai."
                  : "An illustration of the structured report delivered upon verification."}
              </p>
            </div>

            {/* Illustrative Result Card */}
            <div className="relative rounded-xl border border-white/15 bg-card/70 p-6 sm:p-8 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  {isId ? "Contoh Ilustrasi (Bukan Berita Nyata)" : "Illustrative Example (Not Real News)"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isId ? "Format Uji: Simulasi Tampilan" : "Test Format: Visual Preview"}
                </span>
              </div>

              {/* Claim */}
              <div className="mb-5">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  {isId ? "Klaim Masukan:" : "Submitted Claim:"}
                </div>
                <blockquote className="border-l-2 border-primary pl-3 text-base font-medium text-white italic">
                  &ldquo;Kementerian Perhubungan mewajibkan seluruh sepeda motor roda dua memasang transmisi darurat khusus per 1 November 2025.&rdquo;
                </blockquote>
              </div>

              {/* Verdict Label */}
              <div className="mb-5 flex items-center gap-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {isId ? "Label Hasil:" : "Result Verdict:"}
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-red-500/20 px-3 py-1 text-sm font-semibold text-red-400 border border-red-500/30">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  {isId ? "Hoaks / Tidak Terbukti" : "False / Unverified"}
                </span>
              </div>

              {/* Explanation */}
              <div className="mb-6">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  {isId ? "Penjelasan Bukti:" : "Evidence Summary:"}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {isId
                    ? "Hingga saat ini tidak terdapat regulasi resmi maupun siaran pers dari kementerian terkait mengenai kewajiban pemasangan transmisi darurat pada sepeda motor pribadi. Sejumlah portal berita nasional terdaftar telah menerbitkan liputan sanggahan yang mengonfirmasi kabar tersebut tidak memiliki dasar faktual."
                    : "No official regulations or announcements have been issued regarding mandatory emergency transmissions for private motorcycles. Multiple verified national news outlets have reported explicit clarifications confirming the claim lacks factual basis."}
                </p>
              </div>

              {/* Sources */}
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  {isId ? "Tautan Sumber Rujukan:" : "Referenced Sources:"}
                </div>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center justify-between rounded-lg border border-white/5 bg-background/50 px-3 py-2">
                    <span className="text-slate-300">
                      [Media Berita Nasional A] — &ldquo;Klarifikasi Isu Kewajiban Alat Tambahan Motor&rdquo;
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary hover:underline cursor-default">
                      {isId ? "Tautan Contoh" : "Sample Link"}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </li>
                  <li className="flex items-center justify-between rounded-lg border border-white/5 bg-background/50 px-3 py-2">
                    <span className="text-slate-300">
                      [Portal Informasi Publik B] — &ldquo;Pemerintah Tegaskan Tidak Ada Aturan Transmisi Khusus Motor&rdquo;
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary hover:underline cursor-default">
                      {isId ? "Tautan Contoh" : "Sample Link"}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. MENGAPA BISA DIPERCAYA ================= */}
        <section id="kepercayaan" className="border-b border-white/5 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isId ? "Mengapa VerifAI Dapat Dipercaya" : "Why Trust VerifAI"}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                {isId
                  ? "Prinsip transparansi, verifikasi sumber terdaftar, dan akuntabilitas terbuka."
                  : "Principles of transparency, registered sources, and open accountability."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-white/10 bg-card/40 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {isId ? "Media Terverifikasi Dewan Pers" : "Press Council Registered Media"}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? "Bukti rujukan dibatasi secara disiplin pada media massa nasional yang terdaftar dan memenuhi standar verifikasi Dewan Pers untuk menjaga validitas informasi."
                    : "Referenced reporting is strictly limited to national news organizations registered and verified by the Indonesian Press Council to ensure informational reliability."}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-card/40 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {isId ? "Transparansi Bukti & Tautan Langsung" : "Direct Evidence Transparency"}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? "Setiap hasil selalu menyertakan alasan penjelasan logis beserta tautan sumber rujukan asli agar pengguna dapat meninjau langsung kebenaran liputan."
                    : "Every verdict is accompanied by contextual reasoning and direct links to original reporting so users can examine the findings themselves."}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-card/40 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {isId ? "Label Jujur Saat Informasi Kurang" : "Honest Insufficient Data Label"}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? "Ketika bukti media belum mencukupi atau peristiwa baru terjadi, sistem secara jujur memberikan status 'Informasi Tidak Cukup' tanpa memaksakan simpulan."
                    : "When reliable evidence is scarce or a story is still breaking, the system transparently issues an 'Insufficient Information' label rather than forcing a conclusion."}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-card/40 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Scale className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {isId ? "Instrumen Bantu, Bukan Putusan Final" : "Decision Aid, Not Final Verdict"}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? "VerifAI bertindak sebagai alat bantu penelusuran awal untuk mempercepat verifikasi berita, bukan pengganti nalar kritis pembaca maupun keputusan hukum."
                    : "VerifAI serves as an assistive instrument to accelerate news vetting, never as a replacement for critical human judgement or a definitive judicial ruling."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. UNTUK SIAPA ================= */}
        <section id="target-pengguna" className="border-b border-white/5 py-16 sm:py-20 bg-card/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isId ? "Dirancang untuk Siapa" : "Who VerifAI Is For"}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                {isId
                  ? "Mendukung berbagai pihak yang membutuhkan kepastian fakta secara cepat dan akuntabel."
                  : "Empowering stakeholders who require rapid, verifiable factual accuracy."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-xl border border-white/10 bg-card/40 p-5">
                <Building2 className="h-7 w-7 text-primary mb-3" aria-hidden="true" />
                <h3 className="text-base font-semibold text-white mb-2">
                  {isId ? "Jurnalis & Ruang Redaksi" : "Journalists & Newsrooms"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? "Mempercepat penyaringan awal klaim viral sebelum memasuki tahapan peliputan atau penulisan mendalam."
                    : "Expedite initial screening of viral claims before deploying in-depth reporting resources."}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-card/40 p-5">
                <GraduationCap className="h-7 w-7 text-primary mb-3" aria-hidden="true" />
                <h3 className="text-base font-semibold text-white mb-2">
                  {isId ? "Mahasiswa & Peneliti" : "Students & Researchers"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? "Memvalidasi rujukan peristiwa dan diskursus publik untuk keperluan kajian akademik serta tugas ilmiah."
                    : "Cross-examine public discourse and reference validity for academic papers and social studies."}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-card/40 p-5">
                <Users className="h-7 w-7 text-primary mb-3" aria-hidden="true" />
                <h3 className="text-base font-semibold text-white mb-2">
                  {isId ? "Komunitas Literasi Digital" : "Digital Literacy Groups"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? "Menyediakan rujukan sanggahan terstruktur bagi relawan anti-hoaks dalam mengedukasi warga."
                    : "Provide structured rebuttal evidence for community advocates combating disinformation."}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-card/40 p-5">
                <ShieldCheck className="h-7 w-7 text-primary mb-3" aria-hidden="true" />
                <h3 className="text-base font-semibold text-white mb-2">
                  {isId ? "Publik Umum" : "General Public"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? "Memastikan kebenaran tautan dan pesan berantai sebelum membagikannya ke keluarga atau rekan kerja."
                    : "Confirm the veracity of chain messages and forwarded news before sharing with family or peers."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 7. HASIL EVALUASI (92% pada 100 klaim uji berlabel) ================= */}
        <section id="evaluasi" className="border-b border-white/5 py-16 bg-card/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              {isId ? "Transparansi Evaluasi Pengujian" : "Benchmark Evaluation"}
            </h2>
            <div className="my-4 inline-block rounded-2xl border border-white/15 bg-card/80 px-8 py-6 shadow-inner">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                92% pada 100 klaim uji berlabel
              </div>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {isId
                ? "Catatan metode: Evaluasi diuji secara independen terhadap kumpulan data klaim berita berlabel acuan (ground truth) yang mencakup berbagai topik peristiwa nasional terkini."
                : "Methodology note: Evaluated independently against a curated ground-truth test dataset spanning diverse contemporary Indonesian national news events."}
            </p>
          </div>
        </section>

        {/* ================= 8. TENTANG KAMI ================= */}
        <section id="tentang-kami" className="border-b border-white/5 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isId ? "Tentang Pengembang" : "About the Initiative"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {isId
                  ? "Identitas inisiatif riset di balik pengembangan platform VerifAI."
                  : "The research initiative and team behind the ongoing development of VerifAI."}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-card/40 p-6 sm:p-8">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    {isId ? "Inisiatif Riset" : "Research Initiative"}
                  </dt>
                  <dd className="font-semibold text-white text-base">
                    VerifAILabs
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    {isId ? "Tim Pengembang" : "Development Team"}
                  </dt>
                  <dd className="text-slate-200">
                    Tim Peneliti VerifAILabs
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    {isId ? "Wilayah Operasional" : "Location"}
                  </dt>
                  <dd className="text-slate-200">
                    Indonesia
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    {isId ? "Kontak Narahubung" : "Contact"}
                  </dt>
                  <dd className="text-slate-200 font-mono">
                    <a href="mailto:arya@adwira.dev" className="text-primary hover:underline">
                      arya@adwira.dev
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ================= 9. FAQ ================= */}
        <section id="faq" className="border-b border-white/5 py-16 sm:py-20 bg-card/10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isId ? "Pertanyaan Umum (FAQ)" : "Frequently Asked Questions"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {isId
                  ? "Jawaban terbuka atas pertanyaan seputar cara kerja, sumber, dan batasan sistem."
                  : "Open answers regarding system boundaries, data sources, and accuracy."}
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  qId: "Seberapa akurat hasil verifikasi VerifAI dan apa batasannya?",
                  qEn: "How accurate are VerifAI verification results and what are their limitations?",
                  aId: "VerifAI mengumpulkan bukti dari arsip pelaporan media tepercaya pada saat klaim diperiksa. Akurasi sangat bergantung pada ketersediaan liputan faktual atas topik tersebut. Sistem tidak menjanjikan akurasi mutlak 100% dan selalu menyajikan tautan sumber asli agar pengguna dapat melakukan telaah mandiri.",
                  aEn: "VerifAI retrieves evidence from credible news reporting at the time of inquiry. Precision correlates with factual coverage availability. The platform does not guarantee 100% certainty and always offers original source links for independent review.",
                },
                {
                  qId: "Sumber berita apa saja yang dijadikan rujukan oleh sistem?",
                  qEn: "What news sources does the system reference?",
                  aId: "Rujukan penelusuran difokuskan pada penerbit media massa dan portal berita nasional yang telah terdata dan memenuhi pedoman verifikasi Dewan Pers. Sistem tidak merujuk pada blog pribadi tanpa badan hukum atau akun media sosial anonim.",
                  aEn: "Evidence searches prioritize established national press publications and news portals registered and verified by the Indonesian Press Council. Personal blogs and unverified social media posts are excluded.",
                },
                {
                  qId: "Bagaimana keamanan dan privasi data teks yang saya masukkan?",
                  qEn: "How is the privacy of submitted text handled?",
                  aId: "Teks atau tautan yang Anda masukkan diproses semata-mata untuk menelusuri kecocokan bukti pada sesi verifikasi Anda. Kami tidak meminta, menyimpan, atau memperjualbelikan identitas pribadi pengunjung untuk dapat menggunakan fitur ini.",
                  aEn: "Submitted claims are processed exclusively to retrieve relevant evidence for your active query. We do not solicit, store, or monetize personal identifiable data to access the tool.",
                },
                {
                  qId: "Apakah hasil verifikasi yang ditampilkan bisa keliru?",
                  qEn: "Can the verification output ever be incorrect?",
                  aId: "Bisa, terutama jika sebuah peristiwa baru saja berlangsung (breaking news) sehingga liputan resmi belum lengkap, atau apabila terdapat perbedaan sudut pandang di antara berbagai sumber media. Oleh karena itu, VerifAI berposisi sebagai instrumen bantu awal, bukan pemutus kebenaran tunggal.",
                  aEn: "Yes, particularly during breaking news events where official reporting is incomplete, or when conflicting accounts exist across publications. For this reason, VerifAI functions as a discovery aid rather than an absolute arbiter.",
                },
                {
                  qId: "Siapa pihak yang membuat dan memelihara platform ini?",
                  qEn: "Who creates and maintains this platform?",
                  aId: "Platform ini dikembangkan dan dikelola oleh VerifAILabs, sebuah inisiatif riset independen di Indonesia yang berfokus pada instrumen integritas informasi publik.",
                  aEn: "This platform is built and maintained by VerifAILabs, an independent research initiative in Indonesia focusing on public information integrity tools.",
                },
                {
                  qId: "Apakah layanan VerifAI berbayar atau mewajibkan login?",
                  qEn: "Does VerifAI require payment or user registration?",
                  aId: "Layanan verifikasi dasar dapat diakses secara terbuka tanpa keharusan mendaftarkan akun, tanpa biaya langganan, dan tanpa memasukkan data pembayaran.",
                  aEn: "The core verification service is openly accessible without mandatory account registration, subscription fees, or payment credentials.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/10 bg-card/40 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-medium text-white hover:text-slate-200 transition-colors"
                    aria-expanded={openFaq === idx}
                  >
                    <span>{isId ? item.qId : item.qEn}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="border-t border-white/5 px-4 pb-4 pt-2 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isId ? item.aId : item.aEn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 10. CALL TO ACTION ================= */}
        <section className="py-16 sm:py-20 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isId
                ? "Mulai Periksa Berita Sekarang"
                : "Start Verifying News Today"}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              {isId
                ? "Lindungi diri dan lingkungan Anda dari paparan informasi keliru dengan penelusuran bukti terpercaya."
                : "Guard against deceptive claims by validating digital news with credible sources."}
            </p>
            <div className="mt-6">
              <Link
                href="/verification"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                {isId ? "Coba Verifikasi" : "Launch Verification"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer currentLang={lang} />
    </div>
  );
}
