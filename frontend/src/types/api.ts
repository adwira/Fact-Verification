// Maps to VerificationRequest in backend
export interface VerificationRequest {
  claim: string;
  bypass_cache?: boolean;
}

// Maps to VerificationResponse in backend
export type VerdictType =
  | "Fakta"
  | "Hoaks"
  | "Disinformasi"
  | "Tidak Terbukti";

export interface VerificationResponse {
  claim: string;
  verdict: VerdictType | string;
  confidence_score: number; // 0.0 to 1.0
  explanation: string;
  sources: string[];
  verified_at?: string;
  is_from_cache?: boolean;
}

// Backend AppBaseException response
export interface ApiError {
  status?: string;
  message?: string;
  path?: string;
  // FastAPI 422 validation
  detail?: string | { loc: (string | number)[]; msg: string; type: string }[];
}
