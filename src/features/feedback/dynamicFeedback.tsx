import React, { useState, useEffect } from 'react';
import { RefreshCw, Send } from 'lucide-react';

/**
 * @interface FeedbackQuestion
 * @property {string} id - The ID of the question.
 * @property {string} question - The question text.
 * @property {('textarea' | 'scale' | 'select')} type - The type of the question.
 * @property {string} [placeholder] - The placeholder text for the question.
 * @property {string[]} [options] - The options for a select question.
 * @property {number} [min] - The minimum value for a scale question.
 * @property {number} [max] - The maximum value for a scale question.
 * @property {string} category - The category of the question.
 * @property {string} categoryTitle - The title of the category.
 */
interface FeedbackQuestion {
  id: string;
  question: string;
  type: 'textarea' | 'scale' | 'select';
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  category: string;
  categoryTitle: string;
}

/**
 * @interface FeedbackResponse
 * @property {string} questionId - The ID of the question.
 * @property {string} question - The question text.
 * @property {string | number} response - The response to the question.
 * @property {string} category - The category of the question.
 * @property {string} categoryTitle - The title of the category.
 * @property {string} timestamp - The timestamp of when the response was submitted.
 */
interface FeedbackResponse {
  questionId: string;
  question: string;
  response: string | number;
  category: string;
  categoryTitle: string;
  timestamp: string;
}

/**
 * @interface FeedbackSubmission
 * @property {string} sessionId - The ID of the session.
 * @property {string} [userId] - The ID of the user.
 * @property {FeedbackResponse[]} responses - A list of feedback responses.
 * @property {object} metadata - The metadata for the submission.
 * @property {string} metadata.userAgent - The user agent of the user.
 * @property {string} metadata.timestamp - The timestamp of when the submission was submitted.
 * @property {number} metadata.timeToComplete - The time it took to complete the feedback in seconds.
 */
interface FeedbackSubmission {
  sessionId: string;
  userId?: string;
  responses: FeedbackResponse[];
  metadata: {
    userAgent: string;
    timestamp: string;
    timeToComplete: number;
  };
}

/**
 * @interface FeedbackFormProps
 * @property {function(FeedbackSubmission): void} [onSubmit] - A callback function for when the feedback is submitted.
 * @property {string} [userId] - The ID of the user.
 * @property {object.<string, FeedbackQuestion[]>} [customQuestions] - A map of custom questions to use instead of the default questions.
 * @property {string} [className] - A custom class name for the component.
 */
interface FeedbackFormProps {
  onSubmit?: (data: FeedbackSubmission) => void;
  userId?: string;
  customQuestions?: { [category: string]: FeedbackQuestion[] };
  className?: string;
}

/**
 * A form for collecting feedback from users.
 * @param {FeedbackFormProps} props - The props for the component.
 * @returns {JSX.Element} The rendered FeedbackForm component.
 */
const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  onSubmit, 
  userId,
  customQuestions,
  className = ""
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState<FeedbackQuestion[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: string | number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`);
  const [startTime] = useState(Date.now());

  // Default question bank - can be overridden via props
  const defaultQuestionCategories = {
    usability: {
      title: "Usability & User Experience",
      questions: [
        {
          id: "usability_1",
          question: "What was your first impression when you landed on the app?",
          type: "textarea" as const,
          placeholder: "Describe your initial thoughts and feelings..."
        },
        {
          id: "usability_2", 
          question: "Walk me through how you tried to complete a core task. Where did you get stuck or confused?",
          type: "textarea" as const,
          placeholder: "Describe the steps you took and any difficulties..."
        },
        {
          id: "usability_3",
          question: "On a scale of 1-10, how easy was it to figure out how to use the app without instructions?",
          type: "scale" as const,
          min: 1,
          max: 10
        },
        {
          id: "usability_4",
          question: "What would you change about the navigation or layout to make it easier to use?",
          type: "textarea" as const,
          placeholder: "Suggest specific improvements..."
        },
        {
          id: "usability_5",
          question: "If you had to explain to a friend how to use this app, what would be the hardest part to explain?",
          type: "textarea" as const,
          placeholder: "What aspects seem most complex or confusing?"
        }
      ]
    },
    functionality: {
      title: "Core Value & Functionality",
      questions: [
        {
          id: "functionality_1",
          question: "In your own words, what problem does this app solve?",
          type: "textarea" as const,
          placeholder: "Describe the main purpose as you understand it..."
        },
        {
          id: "functionality_2",
          question: "How does this compare to what you currently use to solve this problem?",
          type: "textarea" as const,
          placeholder: "Compare to existing solutions you know..."
        },
        {
          id: "functionality_3",
          question: "What's the main thing that would make you want to use this regularly?",
          type: "textarea" as const,
          placeholder: "What would drive you to come back?"
        },
        {
          id: "functionality_4",
          question: "Which features worked well, and which didn't work as expected?",
          type: "textarea" as const,
          placeholder: "List what worked and what didn't..."
        },
        {
          id: "functionality_5",
          question: "If you could only keep 3 features, which would they be and why?",
          type: "textarea" as const,
          placeholder: "Name your top 3 most valuable features..."
        }
      ]
    },
    technical: {
      title: "Technical Performance",
      questions: [
        {
          id: "technical_1",
          question: "Did you experience any slow loading, crashes, or things that didn't work properly?",
          type: "textarea" as const,
          placeholder: "Describe any technical issues you encountered..."
        },
        {
          id: "technical_2",
          question: "How was the app's speed and responsiveness compared to other web apps you use?",
          type: "select" as const,
          options: ["Much slower", "Slower", "About the same", "Faster", "Much faster"]
        },
        {
          id: "technical_3",
          question: "What device and browser were you using, and did everything display correctly?",
          type: "textarea" as const,
          placeholder: "Device, browser, and any display issues..."
        },
        {
          id: "technical_4",
          question: "Did any buttons, links, or features not respond when you clicked them?",
          type: "textarea" as const,
          placeholder: "List any non-responsive elements..."
        },
        {
          id: "technical_5",
          question: "Rate the overall technical reliability: Did it feel stable and trustworthy?",
          type: "scale" as const,
          min: 1,
          max: 10
        }
      ]
    },
    design: {
      title: "Design & Information",
      questions: [
        {
          id: "design_1",
          question: "What did you think of the overall look and feel of the app?",
          type: "textarea" as const,
          placeholder: "Share your thoughts on the visual design..."
        },
        {
          id: "design_2",
          question: "Was any text hard to read or any information difficult to find?",
          type: "textarea" as const,
          placeholder: "Point out readability or findability issues..."
        },
        {
          id: "design_3",
          question: "Did the design help or hinder you in completing your tasks?",
          type: "select" as const,
          options: ["Significantly hindered", "Somewhat hindered", "Neutral", "Somewhat helped", "Significantly helped"]
        },
        {
          id: "design_4",
          question: "What looked unprofessional or unfinished to you?",
          type: "textarea" as const,
          placeholder: "Identify elements that need polish..."
        },
        {
          id: "design_5",
          question: "If you could redesign one screen or section, which would it be and why?",
          type: "textarea" as const,
          placeholder: "Which area needs the most design attention?"
        }
      ]
    },
    needs: {
      title: "User Needs & Priorities",
      questions: [
        {
          id: "needs_1",
          question: "What's missing that would make this app significantly more useful to you?",
          type: "textarea" as const,
          placeholder: "Describe features or improvements you'd want..."
        },
        {
          id: "needs_2",
          question: "Would you use this app if it were available today, and how often?",
          type: "select" as const,
          options: ["Never", "Rarely (monthly)", "Sometimes (weekly)", "Often (daily)", "Very often (multiple times daily)"]
        },
        {
          id: "needs_3",
          question: "What would need to change for you to choose this over your current solution?",
          type: "textarea" as const,
          placeholder: "What barriers prevent you from switching?"
        },
        {
          id: "needs_4",
          question: "Who else do you think would find this app useful?",
          type: "textarea" as const,
          placeholder: "Describe potential users or use cases..."
        },
        {
          id: "needs_5",
          question: "On a scale of 1-10, how likely would you be to recommend this to someone with a similar need?",
          type: "scale" as const,
          min: 1,
          max: 10
        }
      ]
    }
  };

  const questionCategories = customQuestions || defaultQuestionCategories;

  const selectRandomQuestions = () => {
    const selected: FeedbackQuestion[] = [];
    Object.entries(questionCategories).forEach(([categoryKey, category]) => {
      const randomIndex = Math.floor(Math.random() * category.questions.length);
      const question = category.questions[randomIndex];
      selected.push({
        ...question,
        category: categoryKey,
        categoryTitle: category.title
      });
    });
    setSelectedQuestions(selected);
    setResponses({});
    setIsSubmitted(false);
  };

  useEffect(() => {
    selectRandomQuestions();
  }, []);

  const handleInputChange = (questionId: string, value: string | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const endTime = Date.now();
    const timeToComplete = Math.round((endTime - startTime) / 1000); // seconds

    const feedbackData: FeedbackSubmission = {
      sessionId,
      userId,
      responses: selectedQuestions.map(question => ({
        questionId: question.id,
        question: question.question,
        response: responses[question.id] || '',
        category: question.category,
        categoryTitle: question.categoryTitle,
        timestamp: new Date().toISOString()
      })),
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        timeToComplete
      }
    };

    try {
      // Call the provided onSubmit callback
      if (onSubmit) {
        await onSubmit(feedbackData);
      } else {
        // Default behavior - log to console (replace with your API call)
        console.log('Feedback submitted:', feedbackData);
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: FeedbackQuestion) => {
    const value = responses[question.id] || '';
    
    switch (question.type) {
      case 'textarea':
        return (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            placeholder={question.placeholder}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        );
      
      case 'scale':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{question.min}</span>
              <span className="text-sm text-gray-600">{question.max}</span>
            </div>
            <input
              type="range"
              min={question.min}
              max={question.max}
              value={value || Math.floor(((question.min || 1) + (question.max || 10)) / 2)}
              onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center">
              <span className="text-lg font-semibold text-blue-600">
                {value || Math.floor(((question.min || 1) + (question.max || 10)) / 2)}
              </span>
            </div>
          </div>
        );
      
      case 'select':
        return (
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Thank you for your feedback!</h2>
          <p className="text-gray-600">Your responses help us improve the app for everyone.</p>
        </div>
      </div>
    );
  }

  const answeredQuestions = Object.keys(responses).filter(key => responses[key] !== '').length;
  const totalQuestions = selectedQuestions.length;

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Share Your Feedback</h1>
          <div className="text-sm text-gray-500">
            {answeredQuestions}/{totalQuestions} answered
          </div>
        </div>
        <p className="text-gray-600">
          Help us improve by sharing your thoughts. This will only take a few minutes.
        </p>
      </div>

      <div className="space-y-6">
        {selectedQuestions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                {index + 1}. {question.question}
              </h3>
              {renderQuestion(question)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={answeredQuestions === 0 || isSubmitting}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;

// Example usage and integration:
/*
// Basic usage:
<FeedbackForm onSubmit={handleFeedbackSubmission} userId="user123" />

// Handler function:
const handleFeedbackSubmission = async (feedbackData: FeedbackSubmission) => {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }
    
    // Handle success
    console.log('Feedback submitted successfully');
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error; // Re-throw to let the component handle the error
  }
};

// The feedbackData structure you'll receive:
{
  sessionId: "session_1234567890_abc123",
  userId: "user123",
  responses: [
    {
      questionId: "usability_3",
      question: "On a scale of 1-10, how easy was it to figure out how to use the app without instructions?",
      response: 7,
      category: "usability",
      categoryTitle: "Usability & User Experience",
      timestamp: "2024-01-15T10:30:00.000Z"
    },
    // ... other responses
  ],
  metadata: {
    userAgent: "Mozilla/5.0...",
    timestamp: "2024-01-15T10:30:00.000Z",
    timeToComplete: 45
  }
}
*/