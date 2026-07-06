import { VerificationForm } from "@/components/verification/VerificationForm";

export default function VerificationPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-lg">
        {/* LED top internal accent */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
        <VerificationForm
          placeholder="Ketik Berita Anda Disini"
          textareaClassName="min-h-[180px]"
        />
      </div>
    </div>
  );
}
