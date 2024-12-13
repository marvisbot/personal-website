export type MessageRole = 'student' | 'teacher' | 'definitions';
export type MessageType = 'definition' | 'proof' | 'critique' | 'default';
export type SessionStatus = 'in-progress' | 'proof-completed' | 'feedback-submitted';

export interface Message {
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: number;
}

export interface Feedback {
  score: 1 | 2 | 3 | 4;
  notes?: string;
  timestamp: number;
}

export interface Session {
  id: string;
  problem: string;
  messages: Message[];
  status: SessionStatus;
  showSteps: boolean;
  feedback?: Feedback;
  createdAt: number;
  updatedAt: number;
}

// For Firebase
export interface FirebaseSession extends Session {
  userId?: string;  // If I add authentication later
}

// API Request/Response types
export interface CreateSessionRequest {
  problem: string;
  showSteps: boolean;
}

export interface UpdateSessionRequest {
  feedback?: Feedback;
  status?: SessionStatus;
}

export interface SessionResponse {
  session: Session;
}