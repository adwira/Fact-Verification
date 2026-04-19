import type {
  VerificationRequest,
  VerificationResponse,
  ApiError,
} from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function verifyClaim(
  claim: string,
  bypass_cache?: boolean,
  onProgress?: (message: string) => void
): Promise<VerificationResponse> {
  const res = await fetch(`${API_BASE}/api/v1/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "text/event-stream" },
    body: JSON.stringify({ claim, bypass_cache } satisfies VerificationRequest),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
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

  if (!res.body) {
    throw new Error("Tidak ada respon dari server");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let result: VerificationResponse | null = null;
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const chunk of lines) {
      if (chunk.startsWith("data: ")) {
        const jsonStr = chunk.slice(6);
        try {
          const payload = JSON.parse(jsonStr);
          if (payload.type === "log" && onProgress) {
            onProgress(payload.message);
          } else if (payload.type === "result") {
            result = payload.payload;
          } else if (payload.type === "error") {
            throw new Error(payload.message);
          }
        } catch (e) {
          if (e instanceof SyntaxError) {
            continue;
          }
          throw e;
        }
      }
    }
  }

  if (result) return result as VerificationResponse;
  throw new Error("Gagal mendapatkan hasil dari server");
}
