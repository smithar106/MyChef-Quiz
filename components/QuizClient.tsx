"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  questions,
  archetypes,
  ArchetypeId,
  Answer,
  scoreArchetype,
} from "@/lib/quizzes";
import {
  trackEvent,
  trackAnswer,
  trackResult,
  trackEmailSubmit,
  trackEmailSkip,
} from "@/lib/tracking";
import ResultPage from "./ResultPage";

type Phase = "landing" | "quiz" | "calculating" | "email" | "result";

export default function QuizClient() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [archetypeId, setArchetypeId] = useState<ArchetypeId | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    trackEvent("quiz_started");
  }, []);

  const goToQuiz = useCallback(() => {
    trackEvent("quiz_landing_cta");
    setPhase("quiz");
    setShowAnimation(true);
  }, []);

  const handleSelectAnswer = useCallback(
    (label: string) => {
      if (phase !== "quiz" || answers.length > currentStep) return;

      const question = questions[currentStep];
      trackAnswer(question.id, label);

      setSelectedAnswer(label);
      const newAnswers = [...answers, { questionId: question.id, label }];
      setAnswers(newAnswers);

      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }

      autoAdvanceTimer.current = setTimeout(() => {
        if (currentStep + 1 >= questions.length) {
          const resultId = scoreArchetype(newAnswers);
          setArchetypeId(resultId);
          trackResult(resultId);
          setPhase("calculating");

          setTimeout(() => {
            setPhase("email");
          }, 1800);
        } else {
          setCurrentStep((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowAnimation(false);
          requestAnimationFrame(() => {
            setShowAnimation(true);
          });
        }
      }, 180);
    },
    [phase, currentStep, answers]
  );

  const handleEmailSubmit = async () => {
    if (emailSubmitting) return;
    setEmailSubmitting(true);

    if (email && archetypeId) {
      trackEmailSubmit(archetypeId);
      try {
        await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            archetype_id: archetypeId,
            answers,
          }),
        });
      } catch {
        // don't block on submit failure
      }
    }

    setPhase("result");
    setEmailSubmitting(false);
  };

  const handleEmailSkip = () => {
    if (archetypeId) {
      trackEmailSkip(archetypeId);
    }
    setPhase("result");
  };

  if (phase === "result" && archetypeId) {
    return <ResultPage archetype={archetypes[archetypeId]} />;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 pb-12 min-h-screen">
      {phase === "landing" && (
        <div className="flex flex-col items-center justify-center flex-1 w-full step-enter">
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{
              backgroundColor: "rgba(255,107,53,0.15)",
            }}
          >
            <span className="text-[40px] leading-none">🍳</span>
          </div>

          {/* Headline */}
          <h1 className="text-[28px] font-bold text-white text-center mb-2">
            Find your cooking archetype
          </h1>

          {/* Subheadline */}
          <p className="text-base text-center mb-8" style={{ color: "#999999" }}>
            5 questions. We figure out your ideal meal plan.
          </p>

          {/* Trust bullets */}
          <div className="flex flex-col gap-3 mb-10 w-full max-w-[260px]">
            <div className="flex items-center gap-3">
              <span style={{ color: "#FF6B35" }}>✓</span>
              <span className="text-sm" style={{ color: "#DDDDDD" }}>
                Under 60 seconds
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: "#FF6B35" }}>✓</span>
              <span className="text-sm" style={{ color: "#DDDDDD" }}>
                Personalised to your household
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: "#FF6B35" }}>✓</span>
              <span className="text-sm" style={{ color: "#DDDDDD" }}>
                See your first week free
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={goToQuiz}
            className="w-full text-center font-semibold text-white text-base rounded-2xl"
            style={{
              backgroundColor: "#FF6B35",
              padding: "18px",
              borderRadius: "16px",
            }}
          >
            Start →
          </button>
        </div>
      )}

      {phase === "quiz" && (
        <div className="flex flex-col w-full flex-1">
          {/* Progress bar */}
          <div className="w-full mb-2">
            <div
              className="text-xs font-semibold mb-2"
              style={{ color: "#FF6B35" }}
            >
              Step {currentStep + 1} of {questions.length}
            </div>
            <div
              className="w-full h-1 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="progress-bar h-full rounded-full"
                style={{
                  width: `${((currentStep + (selectedAnswer ? 1 : 0)) / questions.length) * 100}%`,
                  backgroundColor: "#FF6B35",
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div
            key={currentStep}
            className={showAnimation ? "step-enter" : ""}
          >
            <h2 className="text-xl font-bold text-white mb-6 mt-4">
              {questions[currentStep].question}
            </h2>

            <div
              className={
                (currentStep === 0 || currentStep >= 3)
                  ? "grid grid-cols-2 gap-3"
                  : "flex flex-col gap-3"
              }
            >
              {questions[currentStep].answers.map((answer) => {
                const isSelected = selectedAnswer === answer.label;
                return (
                  <button
                    key={answer.label}
                    onClick={() => handleSelectAnswer(answer.label)}
                    className="text-left p-4 rounded-[20px] text-sm transition-all duration-[180ms]"
                    style={{
                      backgroundColor: isSelected
                        ? "rgba(255,107,53,0.15)"
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${
                        isSelected ? "#FF6B35" : "rgba(255,255,255,0.08)"
                      }`,
                      color: isSelected ? "#FFFFFF" : "#DDDDDD",
                    }}
                  >
                    {answer.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {phase === "calculating" && (
        <div className="flex flex-col items-center justify-center flex-1 step-enter">
          <div
            className="w-12 h-12 rounded-full border-[3px] animate-spin mb-6"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              borderTopColor: "#FF6B35",
            }}
          />
          <p className="text-lg font-semibold text-white mb-1">
            Analysing your taste profile
          </p>
          <p style={{ color: "#999999" }} className="text-sm">
            Finding your perfect match...
          </p>
        </div>
      )}

      {phase === "email" && (
        <div className="flex flex-col items-center justify-center flex-1 w-full step-enter">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {archetypeId ? archetypes[archetypeId].name : ""}
          </h2>
          <p className="text-base text-center mb-8" style={{ color: "#DDDDDD" }}>
            Your meal plan is ready. Save it to your inbox.
          </p>

          <div className="w-full mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 rounded-2xl text-white text-sm outline-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEmailSubmit();
              }}
            />
          </div>

          <button
            onClick={handleEmailSubmit}
            disabled={emailSubmitting}
            className="w-full text-center font-semibold text-white text-base rounded-2xl mb-3"
            style={{
              backgroundColor: "#FF6B35",
              padding: "18px",
              borderRadius: "16px",
              opacity: emailSubmitting ? 0.7 : 1,
            }}
          >
            {emailSubmitting ? "Saving..." : "See my plan →"}
          </button>

          <button
            onClick={handleEmailSkip}
            className="text-sm"
            style={{ color: "#999999", textDecoration: "underline" }}
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
}
