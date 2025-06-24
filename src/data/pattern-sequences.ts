/**
 * Pattern sequences for PatternPlay challenges
 * Extracted from challenge-content.ts for better maintainability
 */

import type { PatternSequence } from '../types/challenge-content';

export const PATTERN_SEQUENCES: PatternSequence[] = [
  // Easy patterns - Arithmetic
  {
    id: 'simple_addition',
    sequence: [2, 4, 6, 8],
    correctNext: 10,
    rule: 'Add 2 to each number',
    difficulty: 'easy',
    category: 'arithmetic'
  },
  {
    id: 'counting_by_threes',
    sequence: [3, 6, 9, 12],
    correctNext: 15,
    rule: 'Add 3 to each number',
    difficulty: 'easy',
    category: 'arithmetic'
  },
  {
    id: 'simple_subtraction',
    sequence: [20, 18, 16, 14],
    correctNext: 12,
    rule: 'Subtract 2 from each number',
    difficulty: 'easy',
    category: 'arithmetic'
  },
  
  // Medium patterns - Geometric and Fibonacci
  {
    id: 'fibonacci_start',
    sequence: [1, 1, 2, 3, 5],
    correctNext: 8,
    rule: 'Each number is the sum of the two preceding ones',
    difficulty: 'medium',
    category: 'fibonacci'
  },
  {
    id: 'geometric_doubling',
    sequence: [2, 4, 8, 16],
    correctNext: 32,
    rule: 'Each number is double the previous',
    difficulty: 'medium',
    category: 'geometric'
  },
  {
    id: 'geometric_tripling',
    sequence: [1, 3, 9, 27],
    correctNext: 81,
    rule: 'Each number is triple the previous',
    difficulty: 'medium',
    category: 'geometric'
  },
  
  // Hard patterns - Complex sequences
  {
    id: 'alternating_operations',
    sequence: [1, 3, 6, 8, 15],
    correctNext: 17,
    rule: 'Alternately add 2 and multiply by 2',
    difficulty: 'hard',
    category: 'alternating'
  },
  {
    id: 'squares_sequence',
    sequence: [1, 4, 9, 16],
    correctNext: 25,
    rule: 'Perfect squares (1², 2², 3², 4²)',
    difficulty: 'hard',
    category: 'positional'
  },
  {
    id: 'prime_numbers',
    sequence: [2, 3, 5, 7],
    correctNext: 11,
    rule: 'Prime numbers in ascending order',
    difficulty: 'hard',
    category: 'prime'
  },
  {
    id: 'factorial_sequence',
    sequence: [1, 1, 2, 6],
    correctNext: 24,
    rule: 'Factorial sequence (0!, 1!, 2!, 3!)',
    difficulty: 'hard',
    category: 'factorial'
  }
];