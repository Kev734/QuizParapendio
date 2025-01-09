import { useState, useEffect } from "react";
import questions from "./data/quiz_questions.json";
import "./../styles/QuizInterface.css";

const QuizInterface = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<
    { id: number; section: string; text: string; options: string[]; correctAnswer: number }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    correct: number;
    percentage: number;
    detailedWrongAnswers: {
      questionId: number;
      question: string;
      userAnswer: string;
      correctAnswer: string;
    }[];
  } | null>(null);

  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswer = (value: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    const detailedWrongAnswers: {
      questionId: number;
      question: string;
      userAnswer: string;
      correctAnswer: string;
    }[] = [];

    selectedQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer === question.correctAnswer) {
        correct++;
      } else {
        detailedWrongAnswers.push({
          questionId: question.id,
          question: question.text,
          userAnswer: question.options[userAnswer],
          correctAnswer: question.options[question.correctAnswer],
        });
      }
    });

    setResults({
      correct,
      percentage: (correct / selectedQuestions.length) * 100,
      detailedWrongAnswers,
    });
    setShowResults(true);
  };

  const restartQuiz = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 5));
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setResults(null);
  };

  if (showResults && results) {
    return (
      <div className="results-container">
        <h1>Risultati del Quiz</h1>
        <p>Hai risposto correttamente a {results.correct} su {selectedQuestions.length} domande.</p>
        <p>Percentuale di risposte corrette: {results?.percentage.toFixed(1)}%</p>
  
        {results.detailedWrongAnswers.length > 0 && (
          <div className="wrong-answers">
            <h2>Risposte Sbagliate</h2>
            {results.detailedWrongAnswers.map((wrong, index) => (
              <div key={index} className="wrong-answer">
                <p><strong>Domanda:</strong> {wrong.question}</p>
                <p><strong>La tua risposta:</strong> {wrong.userAnswer}</p>
                <p><strong>Risposta corretta:</strong> {wrong.correctAnswer}</p>
              </div>
            ))}
          </div>
        )}
  
        <button onClick={restartQuiz}>Ricomincia</button>
      </div>
    );
  }
  
  if (!selectedQuestions.length) {
    return <div>Caricamento...</div>;
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Errore: Nessuna domanda trovata.</div>;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <p>Domanda {currentQuestionIndex + 1}/{selectedQuestions.length}</p>
        <p className="section-title">{currentQuestion.section}</p>
      </div>
      <div className="quiz-content">
        <p className="section-title">{currentQuestion.text}</p>
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={userAnswers[currentQuestionIndex] === index ? "selected" : ""}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="quiz-footer">
        <button onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
          Precedente
        </button>
        <button
          onClick={nextQuestion}
          disabled={userAnswers[currentQuestionIndex] === undefined}
        >
          {currentQuestionIndex === selectedQuestions.length - 1 ? "Termina" : "Successiva"}
        </button>
      </div>
    </div>
  );
};

export default QuizInterface;
