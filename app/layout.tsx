import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyChef Quiz — Find your cooking archetype",
  description:
    "5 questions. We figure out your ideal meal plan. Discover your cooking archetype and get a personalised meal plan with MyChef.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          .step-enter { animation: stepIn 0.22s ease-out both; }
          .result-enter { animation: resultIn 0.35s ease-out both; }
          @keyframes stepIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes resultIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .progress-bar { transition: width 0.3s ease; }
          .cta-pulse { box-shadow: 0 0 0 0 rgba(255,107,53,0.4); animation: pulse 2.5s infinite; }
          @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255,107,53,0.4); } 70% { box-shadow: 0 0 0 12px rgba(255,107,53,0); } 100% { box-shadow: 0 0 0 0 rgba(255,107,53,0); } }
        `}</style>
      </head>
      <body
        style={{
          backgroundColor: "#0A0A0A",
          color: "#FFFFFF",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}
