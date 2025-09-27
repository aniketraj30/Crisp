import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Search, Filter, Eye, Trophy, Clock, User, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { Candidate } from '../types';

export const InterviewerTab: React.FC = () => {
  const { candidates } = useSelector((state: RootState) => state.interview);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filteredAndSortedCandidates = candidates
    .filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return b.startTime - a.startTime;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'interviewing': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'collecting-info': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    const duration = (endTime || Date.now()) - startTime;
    const minutes = Math.floor(duration / (1000 * 60));
    return `${minutes} min`;
  };

  if (selectedCandidate) {
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </button>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCandidate.status)}`}>
              {selectedCandidate.status.replace('-', ' ')}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Candidate Profile */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedCandidate.name}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedCandidate.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedCandidate.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Interview Date</p>
                      <p className="font-medium">
                        {new Date(selectedCandidate.startTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">Final Score</span>
                    </div>
                    <p className={`text-2xl font-bold ${getScoreColor(selectedCandidate.score)}`}>
                      {selectedCandidate.score}/100
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatDuration(selectedCandidate.startTime, selectedCandidate.endTime)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Questions</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedCandidate.answers.length}/6
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {selectedCandidate.summary && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Assessment Summary</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-800">{selectedCandidate.summary}</p>
              </div>
            </div>
          )}

          {/* Question & Answer Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Details</h3>
            
            {selectedCandidate.questions.map((question, index) => {
              const answer = selectedCandidate.answers.find(a => a.questionId === question.id);
              const difficultyColors = {
                easy: 'bg-green-100 text-green-800',
                medium: 'bg-yellow-100 text-yellow-800', 
                hard: 'bg-red-100 text-red-800'
              };

              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">Question {index + 1}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[question.difficulty]}`}>
                        {question.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{question.category}</span>
                    </div>
                    {answer && (
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          Time: {answer.timeSpent}s / {question.timeLimit}s
                        </span>
                        <span className={`font-semibold ${getScoreColor(answer.score * 10)}`}>
                          {answer.score}/10
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <p className="font-medium text-gray-900 mb-2">Question:</p>
                    <p className="text-gray-700">{question.question}</p>
                  </div>
                  
                  {answer ? (
                    <>
                      <div className="mb-3">
                        <p className="font-medium text-gray-900 mb-2">Answer:</p>
                        <div className="bg-gray-50 p-3 rounded border">
                          <p className="text-gray-700">{answer.answer}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900 mb-2">AI Feedback:</p>
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                          <p className="text-gray-700">{answer.feedback}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="text-gray-500 italic">Not answered yet</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Interview Dashboard</h2>
            <p className="text-sm text-gray-600">{candidates.length} candidates total</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredAndSortedCandidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <User className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No candidates yet</h3>
            <p className="text-sm text-gray-400 text-center max-w-md">
              Candidates will appear here as they complete their interviews. 
              Share the interviewee tab with candidates to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCandidate(candidate)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status.replace('-', ' ')}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{candidate.email}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(candidate.startTime).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDuration(candidate.startTime, candidate.endTime)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-yellow-600" />
                          <span className={`font-semibold ${getScoreColor(candidate.score)}`}>
                            {candidate.score}/100
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">
                            {candidate.answers.length}/6 questions
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View Details</span>
                      </div>
                    </div>

                    {candidate.summary && (
                      <div className="mt-4 bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-700 line-clamp-2">{candidate.summary}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};