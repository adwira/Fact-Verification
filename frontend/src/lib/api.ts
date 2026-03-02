import type {
  VerificationRequest,
  VerificationResponse,
  ApiError,
} from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function verifyClaim(
  claim: string
): Promise<VerificationResponse> {
  const res = await fetch(`${API_BASE}/api/v1/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ claim } satisfies VerificationRequest),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err: ApiError = data;
    const message =
      err.message ??
      (typeof err.detail === "string"
        ? err.detail
        : Array.isArray(err.detail)
          ? err.detail.map((d) => d.msg).join(", ")
          : "Terjadi kesalahan. Silakan coba lagi.");
    throw new Error(message);
  }

  return data as VerificationResponse;
}
