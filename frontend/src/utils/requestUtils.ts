export const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  if (
    typeof AbortSignal !== "undefined" &&
    typeof (AbortSignal as unknown as Record<string, unknown>).timeout ===
      "function"
  ) {
    return (
      AbortSignal as unknown as Record<string, (ms: number) => AbortSignal>
    ).timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};
