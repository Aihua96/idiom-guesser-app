import { useIdiomGame } from '@/hooks/useIdiomGame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, RotateCcw, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const {
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
  } = useIdiomGame();

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (gameState.isAnswered && gameState.isCorrect) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isAnswered, gameState.isCorrect]);

  if (isGameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-lg border-amber-200">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">恭喜完成！</h1>
            <p className="text-amber-700">你已完成所有成语猜题</p>
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-amber-700 mb-2">最终积分</p>
            <p className="text-5xl font-bold text-amber-900">{gameState.score}</p>
            <p className="text-sm text-amber-600 mt-2">
              答对 {gameState.answeredCount} / {totalQuestions} 题
            </p>
          </div>

          <Button
            onClick={handleRestart}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white"
            size="lg"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            重新开始
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-amber-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-amber-900">看图猜成语</h1>
            <div className="text-right">
              <p className="text-sm text-amber-700">积分</p>
              <p className="text-2xl font-bold text-amber-900">{gameState.score}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={progressPercentage} className="flex-1 h-2" />
            <span className="text-sm text-amber-700 whitespace-nowrap">
              {gameState.answeredCount}/{totalQuestions}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg border-amber-200">
              <div className="relative aspect-video bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                <img
                  src={currentQuestion.image}
                  alt="成语图片"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {/* Hint Section */}
            {gameState.showHint && (
              <Card className="mt-4 p-4 bg-amber-50 border-amber-200 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">提示</p>
                    <p className="text-sm text-amber-800">{currentQuestion.hint}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Explanation Section */}
            {gameState.isAnswered && (
              <Card className={`mt-4 p-4 border-2 ${gameState.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-in fade-in slide-in-from-top-2`}>
                <div>
                  <p className={`text-sm font-semibold mb-2 ${gameState.isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                    {gameState.isCorrect ? '✓ 答对了！' : '✗ 答错了'}
                  </p>
                  <p className={`text-sm mb-3 ${gameState.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    正确答案：<span className="font-bold text-lg">{currentQuestion.idiom}</span>
                  </p>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Answer Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg border-amber-200 sticky top-24">
              <h2 className="text-lg font-bold text-amber-900 mb-4">请输入成语</h2>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="输入你的答案..."
                  value={gameState.userAnswer}
                  onChange={(e) => handleInputChange(e.target.value)}
                  disabled={gameState.isAnswered}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !gameState.isAnswered && gameState.userAnswer.trim()) {
                      handleSubmitAnswer();
                    }
                  }}
                  className="text-center text-lg font-semibold border-amber-200 focus:border-amber-500"
                />

                {!gameState.isAnswered ? (
                  <div className="space-y-2">
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!gameState.userAnswer.trim()}
                      className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                      size="lg"
                    >
                      提交答案
                    </Button>
                    <Button
                      onClick={handleShowHint}
                      disabled={gameState.usedHints.has(gameState.currentQuestionIndex)}
                      variant="outline"
                      className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                      size="sm"
                    >
                      <Lightbulb className="mr-2 h-4 w-4" />
                      {gameState.usedHints.has(gameState.currentQuestionIndex) ? '已使用提示' : '获取提示'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                    size="lg"
                  >
                    下一题
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Category Badge */}
              <div className="mt-6 pt-6 border-t border-amber-200">
                <p className="text-xs text-amber-600 mb-2">分类</p>
                <div className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {currentQuestion.category}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animation: `fall ${2 + Math.random() * 1}s linear forwards`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
