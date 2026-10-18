import React, { useState } from 'react';
import { quizQuestions } from '../data/quizQuestions';
import { HelpCircle, CheckCircle2, XCircle, ChevronRight, ChevronLeft, RotateCcw, Award, Lightbulb, Eye } from 'lucide-react';
import { sfx } from '../audio/sfx';

export default function Slide19MiniQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

  const currentQ = quizQuestions[currentQuestionIndex];
  const selectedOption = userAnswers[currentQ.id];
  const isAnswered = selectedOption !== undefined;
  const isRevealed = Boolean(showExplanation[currentQ.id]);

  const handleSelectOption = (optionId) => {
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
    setShowExplanation((prev) => ({ ...prev, [currentQ.id]: true }));
    const opt = currentQ.options.find((o) => o.id === optionId);
    if (opt?.correct) {
      sfx.chime();
    } else {
      sfx.buzz();
    }
  };

  const handleRevealDirect = () => {
    const correctOpt = currentQ.options.find((opt) => opt.correct);
    if (correctOpt && !isAnswered) {
      setUserAnswers((prev) => ({ ...prev, [currentQ.id]: correctOpt.id }));
    }
    setShowExplanation((prev) => ({ ...prev, [currentQ.id]: true }));
    sfx.chime();
  };

  const handleReset = () => {
    sfx.whoosh();
    setUserAnswers({});
    setShowExplanation({});
    setCurrentQuestionIndex(0);
  };

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = quizQuestions.filter((q) => {
    const chosen = userAnswers[q.id];
    const correctOpt = q.options.find((opt) => opt.correct);
    return correctOpt && chosen === correctOpt.id;
  }).length;

  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#29485A]/70 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D8F36A]/15 text-[#D8F36A] border border-[#D8F36A]/35 uppercase tracking-wider">
              Checkpoint tương tác • Ôn tập 5 ý trọng tâm
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            CHECKPOINT — BẠN NHỚ ĐƯỢC BAO NHIÊU?
          </h2>
          <p className="text-xs sm:text-sm text-[#A8BBC8]">
            Hệ thống hóa nhanh đường đi NO &rarr; NO₂ &rarr; HNO₃, tác động đa diện và giải pháp gốc rễ
          </p>
        </div>

        {/* Progress & Reset */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#102838] border border-[#29485A] text-xs">
            <Award className="w-4 h-4 text-[#D8F36A]" />
            <span className="text-[#A8BBC8]">Đúng:</span>
            <span className="font-mono font-extrabold text-[#D8F36A] text-sm">{correctCount}</span>
            <span className="text-[#A8BBC8] font-mono">/ {quizQuestions.length}</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-[#DCE6F0] hover:text-white bg-[#102838] hover:bg-[#16384E] border border-[#29485A] transition-colors"
            title="Làm lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#54D7E8]" />
            <span>Làm lại</span>
          </button>
        </div>
      </div>

      {/* Question Stepper Tabs (1/5 .. 5/5) */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
        {quizQuestions.map((q, idx) => {
          const ans = userAnswers[q.id];
          const isCurr = idx === currentQuestionIndex;
          const isCorrect = ans && q.options.find((o) => o.id === ans)?.correct;

          return (
            <button
              key={q.id}
              onClick={() => {
                setCurrentQuestionIndex(idx);
                sfx.tick();
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                isCurr
                  ? 'bg-[#143245] border-[#54D7E8] text-[#54D7E8] shadow-md ring-2 ring-[#54D7E8]/30'
                  : ans !== undefined
                  ? isCorrect
                    ? 'bg-[#D8F36A]/15 border-[#D8F36A]/50 text-[#D8F36A]'
                    : 'bg-[#F06B70]/15 border-[#F06B70]/50 text-[#F06B70]'
                  : 'bg-[#102838]/70 border-[#29485A] text-[#A8BBC8] hover:text-white'
              }`}
            >
              <span className="font-mono">Câu {idx + 1}/5</span>
              {ans !== undefined && (
                isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-[#D8F36A] shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-[#F06B70] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Question & Pedagogical Reveal Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto items-stretch">
        {/* Left column (7 cols): Question & Options */}
        <div className="lg:col-span-7 flex flex-col justify-between glass-panel rounded-3xl p-4 sm:p-6 border border-[#29485A]">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A8BBC8] mb-2">
              <span className="font-mono font-bold text-[#54D7E8] uppercase">
                CÂU HỎI 0{currentQuestionIndex + 1} / 0{quizQuestions.length}
              </span>
              <button
                onClick={handleRevealDirect}
                className="text-xs font-semibold text-[#D8F36A] hover:underline flex items-center gap-1"
              >
                <Eye size={13} /> Mở nhanh đáp án
              </button>
            </div>

            <h3 className="text-base sm:text-xl font-extrabold text-white leading-snug mb-4">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                let optionStyle =
                  "border-[#29485A] bg-[#071521]/80 text-[#DCE6F0] hover:border-[#54D7E8] hover:bg-[#102838]";

                if (isAnswered) {
                  if (opt.correct) {
                    optionStyle =
                      "border-[#D8F36A] bg-[#D8F36A]/15 text-[#D8F36A] font-bold shadow-md";
                  } else if (isSelected && !opt.correct) {
                    optionStyle =
                      "border-[#F06B70] bg-[#F06B70]/15 text-[#F06B70] font-bold";
                  } else {
                    optionStyle =
                      "border-[#29485A]/40 bg-[#071521]/40 text-[#A8BBC8]/60 opacity-65";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${optionStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-mono font-black flex items-center justify-center shrink-0 border ${
                        isAnswered && opt.correct
                          ? 'bg-[#D8F36A] text-[#050E17] border-[#D8F36A]'
                          : isSelected && !opt.correct
                          ? 'bg-[#F06B70] text-white border-[#F06B70]'
                          : 'bg-[#102838] text-[#54D7E8] border-[#29485A]'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed flex-1 pt-0.5">
                      {opt.text}
                    </span>
                    {isAnswered && opt.correct && (
                      <CheckCircle2 className="w-5 h-5 text-[#D8F36A] shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !opt.correct && (
                      <XCircle className="w-5 h-5 text-[#F06B70] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav buttons below options */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#29485A]/60">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-[#29485A] bg-[#071521] text-white disabled:opacity-35 hover:bg-[#102838] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === quizQuestions.length - 1}
              className="flex items-center gap-1.5 text-xs font-extrabold px-4 py-2 rounded-xl border border-[#54D7E8]/50 bg-[#54D7E8]/20 text-[#54D7E8] disabled:opacity-35 hover:bg-[#54D7E8]/30 transition-colors"
            >
              <span>Câu kế tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right column (5 cols): Pedagogical Feedback & Scientific Explanation */}
        <div
          className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-3xl p-4 sm:p-6 border border-[#29485A]"
          aria-live="polite"
        >
          {isRevealed ? (
            <div className="flex flex-col h-full justify-between animate-fade-in gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      selectedOption && currentQ.options.find((o) => o.id === selectedOption)?.correct
                        ? 'bg-[#D8F36A]/20 text-[#D8F36A] border border-[#D8F36A]/40'
                        : 'bg-[#FF875F]/20 text-[#FF875F] border border-[#FF875F]/40'
                    }`}
                  >
                    {selectedOption && currentQ.options.find((o) => o.id === selectedOption)?.correct ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Lightbulb className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">
                      {selectedOption && currentQ.options.find((o) => o.id === selectedOption)?.correct
                        ? 'Hoàn toàn chính xác!'
                        : 'Đáp án & Giải thích chuẩn'}
                    </h4>
                    <p className="text-xs text-[#A8BBC8]">
                      Kết quả đúng: <span className="font-mono font-bold text-[#D8F36A]">{currentQ.answer}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#071521]/90 border border-[#29485A] text-xs sm:text-sm text-[#DCE6F0] leading-relaxed">
                  <div className="flex items-center gap-1.5 text-[#54D7E8] font-bold mb-1.5">
                    <Lightbulb className="w-4 h-4 text-[#D8F36A]" />
                    <span>Giải thích bản chất hóa học:</span>
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>
              </div>

              {/* Progress summary banner */}
              <div className="p-3.5 rounded-2xl bg-[#071521]/80 border border-[#29485A] text-xs">
                <div className="flex justify-between text-[#A8BBC8] mb-1.5">
                  <span>Tiến độ hoàn thành Checkpoint:</span>
                  <span className="font-mono font-bold text-white">{answeredCount} / {quizQuestions.length} câu</span>
                </div>
                <div className="w-full bg-[#102838] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#54D7E8] to-[#D8F36A] h-full transition-all duration-300"
                    style={{ width: `${(answeredCount / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#A8BBC8]">
              <div className="w-14 h-14 rounded-2xl bg-[#071521] flex items-center justify-center mb-3 border border-[#29485A]">
                <HelpCircle className="w-7 h-7 text-[#54D7E8]" />
              </div>
              <h4 className="text-base font-extrabold text-white mb-1">
                Chọn một phương án trả lời bên trái
              </h4>
              <p className="text-xs max-w-xs text-[#A8BBC8] leading-relaxed">
                Nhấp vào đáp án A, B, C hoặc D (hoặc bấm <strong>“Mở nhanh đáp án”</strong>) để đối chiếu kết quả và lời giải thích hóa học.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
