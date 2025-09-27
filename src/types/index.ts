export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeFile?: File;
  resumeText?: string;
  status: 'uploading' | 'collecting-info' | 'interviewing' | 'completed' | 'paused';
  currentQuestion: number;
  questions: InterviewQuestion[];
  answers: Answer[];
  score: number;
  summary: string;
  startTime: number;
  endTime?: number;
  lastActivity: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  category: string;
}

export interface Answer {
  questionId: string;
  answer: string;
  timeSpent: number;
  score: number;
  feedback: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  questionId?: string;
  isTyping?: boolean;
}

export interface InterviewState {
  currentCandidate: Candidate | null;
  candidates: Candidate[];
  chatMessages: ChatMessage[];
  isInterviewActive: boolean;
  currentTimer: number;
  showWelcomeBack: boolean;
}