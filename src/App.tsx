import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setShowWelcomeBack } from './store/interviewSlice';
import { IntervieweeTab } from './components/IntervieweeTab';
import { InterviewerTab } from './components/InterviewerTab';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { MessageCircle, BarChart3, Brain } from 'lucide-react';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate } = useSelector((state: RootState) => state.interview);
  const [activeTab, setActiveTab] = useState<'interviewee' | 'interviewer'>('interviewee');

  useEffect(() => {
    // Check if there's an unfinished session
    if (currentCandidate && 
        (currentCandidate.status === 'interviewing' || currentCandidate.status === 'paused') &&
        Date.now() - currentCandidate.lastActivity > 30000) { // 30 seconds
      dispatch(setShowWelcomeBack(true));
    }
  }, [currentCandidate, dispatch]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Crisp</h1>
              <p className="text-sm text-gray-600">AI-Powered Interview Assistant</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Built for Swipe Internship Assignment
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('interviewee')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'interviewee'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Interviewee</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('interviewer')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'interviewer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Interviewer Dashboard</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'interviewee' ? (
          <IntervieweeTab />
        ) : (
          <InterviewerTab />
        )}
      </main>

      {/* Welcome Back Modal */}
      <WelcomeBackModal />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={
        <div className="h-screen flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading Crisp...</span>
          </div>
        </div>
      } persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;