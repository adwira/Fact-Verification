"use client";

import { cn } from "@/lib/utils";
import { Search, FileCheck, Sparkles } from "lucide-react";

const STEPS = [
  { id: "validate", label: "Validating input...", icon: FileCheck },
  { id: "search", label: "Searching sources...", icon: Search },
  { id: "analyze", label: "Analyzing evidence...", icon: Sparkles },
] as const;

interface LoadingStepsProps {
  currentStep?: number; // 0, 1, 2 - optional, will cycle if not provided
  className?: string;
}

export function LoadingSteps({ currentStep = 0, className }: LoadingStepsProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/80 p-6 backdrop-blur-sm",
        className
      )}
    >
      <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
        Verifikasi sedang diproses
      </p>
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStep;
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                isActive
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border/50 text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn("text-sm", isActive && "font-medium")}>
                {step.label}
              </span>
              {isActive && index === currentStep && (
                <span className="ml-auto">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
