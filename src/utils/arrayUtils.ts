/**
 * Shuffles an array in place using the Fisher-Yates (aka Knuth) algorithm.
 * Creates a new shuffled array, leaving the original array unchanged.
 * @param array The array to shuffle.
 * @returns A new array containing the same elements but in a random order.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a copy to avoid modifying the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements shuffled[i] and shuffled[j]
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}