import { VerificationLayout } from "@/components/layout/VerificationLayout";

export default function VerificationRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VerificationLayout>{children}</VerificationLayout>;
}
