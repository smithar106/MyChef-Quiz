export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  console.log(`[track] ${event}`, properties || {});
}

export function trackPageView(page: string) {
  trackEvent("page_view", { page });
}

export function trackAnswer(questionId: string, label: string) {
  trackEvent("quiz_answer", { question: questionId, answer: label });
}

export function trackResult(archetypeId: string) {
  trackEvent("quiz_result", { archetype: archetypeId });
}

export function trackEmailSubmit(archetypeId: string) {
  trackEvent("email_submit", { archetype: archetypeId });
}

export function trackEmailSkip(archetypeId: string) {
  trackEvent("email_skip", { archetype: archetypeId });
}

export function trackCTAClick() {
  trackEvent("cta_click", {});
}

export function trackShare(archetypeId: string) {
  trackEvent("share_result", { archetype: archetypeId });
}

export function trackRetake() {
  trackEvent("retake_quiz", {});
}
