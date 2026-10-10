import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// =========================================================================
// KONFIGURASI DOMAIN RESMI PRODUK
// Ubah alamat ini jika Anda sudah memiliki domain produksi resmi Anda.
// Anda juga bisa mengaturnya melalui environment variable NEXT_PUBLIC_SITE_URL
// =========================================================================
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://verifai.id";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "VerifAI — Platform Verifikasi Fakta Berita Online Indonesia",
  description:
    "VerifAI membantu Anda memeriksa kebenaran klaim dan berita online di Indonesia dengan rujukan bukti transparan dari media massa terpercaya.",
  keywords: [
    "verifikasi fakta",
    "cek fakta indonesia",
    "anti hoaks",
    "verifikasi berita",
    "literasi digital",
    "verifai",
  ],
  authors: [{ name: "VerifAILabs", url: SITE_URL }],
  creator: "VerifAILabs",
  publisher: "VerifAILabs",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "VerifAI — Platform Verifikasi Fakta Berita Online Indonesia",
    description:
      "Periksa kebenaran klaim berita Indonesia dengan bukti dan tautan sumber media terverifikasi.",
    url: SITE_URL,
    siteName: "VerifAI",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VerifAI — Platform Verifikasi Fakta Berita Online Indonesia",
    description:
      "Periksa kebenaran klaim berita Indonesia dengan bukti dan tautan sumber media terverifikasi.",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
