export const MAX_PROMPT_LENGTH = 500;

export function validatePromptLength(prompt: string) {
  // Count Unicode code points so surrogate-pair emoji count as one character.
  const length = Array.from(prompt).length;
  return { length, isValid: length <= MAX_PROMPT_LENGTH };
}
