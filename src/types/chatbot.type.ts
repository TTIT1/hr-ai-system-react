export interface ChatMessageRequest {
  sessionId?: string | null;
  message: string;
}

export interface ChatMessageResponse {
  sessionId: string;
  reply: string;
  intent: string;
  quickReplies: string[];
}

export interface ChatSession {
  id: string;
  createdAt?: string;
  lastActive?: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  intent?: string | null;
  dataSource?: string | null;
  createdAt?: string;
}
