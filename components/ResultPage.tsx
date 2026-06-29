"use client";

import { Archetype } from "@/lib/quizzes";
import { trackCTAClick, trackShare, trackRetake } from "@/lib/tracking";

interface ResultPageProps {
  archetype: Archetype;
}

export default function ResultPage({ archetype }: ResultPageProps) {
  const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL || "#";

  const handleShare = async () => {
    trackShare(archetype.id);
    const text = `I'm ${archetype.name} — ${archetype.tagline}`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: "MyChef Quiz", text, url });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
      } catch {
        // clipboard failed
      }
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-6 pb-12 result-enter">
      {/* Eyebrow */}
      <p
        className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
        style={{ color: "#FF6B35" }}
      >
        YOUR COOKING ARCHETYPE
      </p>

      {/* Emoji */}
      <span className="text-[80px] leading-none mb-4">{archetype.emoji}</span>

      {/* Name */}
      <h1 className="text-[32px] font-bold text-white mb-2">
        {archetype.name}
      </h1>

      {/* Tagline */}
      <p className="text-base mb-4" style={{ color: "#DDDDDD" }}>
        {archetype.tagline}
      </p>

      {/* Description */}
      <p className="text-[15px] leading-relaxed mb-8" style={{ color: "#999999" }}>
        {archetype.description}
      </p>

      {/* Divider */}
      <hr
        className="w-full border-0 h-px mb-8"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      />

      {/* Fridge Scan Moment */}
      <p
        className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
        style={{ color: "#FF6B35" }}
      >
        THE FEATURE BUILT FOR YOU
      </p>

      <h2 className="text-xl font-bold text-white mb-2">
        Scan your fridge. Get a week of meals.
      </h2>

      <p
        className="text-[14px] leading-relaxed mb-6"
        style={{ color: "#999999" }}
      >
        Point your camera at your fridge. MyChef reads what&apos;s there and
        builds a personalised meal plan around it — no typing, no guessing.
      </p>

      {/* Blurred Placeholder Card */}
      <div className="relative w-full max-w-[200px] h-[160px] mb-6">
        <div
          className="w-full h-full rounded-[20px]"
          style={{
            background:
              "linear-gradient(135deg, #FF6B35 0%, #FF8C5A 50%, #FF6B35 100%)",
            filter: "blur(8px)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl" style={{ filter: "none" }}>
            📸
          </span>
        </div>
      </div>

      <p className="text-sm mb-8" style={{ color: "#999999" }}>
        Your first week is ready inside the app
      </p>

      {/* Primary CTA */}
      <a
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCTAClick()}
        className="w-full text-center font-semibold text-white text-base rounded-2xl block"
        style={{
          backgroundColor: "#FF6B35",
          padding: "18px",
          borderRadius: "16px",
        }}
      >
        See my meal plan — free →
      </a>

      <p className="text-xs mt-3 mb-6" style={{ color: "#999999" }}>
        Free to explore · No commitment
      </p>

      {/* Share */}
      <button
        onClick={handleShare}
        className="text-sm font-medium mb-4"
        style={{ color: "#FF6B35" }}
      >
        Share my result
      </button>

      {/* Retake */}
      <a
        href="/quiz"
        onClick={() => trackRetake()}
        className="text-sm font-medium mb-8"
        style={{ color: "#999999", textDecoration: "underline" }}
      >
        Retake the quiz
      </a>

      {/* Footer */}
      <p className="text-xs" style={{ color: "#555555" }}>
        MyChef · AI meal planning, built around your life
      </p>
    </div>
  );
}
