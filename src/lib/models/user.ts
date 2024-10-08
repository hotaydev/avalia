import type { User } from "firebase/auth";

export interface FairUser {
  email: string;
  fairId: string;
  inviteAccepted?: boolean;
}

export interface AdminUser {
  user?: User | null;
  error?: string;
}
