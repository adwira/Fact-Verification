"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Mail, Copy, Check, X } from "lucide-react";
import { Button } from "./button";

interface SuspendedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuspendedModal({ isOpen, onClose }: SuspendedModalProps) {
  const [copied, setCopied] = useState(false);
  const contactEmail = "contact@adwira.dev";

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  }, [contactEmail]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-2xl shadow-amber-950/20 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent border line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Tutup Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon & Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20 mb-1">
              Status: Suspended
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Layanan Saat Ini Non-Aktif
            </h2>
          </div>
        </div>

        {/* Body Description */}
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed mb-6">
          <p>
            Mohon maaf, layanan verifikasi berita <strong className="text-white">VerifAI</strong> saat ini sedang <span className="text-amber-400 font-medium">di-suspend</span> karena aplikasi ini tidak memiliki sumber pendanaan untuk terus beroperasi.
          </p>
          <p>
            Jika Anda berminat untuk memberikan pendanaan, sponsor, atau menjalin kolaborasi pengembangan aplikasi ini, Anda dapat menghubungi developer langsung.
          </p>
        </div>

        {/* Contact Email Box */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 mb-6">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Kontak Developer / Kolaborasi
          </div>
          <div className="flex items-center justify-between gap-2 bg-background/80 rounded-lg p-2.5 border border-border">
            <div className="flex items-center gap-2 overflow-hidden text-sm font-mono text-white">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{contactEmail}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyEmail}
              className="shrink-0 h-8 gap-1 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Tutup
          </Button>
          <a
            href={`mailto:${contactEmail}?subject=Pendanaan%20/%20Kolaborasi%20VerifAI`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-sm transition-colors"
          >
            <Mail className="h-4 w-4" />
            Kirim Email
          </a>
        </div>
      </div>
    </div>
  );
}
