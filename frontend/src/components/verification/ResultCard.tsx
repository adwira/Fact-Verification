"use client";

import type { VerificationResponse } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function getVerdictStyle(verdict: string): {
  bg: string;
  text: string;
  icon: typeof CheckCircle2;
} {
  const v = verdict.toLowerCase();
  if (v === "fakta")
    return {
      bg: "bg-[hsl(var(--verdict-fakta))]/20 text-green-400 border-green-500/40",
      text: "Fakta",
      icon: CheckCircle2,
    };
  if (v === "hoaks" || v === "disinformasi")
    return {
      bg: "bg-destructive/20 text-red-400 border-destructive/50",
      text: verdict,
      icon: XCircle,
    };
  return {
    bg: "bg-[hsl(var(--verdict-tidak-terbukti))]/20 text-amber-400 border-amber-500/40",
    text: verdict,
    icon: AlertCircle,
  };
}

interface ResultCardProps {
  data: VerificationResponse;
  className?: string;
}

export function ResultCard({ data, className }: ResultCardProps) {
  const style = getVerdictStyle(data.verdict);
  const Icon = style.icon;
  const confidencePercent = Math.round((data.confidence_score ?? 0) * 100);

  return (
    <Card className={cn("border-border bg-card/95", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">
          Klaim
        </CardTitle>
        <p className="text-foreground text-sm leading-relaxed">
          &ldquo;{data.claim}&rdquo;
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold",
              style.bg
            )}
          >
            <Icon className="h-4 w-4" />
            {style.text}
          </span>
          {data.is_from_cache && (
            <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              Dari cache
            </span>
          )}
          {data.verified_at && (
            <span className="rounded border border-border px-2 py-1 text-xs text-muted-foreground">
              {new Date(data.verified_at).toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-muted-foreground">
            Tingkat kepercayaan: {confidencePercent}%
          </p>
          <Progress value={confidencePercent} className="h-2.5" />
        </div>

        {data.explanation && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-muted-foreground">
              Penjelasan
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {data.explanation}
            </p>
          </div>
        )}

        {data.sources && data.sources.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Sumber
            </p>
            <ul className="space-y-1.5">
              {data.sources.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate max-w-[min(100%,280px)]">
                      {url}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
