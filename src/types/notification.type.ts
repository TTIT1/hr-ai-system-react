export interface NotificationItem {
  id: number | string;
  title: string;
  message?: string;
  content?: string;
  targetRole?: string;
  createdBy?: string;
  createdAt?: string;
  read?: boolean;
}

export interface NotificationRequest {
  title: string;
  content: string;
  targetRole?: string | null;
}
