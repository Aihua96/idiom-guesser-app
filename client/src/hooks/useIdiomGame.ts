import { useState, useCallback, useMemo } from 'react';
import { idiomQuestions, IdiomQuestion } from '@/lib/idiomData';

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  answeredCount: number;
  showHint: boolean;
  userAnswer: string;
  isAnswered: boolean;
  isCorrect: boolean;
  usedHints: Set<number>;
}

export const useIdiomGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    answeredCount: 0,
    showHint: false,
    userAnswer: '',
    isAnswered: false,
    isCorrect: false,
    usedHints: new Set(),
  });

  const currentQuestion = useMemo(
    () => idiomQuestions[gameState.currentQuestionIndex],
    [gameState.currentQuestionIndex]
  );

  const handleInputChange = useCallback((value: string) => {
    setGameState(prev => ({
      ...prev,
      userAnswer: value,
    }));
  }, []);

  const handleSubmitAnswer = useCallback(() => {
    const isCorrect = gameState.userAnswer.trim() === currentQuestion.idiom;
    const newScore = isCorrect ? gameState.score + 10 : gameState.score;

    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      isCorrect,
      score: newScore,
      answeredCount: prev.answeredCount + 1,
    }));
  }, [gameState.userAnswer, gameState.score, currentQuestion.idiom]);

  const handleShowHint = useCallback(() => {
    if (!gameState.usedHints.has(gameState.currentQuestionIndex)) {
      const newUsedHints = new Set(gameState.usedHints);
      newUsedHints.add(gameState.currentQuestionIndex);
      setGameState(prev => ({
        ...prev,
        showHint: true,
        usedHints: newUsedHints,
      }));
    }
  }, [gameState.currentQuestionIndex, gameState.usedHints]);

  const handleNextQuestion = useCallback(() => {
    const nextIndex = gameState.currentQuestionIndex + 1;
    
    if (nextIndex < idiomQuestions.length) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        userAnswer: '',
        isAnswered: false,
        isCorrect: false,
        showHint: false,
      }));
    } else {
      // Game completed
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: idiomQuestions.length,
      }));
    }
  }, [gameState.currentQuestionIndex]);

  const handleRestart = useCallback(() => {
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      answeredCount: 0,
      showHint: false,
      userAnswer: '',
      isAnswered: false,
      isCorrect: false,
      usedHints: new Set(),
    });
  }, []);

  const isGameCompleted = gameState.currentQuestionIndex >= idiomQuestions.length;
  const totalQuestions = idiomQuestions.length;
  const progressPercentage = (gameState.answeredCount / totalQuestions) * 100;

  return {
    gameState,
    currentQuestion,
    handleInputChange,
    handleSubmitAnswer,
    handleShowHint,
    handleNextQuestion,
    handleRestart,
    isGameCompleted,
    totalQuestions,
    progressPercentage,
  };
};
