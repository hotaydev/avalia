export interface FairUser {
  email: string;
  fairId: string;
  inviteAccepted?: boolean;
}

export interface AdminUser {
  email?: string | null;
  token?: string;
  refreshToken?: string;
  uid?: string;
  error?: string;
}
