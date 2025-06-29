## Product Requirements Document: Yuno – The Internet's Human Intelligence Layer

**Product Name:** Yuno
**Version:** 1.1
**Date:** June 25, 2025
**Prepared for:** Bolt.new Development Team

-----

### 1\. Executive Summary: Transforming Friction into Fuel for AI

Yuno is a revolutionary human verification system that redefines the traditional CAPTCHA, transforming a frustrating security hurdle into an engaging, gamified interaction that simultaneously generates invaluable, human-labeled data for advanced AI training. Born from the urgent need for high-quality human reasoning data to fuel sophisticated AI models and the pervasive dissatisfaction with existing CAPTCHAs, Yuno introduces "Proof of Mind" – a next-generation layer for the internet that verifies humanness, trains AI, and blocks bots, all while delighting users with fast, fun, and informative cognitive micro-challenges.

Yuno aims to become a decentralized, crowdsourced platform for generating a continuous, high-quality stream of human reasoning data at scale.

### 2\. Product Vision: Proof of Mind, Not a Box to Tick

Yuno envisions a future where every human-bot interaction is symbiotic, not adversarial. We will build the new data layer for AI, one engaging interaction at a time. Instead of clicking traffic lights or deciphering distorted text, users will engage in interactive mini-tests that require real social understanding, cultural nuance, logic, emotion, or creativity. Each successful human response is logged and tagged to:

  * Verify humanness
  * Train AI systems using this invaluable human-labeled data
  * Identify and block evolving bot strategies using detection models

Yuno is not just security; it's the world's first **Proof of Mind** layer for the internet.

### 3\. Core Objectives & Value Proposition

**Yuno aims to solve:**

  * **Poor User Experience of Traditional CAPTCHAs:** Replaces annoying, clunky tasks with engaging micro-games.
  * **The AI "Data Drought":** Provides a novel, scalable source of high-quality human reasoning data.
  * **Limited Value of CAPTCHA Interactions:** Turns a "wasted" security check into a productive data-generating event.
  * **Stagnant CAPTCHA Security:** Introduces an adaptive, AI-driven system that learns from bot attacks to continuously improve its challenges and security.
  * **Ethical Data Sourcing:** Offers a transparent and potentially more ethical way to gather human interaction data compared to mass scraping or opaque methods.

**Core Objectives:**

  * **Prove Humanness:** Develop micro-challenges that only humans can reliably solve.
  * **Capture Intelligence:** Log structured, human-labeled answers from users.
  * **Improve AI:** Use anonymized responses to train smarter, safer, more contextual AI.
  * **Detect Bots:** Route failed/suspicious patterns to refine detection models and understand bot evolution.
  * **Delight Users:** Create a beautiful, playful, and fast UX that feels like a game.

### 4\. Challenge Types

Yuno challenges are intentionally designed to reveal real human cognition, not just logic or simple pattern matching. Each challenge must:

  * Last \< 10 seconds.
  * Output: `answer`, `timeMs`, `challengeId`, `optional voiceBlob` (for audio challenges).
  * Have clear pass/fail logic or score tiering.
  * Be designed to be easy and engaging for humans, leveraging human intuition, common sense, and cultural understanding.
  * Be difficult for current bots/AI to solve reliably, focusing on tasks that require nuanced understanding beyond simple pattern matching or brute force.
  * Be data-rich, meaning each successfully completed challenge by a human generates a data point that reflects a specific type of reasoning or interpretation.

**Implemented Challenge Types:**

1.  **MemeTimeWarp:** Drag memes into the approximate order they went viral (requires cultural context, temporal reasoning).
2.  **SentimentSpectrum:** Identify sarcasm, irony, or emotional tone in subtle messages (requires social understanding, linguistic nuance).
3.  **EthicsPing:** Choose what an AI assistant should ethically do in a given dilemma (requires moral reasoning, alignment insight).
4.  **PatternPlay:** Pick the next shape/element in a visual logic sequence (requires abstract reasoning, pattern recognition).
5.  **PerceptionFlip:** Choose what you saw first in a visual illusion (requires visual processing, subjective interpretation).
6.  **SocialDecoder:** Interpret tone in passive-aggressive compliments or ambiguous social messages (requires nuanced social understanding).
7.  **Voice/Avatar Check:** Speak a specific phrase back or answer a spoken prompt via an AI avatar (requires natural language processing, voice recognition, real-time interaction). This challenge leverages **Tavus API**.

### 5\. Data & Intelligence Flow

Every user response is logged with the following attributes:

```json
{
  "sessionId": "UUID_String",
  "challengeId": "UUID_String",
  "answer": "User_Response_Value",
  "responseTimeMs": 5600, // Time taken to respond
  "challengeType": "MemeTimeWarp",
  "inputMode": "drag-and-drop", // e.g., "text", "voice", "multiple-choice"
  "signalTag": ["sarcasm", "moral reasoning", "cultural context"], // Dynamically tagged based on challenge
  "isHuman": true // Heuristic or initial model prediction
}
```

**Two Processing Streams:**

  * **Human Stream:** Anonymized data, stored for high-quality AI training datasets. This data fuels the next wave of AI models.
  * **Bot Stream:** Data from failed or suspicious patterns routed to detection models to evolve filters and provide insights into adversarial strategies.

### 6\. Data-Driven Use Cases & Long-term Vision

**Immediate Value:**

  * **AI Training:** Provides human-labeled examples of sarcasm, logic, culture, emotion, and ethical reasoning.
  * **Security:** Captures and blocks bot behavior signatures over time, with adaptive security.
  * **UX Insights:** Analyze user pass/fail rates and completion times for challenge tuning.
  * **Ethics Research:** Potential for large-scale preference aggregation on ethical dilemmas.

**Long-term Vision:**

  * **Fueling the Next Wave of AI:** Become a continuous, high-quality stream of human reasoning data for advanced AI models across various industries (from natural language processing and computer vision to robotics and autonomous systems).
  * **Democratizing Data Contribution:** Allow every internet user to passively and almost effortlessly contribute to AI advancement through micro-interactions.
  * **Understanding Bot Evolution:** Create a unique "observatory" to study how bots attempt to solve complex reasoning tasks, providing invaluable insights into AI development and adversarial strategies.
  * **New Revenue Streams (Potential):** For websites, Yuno not only offers enhanced security and user experience but also holds the potential for them to become micro-contributors to the AI data economy.
  * **Adaptive Challenge Generation:** Yuno's own AI will continuously expand and refine the pool of challenges, ensuring novelty and increasing difficulty for evolving bot strategies, learning from both human successes and bot failures.

### 7\. System Architecture (Built with Bolt.new)

**Diagram:**

```
[ User Browser ]
     ↓
[ Yuno Widget (Lightweight JS Loader) ]
     ↓
[ Challenge Engine (React + TypeScript + Tailwind + shadcn/ui) ]
     ↓
[ Supabase DB + Edge Functions (RLS for security) ]
   ↙           ↘
Human Stream   Bot Stream
   ↓              ↓
AI Datasets    Detection Models
```

**Key Integrations & Technologies Implemented:**

  * **Frontend & Challenge Engine:** React, TypeScript, Tailwind CSS, shadcn/ui
  * **Widget Engine:** Lightweight JavaScript loader + React component for easy embedding
  * **Backend & Database:** Supabase (PostgreSQL database with Row Level Security, Edge Functions for challenge logic and data routing)
  * **AI Content Generation:** Google Gemini API for creating diverse challenge content
  * **Video Verification:** Tavus API for real-time AI video agents and conversational prompts
  * **Hosting/Deployment:** Netlify
  * **Performance Optimization:** Lazy loading, code splitting, and responsive design

### 8\. Widget Integration

Yuno offers simple integration methods for web developers:

**Simple HTML Embed:**

```html
<script src="https://yuno.ai/widget.js" data-key="your-site-key" async></script>
```

**React Component:**

```jsx
import { YunoWidget } from '@yuno/widget';

function MyApp() {
  const handleSuccess = (sessionId) => {
    console.log("Human verified! Session:", sessionId);
    // Unlock application access or proceed
  };

  const handleFail = () => {
    alert("Verification failed. Please try again.");
    // Optionally retry or block access
  };

  return (
    <div>
      {/* Your application content */}
      <YunoWidget
        theme="dark"
        avatarChallenge={true} // Enable Tavus-powered avatar challenge
        onSuccess={handleSuccess}
        onFail={handleFail}
        mode="compact" // "compact" or "full"
      />
    </div>
  );
}
```

### 9\. UX & UI Principles

Yuno's design philosophy is centered around transforming a necessary security step into an enjoyable, rewarding interaction.

  * **Fast:** Widget loads \< 200ms, individual challenge completion \< 10s.
  * **Playful:** Rounded UI elements, subtle animations, immediate color feedback on success/failure, gamified scoring.
  * **Mobile-first:** Tappable, intuitive, and fully responsive interactions for all devices.
  * **Gen-Z Aesthetic:** Bold typography, contemporary design, meme-friendly tone where appropriate.
  * **Meaningful:** Each challenge has a cognitive payload, making users feel their interaction contributes to something greater.
  * **Visual:** Minimal, dark UI with gradient neon highlights for clarity and modern appeal.
  * A strong, intuitive, and visually pleasing user interface (UI) and user experience (UX) are deemed critical for success.

### 10\. Accomplished Features

We've successfully implemented the following key features:

1. **Diverse Challenge Types**: Seven distinct cognitive challenges targeting different aspects of human cognition
2. **AI Content Generation**: Integration with Google Gemini API to dynamically create challenge content
3. **Video Verification**: Tavus API integration for conversational video verification
4. **Bot Detection System**: Advanced behavioral analysis for sophisticated bot detection
5. **Admin Dashboard**: Comprehensive management interface with analytics
6. **Supabase Integration**: Secure database with row-level security and edge functions
7. **Client API System**: Secure API key management for website integrations
8. **Mobile Responsiveness**: Fully responsive design across all device types
9. **Multi-Theme Support**: Dark and light mode with smooth transitions
10. **Tiered Pricing Model**: Clear pricing structure for different business needs

### 11\. Taglines

  * "Yuno how to human?"
  * "The internet's vibe check."
  * "Microgames. Macro proof."
  * "Bots don't vibe. You do."
  * "Proof of mind, not a box to tick."
  * "Intelligent Challenges. Real Insights."
  * "Transforming Friction into Fuel."

-----