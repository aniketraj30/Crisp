import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setShowWelcomeBack, resumeInterview } from '../store/interviewSlice';
import { Coffee, Play, Clock, User } from 'lucide-react';

export const WelcomeBackModal: React.FC = () => {
  const dispatch = useDispatch();
  const { showWelcomeBack, currentCandidate } = useSelector((state: RootState) => state.interview);

  if (!showWelcomeBack || !currentCandidate) {
    return null;
  }

  const handleResume = () => {
    dispatch(resumeInterview());
    dispatch(setShowWelcomeBack(false));
  };

  const handleClose = () => {
    dispatch(setShowWelcomeBack(false));
  };

  const getTimeAway = () => {
    const timeDiff = Date.now() - currentCandidate.lastActivity;
    const minutes = Math.floor(timeDiff / (1000 * 60));
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Coffee className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">We've saved your progress</p>
          </div>

          {/* Candidate Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentCandidate.name}</p>
                <p className="text-sm text-gray-600">{currentCandidate.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium capitalize">
                  {currentCandidate.status.replace('-', ' ')}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Activity</p>
                <p className="font-medium">{getTimeAway()}</p>
              </div>
              <div>
                <p className="text-gray-500">Progress</p>
                <p className="font-medium">
                  {currentCandidate.currentQuestion + 1}/{currentCandidate.questions.length || 6} questions
                </p>
              </div>
              <div>
                <p className="text-gray-500">Score So Far</p>
                <p className="font-medium">
                  {currentCandidate.answers.reduce((sum, answer) => sum + answer.score, 0)}/
                  {currentCandidate.answers.length * 10} points
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Interview Progress</span>
              <span>{Math.round(((currentCandidate.currentQuestion + 1) / (currentCandidate.questions.length || 6)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentCandidate.currentQuestion + 1) / (currentCandidate.questions.length || 6)) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Only
            </button>
            <button
              onClick={handleResume}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Resume Interview</span>
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Your progress is automatically saved. You can resume anytime.
          </p>
        </div>
      </div>
    </div>
  );
};