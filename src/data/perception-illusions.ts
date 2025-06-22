/**
 * Perception illusions for PerceptionFlip challenges
 * Extracted from challenge-content.ts for better maintainability
 */

import type { PerceptionIllusion } from '../types/challenge-content';

export const PERCEPTION_ILLUSIONS: PerceptionIllusion[] = [
  {
    id: 'ambiguous_number',
    type: 'ambiguous',
    description: 'This figure can be seen as two different numbers depending on orientation',
    hint: 'Try rotating your perspective',
    acceptableAnswers: ['6', '9', 'Six', 'Nine', '6 or 9', '9 or 6'],
    explanation: 'This classic illusion demonstrates how context and orientation affect perception',
    illusionData: { ambiguousText: '6 9' }
  },
  {
    id: 'duck_rabbit',
    type: 'ambiguous',
    description: 'This image can be perceived as two different animals',
    acceptableAnswers: ['Duck', 'Rabbit', 'Bird', 'Bunny', 'Duck or Rabbit', 'Rabbit or Duck'],
    explanation: 'A famous example of bistable perception where the same image can represent different objects'
  },
  {
    id: 'impossible_triangle',
    type: 'perspective',
    description: 'This triangle appears impossible in three-dimensional space',
    hint: 'Look at how the edges connect',
    acceptableAnswers: ['Impossible', 'Paradox', 'Optical illusion', 'Not possible', 'Cannot exist'],
    explanation: 'The Penrose triangle creates an impossible object through clever perspective manipulation'
  },
  {
    id: 'color_context',
    type: 'color',
    description: 'Are the center squares the same color?',
    hint: 'Focus only on the gray squares in the center',
    acceptableAnswers: ['Same color', 'Yes', 'Identical', 'Same gray'],
    explanation: 'The surrounding colors affect how we perceive the central gray squares, even though they are identical'
  },
  {
    id: 'motion_illusion',
    type: 'motion',
    description: 'Does this static image appear to move?',
    acceptableAnswers: ['Yes', 'Appears to move', 'Seems to wiggle', 'Looks animated'],
    explanation: 'High contrast patterns can create the illusion of movement in static images'
  }
];