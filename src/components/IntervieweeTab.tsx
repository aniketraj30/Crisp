import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  setCurrentCandidate, 
  addChatMessage, 
  updateCandidateField, 
  addCandidate,
  setQuestions,
  nextQuestion,
  addAnswer,
  setFinalScore,
  setInterviewActive,
  clearChat
} from '../store/interviewSlice';
import { ChatMessage } from './ChatMessage';
import { Timer } from './Timer';
import { Upload, Send, FileText, User, Mail, Phone, X } from 'lucide-react';
import { ResumeParser } from '../utils/resumeParser';
import { aiService } from '../utils/aiService';
import { Candidate, ChatMessage as ChatMessageType, InterviewQuestion } from '../types';

export const IntervieweeTab: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate, chatMessages, isInterviewActive } = useSelector((state: RootState) => state.interview);
  
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!currentCandidate) {
      initializeChat();
    }
  }, [currentCandidate]);

  const initializeChat = () => {
    dispatch(clearChat());
    dispatch(addChatMessage({
      id: Date.now().toString(),
      type: 'ai',
      content: 'Welcome to Crisp AI Interview Assistant! I\'m here to help you through your full-stack developer interview.\n\nLet\'s start by uploading your resume (PDF or DOCX format).',
      timestamp: Date.now(),
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.docx'];
    
    if (!validTypes.includes(file.type) && !validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: 'Please upload a valid PDF or DOCX file.',
        timestamp: Date.now(),
      }));
      return;
    }

    setIsUploading(true);
    
    try {
      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'system',
        content: 'Processing your resume...',
        timestamp: Date.now(),
      }));

      const parsedData = await ResumeParser.parseFile(file);
      
      const newCandidate: Candidate = {
        id: Date.now().toString(),
        name: parsedData.name || '',
        email: parsedData.email || '',
        phone: parsedData.phone || '',
        resumeFile: file,
        resumeText: parsedData.fullText,
        status: 'collecting-info',
        currentQuestion: 0,
        questions: [],
        answers: [],
        score: 0,
        summary: '',
        startTime: Date.now(),
        lastActivity: Date.now(),
      };

      dispatch(setCurrentCandidate(newCandidate));
      dispatch(addCandidate(newCandidate));

      // Check for missing fields
      const missingFields = [];
      if (!parsedData.name) missingFields.push('Name');
      if (!parsedData.email) missingFields.push('Email');
      if (!parsedData.phone) missingFields.push('Phone');

      if (missingFields.length > 0) {
        dispatch(addChatMessage({
          id: Date.now().toString(),
          type: 'ai',
          content: `Great! I've processed your resume. However, I need some additional information:\n\n${missingFields.map(field => `• ${field}`).join('\n')}\n\nLet's start with your ${missingFields[0].toLowerCase()}. Please provide your ${missingFields[0].toLowerCase()}:`,
          timestamp: Date.now(),
        }));
      } else {
        startInterview();
      }
      
    } catch (error) {
      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: `Error processing resume: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: Date.now(),
    };

    dispatch(addChatMessage(userMessage));
    
    if (currentCandidate?.status === 'collecting-info') {
      await handleMissingInfo(message.trim());
    } else if (currentCandidate?.status === 'interviewing') {
      await handleInterviewAnswer(message.trim());
    }

    setMessage('');
  };

  const handleMissingInfo = async (info: string) => {
    if (!currentCandidate) return;

    // Determine which field to update based on what's missing
    if (!currentCandidate.name) {
      dispatch(updateCandidateField({ field: 'name', value: info }));
      
      if (!currentCandidate.email) {
        dispatch(addChatMessage({
          id: Date.now().toString(),
          type: 'ai',
          content: 'Perfect! Now, please provide your email address:',
          timestamp: Date.now(),
        }));
        return;
      }
    } else if (!currentCandidate.email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(info)) {
        dispatch(addChatMessage({
          id: Date.now().toString(),
          type: 'ai',
          content: 'Please provide a valid email address (example: john@example.com):',
          timestamp: Date.now(),
        }));
        return;
      }
      
      dispatch(updateCandidateField({ field: 'email', value: info }));
      
      if (!currentCandidate.phone) {
        dispatch(addChatMessage({
          id: Date.now().toString(),
          type: 'ai',
          content: 'Great! Finally, please provide your phone number:',
          timestamp: Date.now(),
        }));
        return;
      }
    } else if (!currentCandidate.phone) {
      dispatch(updateCandidateField({ field: 'phone', value: info }));
    }

    // All info collected, start interview
    setTimeout(() => startInterview(), 1000);
  };

  const startInterview = async () => {
    if (!currentCandidate) return;

    dispatch(addChatMessage({
      id: Date.now().toString(),
      type: 'ai',
      content: 'Excellent! All your information has been collected. I\'m now preparing your personalized interview questions for a full-stack developer position.\n\nYou\'ll face 6 questions total:\n• 2 Easy questions (20 seconds each)\n• 2 Medium questions (60 seconds each)  \n• 2 Hard questions (120 seconds each)\n\nGenerating questions now...',
      timestamp: Date.now(),
    }));

    try {
      const questions = await aiService.generateQuestions();
      dispatch(setQuestions(questions));
      dispatch(updateCandidateField({ field: 'status', value: 'interviewing' }));
      
      setTimeout(() => {
        askNextQuestion(questions[0]);
      }, 2000);
      
    } catch (error) {
      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: 'Error generating questions. Please refresh and try again.',
        timestamp: Date.now(),
      }));
    }
  };

  const askNextQuestion = (question: InterviewQuestion) => {
    dispatch(setInterviewActive(true));
    setCurrentQuestionStartTime(Date.now());
    
    const difficultyEmoji = {
      easy: '🟢',
      medium: '🟡', 
      hard: '🔴'
    };

    dispatch(addChatMessage({
      id: Date.now().toString(),
      type: 'ai',
      content: `${difficultyEmoji[question.difficulty]} **Question ${(currentCandidate?.currentQuestion || 0) + 1}/6** (${question.difficulty.toUpperCase()}) - ${question.timeLimit}s\n\n**Category:** ${question.category}\n\n**Question:** ${question.question}`,
      timestamp: Date.now(),
      questionId: question.id,
    }));
  };

  const handleInterviewAnswer = async (answer: string) => {
    if (!currentCandidate) return;
    
    const currentQ = currentCandidate.questions[currentCandidate.currentQuestion];
    if (!currentQ) return;

    const timeSpent = Math.floor((Date.now() - currentQuestionStartTime) / 1000);
    
    dispatch(setInterviewActive(false));
    
    // Add typing indicator
    const typingId = Date.now().toString();
    dispatch(addChatMessage({
      id: typingId,
      type: 'ai',
      content: 'Analyzing your answer...',
      timestamp: Date.now(),
      isTyping: true,
    }));

    try {
      const { score, feedback } = await aiService.scoreAnswer(currentQ, answer, timeSpent);
      
      const answerObj = {
        questionId: currentQ.id,
        answer,
        timeSpent,
        score,
        feedback,
        timestamp: Date.now(),
      };

      dispatch(addAnswer(answerObj));

      // Remove typing indicator and add feedback
      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: `**Score:** ${score}/10\n**Feedback:** ${feedback}\n\n${timeSpent < currentQ.timeLimit ? `Time taken: ${timeSpent}s` : 'Time expired - answer auto-submitted'}`,
        timestamp: Date.now(),
      }));

      setTimeout(() => {
        if (currentCandidate.currentQuestion < currentCandidate.questions.length - 1) {
          dispatch(nextQuestion());
          const nextQ = currentCandidate.questions[currentCandidate.currentQuestion + 1];
          setTimeout(() => askNextQuestion(nextQ), 2000);
        } else {
          finishInterview();
        }
      }, 3000);

    } catch (error) {
      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: 'Error scoring answer. Moving to next question...',
        timestamp: Date.now(),
      }));
    }
  };

  const handleTimeUp = () => {
    if (currentCandidate?.status === 'interviewing') {
      const currentAnswer = message.trim() || 'No answer provided (time expired)';
      handleInterviewAnswer(currentAnswer);
      setMessage('');
    }
  };

  const finishInterview = async () => {
    if (!currentCandidate) return;

    dispatch(addChatMessage({
      id: Date.now().toString(),
      type: 'ai',
      content: 'Generating your final assessment...',
      timestamp: Date.now(),
      isTyping: true,
    }));

    try {
      const { score, summary } = await aiService.generateFinalSummary(currentCandidate.answers);
      dispatch(setFinalScore({ score, summary }));

      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: `🎉 **Interview Complete!**\n\n**Final Score:** ${score}/100\n\n**Assessment Summary:**\n${summary}\n\nThank you for completing the interview! Your results have been saved and will be reviewed by our team.`,
        timestamp: Date.now(),
      }));

    } catch (error) {
      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: 'Interview completed! Error generating final summary.',
        timestamp: Date.now(),
      }));
    }
  };

  const exitInterview = async () => {
    if (!currentCandidate) return;

    dispatch(addChatMessage({
      id: Date.now().toString(),
      type: 'ai',
      content: 'Exiting interview early. Generating final assessment based on current progress...',
      timestamp: Date.now(),
      isTyping: true,
    }));

    try {
      const { score, summary } = await aiService.generateFinalSummary(currentCandidate.answers);
      dispatch(setFinalScore({ score, summary }));
      dispatch(updateCandidateField({ field: 'status', value: 'completed' }));

      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: `🎉 **Interview Ended!**\n\n**Final Score:** ${score}/100\n\n**Assessment Summary:**\n${summary}\n\nYour partial results have been saved and will be reviewed by our team.`,
        timestamp: Date.now(),
      }));
    } catch (error) {
      dispatch(addChatMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: 'Error generating final summary. Interview ended.',
        timestamp: Date.now(),
      }));
    }
  };

  const changeResume = () => {
    dispatch(setCurrentCandidate(null));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCurrentQuestion = (): InterviewQuestion | null => {
    if (!currentCandidate || !isInterviewActive) return null;
    return currentCandidate.questions[currentCandidate.currentQuestion] || null;
  };

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Interview Chat</h2>
            {currentCandidate && currentCandidate.name && (
              <span className="text-sm text-gray-600">
                {currentCandidate.name} 
                <button
                  onClick={changeResume}
                  className="ml-2 text-red-500 hover:text-red-700"
                  title="Change Resume"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            {!currentCandidate && (
              <p className="text-sm text-gray-600">Candidate</p>
            )}
          </div>
          
          {currentCandidate && currentCandidate.status !== 'completed' && (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Question {Math.min(currentCandidate.currentQuestion + 1, currentCandidate.questions.length)}/{currentCandidate.questions.length || 6}
              </div>
              {(currentCandidate.status === 'interviewing' || currentCandidate.status === 'collecting-info') && (
                <button
                  onClick={exitInterview}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Exit Interview
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Timer */}
      {currentQuestion && isInterviewActive && (
        <div className="p-4 bg-white border-b border-gray-200">
          <Timer
            duration={currentQuestion.timeLimit}
            isActive={isInterviewActive}
            onTimeUp={handleTimeUp}
          />
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isUploading && (
          <div className="flex justify-center">
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
              Processing resume...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        {!currentCandidate ? (
          <div className="flex items-center justify-center">
            <label htmlFor="resume-upload" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              <span>Upload Resume</span>
            </label>
            <input
              ref={fileInputRef}
              id="resume-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                currentCandidate.status === 'collecting-info' 
                  ? 'Type your response...' 
                  : currentCandidate.status === 'interviewing'
                  ? 'Type your answer...'
                  : 'Interview completed'
              }
              disabled={currentCandidate.status === 'completed' || isUploading}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || currentCandidate.status === 'completed' || isUploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};