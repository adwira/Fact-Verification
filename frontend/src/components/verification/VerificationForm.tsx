"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSteps } from "./LoadingSteps";
import { ResultCard } from "./ResultCard";
import { verifyClaim } from "@/lib/api";
import type { VerificationResponse } from "@/types/api";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_CLAIM_LENGTH = 50;

type Status = "idle" | "loading" | "success" | "error";

interface VerificationFormProps {
  placeholder?: string;
  className?: string;
  textareaClassName?: string;
}

export function VerificationForm({
  placeholder = "Ketik atau tempel klaim berita di sini (min. 100 karakter)...",
  className,
  textareaClassName,
}: VerificationFormProps = {}) {
  const [claim, setClaim] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progressLog, setProgressLog] = useState<string | null>(null);

  const executeVerification = useCallback(
    async (bypassCache: boolean = false) => {
      const trimmed = claim.trim();
      if (trimmed.length < MIN_CLAIM_LENGTH) {
        setErrorMessage(
          `Klaim minimal ${MIN_CLAIM_LENGTH} karakter. Saat ini: ${trimmed.length} karakter.`
        );
        setStatus("error");
        return;
      }
      setErrorMessage(null);
      setStatus("loading");
      setResult(null);
      setLoadingStep(0);
      setProgressLog(null);

      const steps = [0, 1, 2];
      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          const next = prev + 1;
          if (next >= steps.length) clearInterval(stepInterval);
          return Math.min(next, steps.length - 1);
        });
      }, 2500);

      try {
        const data = await verifyClaim(trimmed, bypassCache, (msg) => {
          setProgressLog(msg);
        });
        clearInterval(stepInterval);
        setLoadingStep(2);
        setResult(data);
        setStatus("success");
      } catch (err) {
        clearInterval(stepInterval);
        setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
        setStatus("error");
      }
    },
    [claim]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await executeVerification(false);
    },
    [executeVerification]
  );

  const handleReset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setErrorMessage(null);
  }, []);

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-6", className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder={placeholder}
            value={claim}
            onChange={(e) => {
              setClaim(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            disabled={status === "loading"}
            className={cn(
              "min-h-[140px] resize-y text-base border-2 transition-colors",
              status === "error"
                ? "border-destructive focus-visible:ring-destructive"
                : "border-red-500/40 focus-visible:ring-ring",
              textareaClassName
            )}
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? "claim-error" : "claim-hint"}
          />
          <p
            id="claim-hint"
            className="mt-1.5 text-right text-xs text-muted-foreground"
          >
            {claim.length} karakter (Minimal {MIN_CLAIM_LENGTH} karakter)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {status !== "success" && status !== "error" && (
            <Button
              type="submit"
              size="lg"
              disabled={status === "loading" || claim.trim().length < MIN_CLAIM_LENGTH}
              className="min-w-[140px] rounded-xl"
            >
              {status === "loading" ? "Memverifikasi..." : "Verify"}
            </Button>
          )}
          {(status === "success" || status === "error") && (
            <Button type="button" variant="outline" size="lg" onClick={handleReset}>
              Verifikasi lagi
            </Button>
          )}
          {status === "success" && result?.is_from_cache && (
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={() => executeVerification(true)}
            >
              Verifikasi Tanpa Cache
            </Button>
          )}
        </div>
      </form>

      {status === "error" && errorMessage && (
        <div
          id="claim-error"
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Input ditolak atau terjadi kesalahan</p>
            <p className="mt-1 text-sm opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="mt-6 space-y-4">
          <LoadingSteps currentStep={loadingStep} />
          {progressLog && (
            <div className="flex justify-center">
              <span className="text-sm font-medium text-red-300 animate-pulse bg-red-900/30 px-4 py-2 rounded-full border border-red-500/20">
                {progressLog}
              </span>
            </div>
          )}
        </div>
      )}

      {status === "success" && result && (
        <ResultCard data={result} className="mt-6" />
      )}
    </div>
  );
}
