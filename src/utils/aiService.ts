import { InterviewQuestion, Answer } from '../types';

// Simulated AI service - in production, this would integrate with OpenAI, Anthropic, etc.
class AIService {
  private questionBank = {
    easy: [
      {
        question: "What is the difference between React functional components and class components?",
        category: "React Fundamentals"
      },
      {
        question: "Explain the concept of state in React and how it differs from props.",
        category: "React State Management"
      },
      {
        question: "What are React hooks and why were they introduced?",
        category: "React Hooks"
      },
      {
        question: "What is the difference between let, const, and var in JavaScript?",
        category: "JavaScript Fundamentals"
      },
    ],
    medium: [
      {
        question: "Explain the React component lifecycle methods and their use cases.",
        category: "React Lifecycle"
      },
      {
        question: "How would you optimize a React application for better performance?",
        category: "React Performance"
      },
      {
        question: "What are closures in JavaScript and how do they work?",
        category: "JavaScript Advanced"
      },
      {
        question: "Explain the event loop in Node.js and how it handles asynchronous operations.",
        category: "Node.js"
      },
    ],
    hard: [
      {
        question: "Design a scalable real-time chat application architecture using React and Node.js.",
        category: "System Design"
      },
      {
        question: "Implement a custom React hook for handling complex form validation with real-time feedback.",
        category: "React Advanced"
      },
      {
        question: "Explain how you would implement server-side rendering with React and handle SEO optimization.",
        category: "React SSR"
      },
      {
        question: "Design a microservices architecture for an e-commerce platform and explain the communication patterns.",
        category: "Architecture"
      },
    ]
  };

  async generateQuestions(): Promise<InterviewQuestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const questions: InterviewQuestion[] = [];
    
    // Select 2 easy, 2 medium, 2 hard questions
    const easyQuestions = this.getRandomQuestions(this.questionBank.easy, 2);
    const mediumQuestions = this.getRandomQuestions(this.questionBank.medium, 2);
    const hardQuestions = this.getRandomQuestions(this.questionBank.hard, 2);

    easyQuestions.forEach((q, index) => {
      questions.push({
        id: `easy-${index}`,
        question: q.question,
        difficulty: 'easy',
        timeLimit: 20,
        category: q.category
      });
    });

    mediumQuestions.forEach((q, index) => {
      questions.push({
        id: `medium-${index}`,
        question: q.question,
        difficulty: 'medium',
        timeLimit: 60,
        category: q.category
      });
    });

    hardQuestions.forEach((q, index) => {
      questions.push({
        id: `hard-${index}`,
        question: q.question,
        difficulty: 'hard',
        timeLimit: 120,
        category: q.category
      });
    });

    return questions;
  }

  async scoreAnswer(question: InterviewQuestion, answer: string, timeSpent: number): Promise<{ score: number; feedback: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple scoring algorithm - in production, this would use AI
    let score = 0;
    let feedback = "";

    const answerLength = answer.trim().length;
    const timeBonus = timeSpent < question.timeLimit * 0.8 ? 1 : 0;

    if (answerLength === 0) {
      score = 0;
      feedback = "No answer provided.";
    } else if (answerLength < 50) {
      score = 2 + timeBonus;
      feedback = "Answer is too brief. Consider providing more detailed explanations.";
    } else if (answerLength < 200) {
      score = 6 + timeBonus;
      feedback = "Good answer with decent explanation. Could benefit from more examples.";
    } else {
      score = 8 + timeBonus;
      feedback = "Excellent detailed answer with good understanding demonstrated.";
    }

    // Adjust score based on difficulty
    if (question.difficulty === 'easy') {
      score = Math.min(score, 8);
    } else if (question.difficulty === 'medium') {
      score = Math.min(score, 9);
    } else {
      score = Math.min(score, 10);
    }

    return { score, feedback };
  }

  async generateFinalSummary(answers: Answer[]): Promise<{ score: number; summary: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    const averageScore = totalScore / answers.length;
    const percentage = (totalScore / (answers.length * 10)) * 100;

    let performance = "";
    let recommendations = "";

    if (percentage >= 80) {
      performance = "Excellent performance";
      recommendations = "Strong candidate with solid technical knowledge. Recommended for next round.";
    } else if (percentage >= 60) {
      performance = "Good performance";
      recommendations = "Good technical understanding with room for improvement. Consider for technical round.";
    } else if (percentage >= 40) {
      performance = "Average performance";
      recommendations = "Basic technical knowledge demonstrated. May need additional training if hired.";
    } else {
      performance = "Below average performance";
      recommendations = "Limited technical knowledge. Not recommended for this role.";
    }

    const summary = `${performance} with ${percentage.toFixed(1)}% overall score. ${recommendations}`;

    return {
      score: Math.round(percentage),
      summary
    };
  }

  private getRandomQuestions(questions: any[], count: number) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export const aiService = new AIService();