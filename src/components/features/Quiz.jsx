import React, { useState } from 'react';

/**
 * Interactive Quiz component that renders multiple-choice questions from post frontmatter
 * @param {Object} props - Component props
 * @param {Array} props.quiz - Array of quiz questions from post frontmatter
 * @returns {JSX.Element} - Quiz component with interactive functionality
 */
const Quiz = ({ quiz = [] }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false); // Controls the collapse/expand state

  // If no quiz questions, don't render anything
  if (!quiz || quiz.length === 0) {
    return null;
  }

  /**
   * Handle option selection for a question
   * @param {number} questionIndex - Index of the question
   * @param {number} optionIndex - Index of the selected option
   */
  const handleSelectOption = (questionIndex, optionIndex) => {
    if (showResults) return; // Prevent changes after submission
    
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  /**
   * Calculate score and show results
   */
  const handleSubmitQuiz = () => {
    if (Object.keys(userAnswers).length === 0) return; // Don't submit if no answers
    
    let correctCount = 0;
    quiz.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);
  };

  /**
   * Reset the quiz
   */
  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  /**
   * Share quiz results on social media
   */
  const handleShareResults = () => {
    const scoreText = `I scored ${score}/${quiz.length} on the stock market quiz!`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Quiz Results',
        text: scoreText,
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${scoreText} Check it out: ${shareUrl}`);
      alert('Results copied to clipboard!');
    }
  };

  // Toggle the expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 shadow-sm">
      <button 
        onClick={toggleExpand}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={isExpanded}
      >
        <h3 className="text-xl font-semibold">Quiz: Test Your Knowledge</h3>
        <span className="text-primary-600 dark:text-primary-400 flex items-center">
          {isExpanded ? (
            <>
              <span className="mr-2 text-sm">Collapse</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
              </svg>
            </>
          ) : (
            <>
              <span className="mr-2 text-sm">Expand</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
              </svg>
            </>
          )}
        </span>
      </button>
      
      {isExpanded && (
        <div className="mt-6">
          {quiz.map((question, qIndex) => (
            <div key={qIndex} className="mb-8">
              <p className="text-lg font-medium mb-3">
                {qIndex + 1}. {question.q}
              </p>
              
              <div className="space-y-2">
                {question.options.map((option, oIndex) => {
                  const isSelected = userAnswers[qIndex] === oIndex;
                  const isCorrect = showResults && question.answer === oIndex;
                  const isWrong = showResults && isSelected && !isCorrect;
                  
                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleSelectOption(qIndex, oIndex)}
                      className={`w-full text-left p-3 rounded-md border transition ${isSelected ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 dark:border-primary-500' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'} ${isCorrect ? 'bg-green-50 dark:bg-green-900 border-green-500 dark:border-green-500' : ''} ${isWrong ? 'bg-red-50 dark:bg-red-900 border-red-500 dark:border-red-500' : ''}`}
                      disabled={showResults}
                    >
                      <span className="flex items-start">
                        <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full border mr-3 flex-shrink-0 mt-0.5 ${isSelected ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-400 text-transparent'}`}>
                          {isSelected && (
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                        <span>{option}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {showResults && (
                <div className="mt-3 text-sm">
                  {userAnswers[qIndex] === question.answer ? (
                    <p className="text-green-600 dark:text-green-400">Correct! Well done.</p>
                  ) : (
                    <p className="text-red-600 dark:text-red-400">
                      Incorrect. The correct answer is: {question.options[question.answer]}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <div className="flex flex-wrap gap-4 mt-6">
            {!showResults ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length !== quiz.length}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answers
              </button>
            ) : (
              <>
                <div className="w-full mb-4 p-4 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                  <p className="font-medium">Your Score: {score}/{quiz.length}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${(score / quiz.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Try Again
                </button>
                <button
                  onClick={handleShareResults}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Share Results
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
