import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, ChatMessage, Answer, InterviewQuestion, InterviewState } from '../types';

const initialState: InterviewState = {
  currentCandidate: null,
  candidates: [],
  chatMessages: [],
  isInterviewActive: false,
  currentTimer: 0,
  showWelcomeBack: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCurrentCandidate: (state, action: PayloadAction<Candidate>) => {
      state.currentCandidate = action.payload;
    },
    updateCandidateField: (state, action: PayloadAction<{ field: keyof Candidate; value: any }>) => {
      if (state.currentCandidate) {
        (state.currentCandidate as any)[action.payload.field] = action.payload.value;
        state.currentCandidate.lastActivity = Date.now();
      }
    },
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<Candidate>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = action.payload;
      }
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    clearChat: (state) => {
      state.chatMessages = [];
    },
    setInterviewActive: (state, action: PayloadAction<boolean>) => {
      state.isInterviewActive = action.payload;
    },
    setCurrentTimer: (state, action: PayloadAction<number>) => {
      state.currentTimer = action.payload;
    },
    addAnswer: (state, action: PayloadAction<Answer>) => {
      if (state.currentCandidate) {
        state.currentCandidate.answers.push(action.payload);
        state.currentCandidate.lastActivity = Date.now();
      }
    },
    setQuestions: (state, action: PayloadAction<InterviewQuestion[]>) => {
      if (state.currentCandidate) {
        state.currentCandidate.questions = action.payload;
      }
    },
    nextQuestion: (state) => {
      if (state.currentCandidate) {
        state.currentCandidate.currentQuestion += 1;
        state.currentCandidate.lastActivity = Date.now();
      }
    },
    setFinalScore: (state, action: PayloadAction<{ score: number; summary: string }>) => {
      if (state.currentCandidate) {
        state.currentCandidate.score = action.payload.score;
        state.currentCandidate.summary = action.payload.summary;
        state.currentCandidate.status = 'completed';
        state.currentCandidate.endTime = Date.now();
        state.currentCandidate.lastActivity = Date.now();
      }
    },
    setShowWelcomeBack: (state, action: PayloadAction<boolean>) => {
      state.showWelcomeBack = action.payload;
    },
    pauseInterview: (state) => {
      if (state.currentCandidate) {
        state.currentCandidate.status = 'paused';
        state.currentCandidate.lastActivity = Date.now();
      }
      state.isInterviewActive = false;
    },
    resumeInterview: (state) => {
      if (state.currentCandidate) {
        state.currentCandidate.status = 'interviewing';
        state.currentCandidate.lastActivity = Date.now();
      }
      state.isInterviewActive = true;
    },
  },
});

export const {
  setCurrentCandidate,
  updateCandidateField,
  addCandidate,
  updateCandidate,
  addChatMessage,
  clearChat,
  setInterviewActive,
  setCurrentTimer,
  addAnswer,
  setQuestions,
  nextQuestion,
  setFinalScore,
  setShowWelcomeBack,
  pauseInterview,
  resumeInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;