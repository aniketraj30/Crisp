Crisp AI Interview Assistant
Welcome to the Crisp AI Interview Assistant, a React-based application designed to streamline the interview process for full-stack developer roles. This tool provides an AI-powered chat interface for candidates (Interviewee Tab) and a dashboard for interviewers (Interviewer Tab) to manage and review interviews efficiently.
Overview

Interviewee Tab: Allows candidates to upload a resume (PDF or DOCX), answer dynamically generated questions with timers, and receive real-time feedback and a final score.
Interviewer Tab: Displays a list of candidates with scores, searchable and sortable, and detailed views of their chat history, answers, and AI-generated summaries.
Features: Resume parsing, timed interview questions (easy, medium, hard), AI-driven scoring, local data persistence, and pause/resume functionality.

Prerequisites

Node.js (version 14.x or higher)
npm (comes with Node.js)
A modern web browser (Chrome, Firefox, etc.)

Installation

Clone the Repository:
git clone https://github.com/your-username/crisp-ai-interview-assistant.git
cd crisp-ai-interview-assistant


Install Dependencies:
npm install


Set Up Environment:

Ensure you have an AI service API (e.g., for aiService) configured. Create a .env file in the root directory and add your API keys or endpoints:REACT_APP_AI_API_KEY=your-api-key
REACT_APP_AI_ENDPOINT=https://your-ai-service-endpoint


Note: The AI service is assumed to handle question generation, answer scoring, and summary generation. Replace the placeholder in utils/aiService.ts with your actual implementation.


Run the Application:
npm start

Open http://localhost:3000 in your browser to see the app.


Usage
Interviewee Tab

Upload Resume: Click "Upload Resume" to submit a PDF or DOCX file containing your name, email, and phone number. The app will process it and prompt for missing information if needed.
Answer Questions: Respond to AI-generated questions within the allotted time (20s for easy, 60s for medium, 120s for hard). Use the input field to type answers.
Change Resume: Click the cross (❌) next to your name in the header to clear the current resume and upload a new one.
Exit Interview: Click "Exit Interview" during the process to end early and view a partial summary.
Complete Interview: Answer all 6 questions to receive a final score and summary.

Interviewer Tab

View Candidates: See a list of candidates sorted by score by default. Use the search bar or sort options (score, name, date) to filter.
View Details: Click a candidate to see their profile, chat history, answers, and AI summary.

Features

Resume Parsing: Extracts name, email, and phone from uploaded resumes using AI and regex fallbacks.
Timed Questions: Enforces time limits per question with a visual timer.
AI Integration: Generates questions, scores answers (0-10), and provides summaries (0-100).
Local Persistence: Saves progress locally; reopen the app to resume.
Responsive Design: Built with Tailwind CSS for a beautiful, production-ready UI.

Project Structure
crisp-ai-interview-assistant/
├── public/              # Static files
├── src/
│   ├── components/      # React components (e.g., IntervieweeTab, InterviewerTab)
│   ├── store/           # Redux store and slices
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Utility files (e.g., resumeParser, aiService)
│   └── App.tsx          # Main app component
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
└── README.md            # This file

Dependencies

React: For the UI framework.
Redux: For state management.
Tailwind CSS: For styling.
Lucide React: For icons.
pdfjs-dist: For PDF parsing in the browser.
mammoth: For DOCX parsing.
Other: TypeScript, React-Redux, etc. (see package.json).

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/new-feature).
Commit changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature/new-feature).
Open a Pull Request.

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

Inspired by the Swipe Internship Assignment.
Thanks to the open-source community for libraries like pdfjs-dist and mammoth.

Support
For issues or questions, please open an issue on the GitHub repository or contact the maintainers.
