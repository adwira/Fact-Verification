import { VerificationForm } from "@/components/verification/VerificationForm";

export default function VerificationPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border-2 border-indigo-500/40 bg-[#242635] p-4 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
        <VerificationForm
          placeholder="Type Your News here"
          textareaClassName="min-h-[180px]"
        />
      </div>
    </div>
  );
}
