/**
 * Social media message database for SocialDecoder challenges
 * Extracted from challenge-content.ts for better maintainability
 */

import type { SocialMessage } from '../types/challenge-content';

export const SOCIAL_MESSAGES: SocialMessage[] = [
  // Easy - Clear sarcasm
  {
    id: 'obvious_sarcasm',
    message: "Oh great, another Monday morning meeting 🙄",
    author: "Alex Chen",
    platform: "Slack",
    timestamp: "8:45 AM",
    context: "Posted in #general after weekend",
    emojis: "🙄",
    interpretations: [
      "Genuinely excited about the meeting",
      "Sarcastically expressing frustration",
      "Neutral statement about Monday meetings",
      "Confused about the meeting time"
    ],
    correctInterpretation: "Sarcastically expressing frustration",
    culturalContext: "workplace-sarcasm",
    difficulty: 'easy'
  },
  
  // Easy - Obvious enthusiasm
  {
    id: 'clear_excitement',
    message: "Just got the job offer!!! Dreams do come true! 🎉🎊✨",
    author: "Maya Patel",
    platform: "Instagram",
    timestamp: "3:22 PM",
    emojis: "🎉🎊✨",
    interpretations: [
      "Celebrating a job opportunity",
      "Being sarcastic about job hunting",
      "Announcing someone else's job",
      "Complaining about job search process"
    ],
    correctInterpretation: "Celebrating a job opportunity",
    culturalContext: "celebration-genuine",
    difficulty: 'easy'
  },
  
  // Medium - Subtle sarcasm
  {
    id: 'subtle_sarcasm',
    message: "Love how my phone battery dies right when I need GPS the most 🔋",
    author: "Jordan Smith",
    platform: "Twitter",
    context: "Posted while traveling",
    emojis: "🔋",
    interpretations: [
      "Genuinely appreciating phone timing",
      "Sarcastically complaining about bad timing",
      "Sharing a neutral observation",
      "Asking for phone recommendations"
    ],
    correctInterpretation: "Sarcastically complaining about bad timing",
    culturalContext: "technology-frustration",
    difficulty: 'medium'
  },
  
  // Medium - Generational slang
  {
    id: 'gen_z_slang',
    message: "This presentation is absolutely sending me 💀 why did they choose comic sans",
    author: "Riley Johnson",
    platform: "Discord",
    context: "Design critique channel",
    emojis: "💀",
    interpretations: [
      "Finding the presentation hilarious/absurd",
      "Being confused by the presentation",
      "Genuinely impressed by the design",
      "Asking for font recommendations"
    ],
    correctInterpretation: "Finding the presentation hilarious/absurd",
    culturalContext: "gen-z-humor",
    difficulty: 'medium'
  },
  
  // Medium - Cultural context needed
  {
    id: 'cultural_reference',
    message: "When the group project is due tomorrow but you're still in the 'let's make a group chat' phase 😅",
    author: "Sam Rodriguez",
    platform: "TikTok",
    context: "University meme page",
    emojis: "😅",
    interpretations: [
      "Genuinely organizing a productive group",
      "Relating to procrastination struggles",
      "Criticizing group communication methods",
      "Promoting teamwork strategies"
    ],
    correctInterpretation: "Relating to procrastination struggles",
    culturalContext: "student-procrastination",
    difficulty: 'medium'
  },
  
  // Hard - Complex emotional subtext
  {
    id: 'complex_subtext',
    message: "Congratulations on the promotion! You definitely earned it through all that hard work 👏",
    author: "Casey Williams",
    platform: "LinkedIn",
    context: "Public comment on colleague's post",
    emojis: "👏",
    interpretations: [
      "Genuinely congratulating the achievement",
      "Passive-aggressively implying favoritism",
      "Expressing surprise at the promotion",
      "Networking for professional opportunities"
    ],
    correctInterpretation: "Passive-aggressively implying favoritism",
    culturalContext: "workplace-politics",
    difficulty: 'hard'
  },
  
  // Hard - Ironic statement
  {
    id: 'ironic_statement',
    message: "Nothing says 'eco-friendly' like individually wrapping organic bananas in plastic 🌱",
    author: "Avery Davis",
    platform: "Twitter",
    context: "Environmental discussion thread",
    emojis: "🌱",
    interpretations: [
      "Praising innovative packaging solutions",
      "Ironically criticizing environmental contradictions",
      "Explaining sustainable packaging benefits",
      "Asking about organic food standards"
    ],
    correctInterpretation: "Ironically criticizing environmental contradictions",
    culturalContext: "environmental-irony",
    difficulty: 'hard'
  },
  
  // Hard - Multi-layered meaning
  {
    id: 'layered_meaning',
    message: "Thanks for 'helping' with the presentation prep 🙃 Really appreciate the 'collaboration'",
    author: "Taylor Kim",
    platform: "Teams",
    context: "Private message to team member",
    emojis: "🙃",
    interpretations: [
      "Genuinely thanking for valuable assistance",
      "Sarcastically calling out lack of contribution",
      "Requesting more collaboration in future",
      "Clarifying role responsibilities"
    ],
    correctInterpretation: "Sarcastically calling out lack of contribution",
    culturalContext: "passive-aggressive-communication",
    difficulty: 'hard'
  }
];