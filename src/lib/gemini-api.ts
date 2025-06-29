/**
 * Google Gemini API integration for AI-assisted challenge content generation
 * Sprint 7: AI-Assisted Content Generation
 */

import { supabase } from './supabase';
import { getApiKey } from './supabase/edge-functions';

export interface ContentGenerationRequest {
  challengeType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  theme?: string;
  customPrompt?: string;
  count?: number;
}

export interface GeneratedContent {
  id: string;
  type: string;
  title: string;
  description: string;
  content: any;
  correct_answer: any;
  signal_tags: string[];
  input_mode: string;
  difficulty: string;
  quality_score: number;
  generation_metadata: {
    prompt_used: string;
    model_version: string;
    generated_at: string;
    review_status: 'pending' | 'approved' | 'rejected';
  };
}

export interface ContentQualityMetrics {
  coherence_score: number;
  difficulty_alignment: number;
  cultural_sensitivity: number;
  educational_value: number;
  engagement_potential: number;
  safety_score: number;
  overall_quality: number;
  errors?: string[];
}

class GeminiContentGenerator {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
  private mockData = true; // Set to true to use mock data for testing

  async initialize(): Promise<void> {
    try {
      // Get API key from environment or Supabase functions
      this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!this.apiKey) {
        try {
          const apiKey = await getApiKey('GEMINI_API_KEY');
          
          if (apiKey) {
            this.apiKey = apiKey;
            this.mockData = false;
          } else {
            console.warn('Failed to fetch API key, will use mock data');
            this.mockData = true;
          }
        } catch (backendError) {
          console.warn('Failed to fetch API key from backend, will use mock data:', backendError);
          this.mockData = true;
        }
      } else {
        this.mockData = false;
      }

      console.log(`Gemini API initialized successfully (using ${this.mockData ? 'mock data' : 'real API'})`);
    } catch (error) {
      console.error('Failed to initialize Gemini API:', error);
      this.mockData = true;
    }
  }

  /**
   * Generate challenge content using Gemini API
   */
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent[]> {
    if (!this.apiKey && !this.mockData) {
      await this.initialize();
    }

    const count = request.count || 1;
    const results: GeneratedContent[] = [];

    try {
      for (let i = 0; i < count; i++) {
        let generatedContent: GeneratedContent;
        
        if (this.mockData) {
          // Use mock data for testing or when API key is not available
          generatedContent = await this.generateMockContent(request);
        } else {
          // Use real Gemini API
          const prompt = this.buildPrompt(request);
          const response = await this.callGeminiAPI(prompt);
          const parsedContent = this.parseGeminiResponse(response, request);
          const qualityScore = await this.assessContentQuality(parsedContent);
          
          generatedContent = {
            ...parsedContent,
            id: crypto.randomUUID(),
            quality_score: qualityScore.overall_quality,
            generation_metadata: {
              prompt_used: prompt,
              model_version: 'gemini-1.5-flash',
              generated_at: new Date().toISOString(),
              review_status: 'pending'
            }
          };
        }

        results.push(generatedContent);
      }

      return results;
    } catch (error) {
      console.error(`Failed to generate content:`, error);
      throw error;
    }
  }

  /**
   * Build specialized prompts for each challenge type
   */
  private buildPrompt(request: ContentGenerationRequest): string {
    const baseContext = `You are an expert cognitive challenge designer creating engaging human verification tasks. 
Generate ${request.difficulty} difficulty content that tests uniquely human capabilities while being fun and accessible.

Challenge Type: ${request.challengeType}
Difficulty: ${request.difficulty}
${request.theme ? `Theme: ${request.theme}` : ''}
${request.customPrompt ? `Additional Context: ${request.customPrompt}` : ''}

Requirements:
- Content must be culturally diverse and inclusive
- Avoid offensive, discriminatory, or harmful content
- Ensure accessibility for users with different abilities
- Create engaging, thought-provoking challenges
- Include clear, unambiguous correct answers
- Provide helpful, educational feedback

Return your response as valid JSON with this exact structure:
{
  "title": "Challenge title (concise and engaging)",
  "description": "Brief description of what users need to do",
  "content": { /* challenge-specific content object */ },
  "correct_answer": /* correct answer in appropriate format */,
  "signal_tags": ["tag1", "tag2", "tag3"],
  "input_mode": "multiple-choice|drag-and-drop|text-input|selection"
}`;

    switch (request.challengeType) {
      case 'SentimentSpectrum':
        return `${baseContext}

Create a sentiment analysis challenge with a social media message or workplace communication.
Include cultural context, generational nuances, and emotional subtleties.

Content structure:
{
  "message": "Text to analyze (with appropriate emoji/punctuation)",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "context": "Optional context about the situation"
}

Examples of good sentiment challenges:
- Workplace sarcasm detection
- Social media tone analysis  
- Generational communication differences
- Cultural expression variations`;

      case 'MemeTimeWarp':
        return `${baseContext}

Create a meme chronology challenge with 3-5 internet memes from different eras.
Focus on cultural evolution and internet history.

Content structure:
{
  "memes": [
    {"id": "unique_id", "name": "Meme Name", "year": 2020, "platform": "TikTok"},
    {"id": "unique_id2", "name": "Another Meme", "year": 2015, "platform": "Twitter"}
  ]
}

The correct_answer should be an array of meme IDs in chronological order.
Choose memes that represent different technological or cultural shifts.`;

      case 'EthicsPing':
        return `${baseContext}

Create an ethical dilemma with multiple valid perspectives.
Focus on real-world scenarios that require moral reasoning.

Content structure:
{
  "scenario": "Detailed ethical situation (2-3 sentences)",
  "choices": [
    {
      "id": "choice_id",
      "title": "Action Title",
      "description": "What this choice involves",
      "feedback": "Ethical framework explanation"
    }
  ],
  "category": "privacy|fairness|autonomy|welfare"
}

Cover topics like: AI bias, privacy vs security, resource allocation, technological ethics.`;

      case 'PatternPlay':
        return `${baseContext}

Create a mathematical or logical pattern recognition challenge.
Include arithmetic, geometric, or conceptual sequences.

Content structure:
{
  "sequence": [1, 2, 4, 8],
  "options": [16, 12, 10, 6],
  "rule": "Human-readable description of the pattern",
  "category": "arithmetic|geometric|fibonacci|alternating"
}

Difficulty guidelines:
- Easy: Simple arithmetic progressions
- Medium: Geometric sequences, Fibonacci
- Hard: Complex alternating patterns, mathematical concepts`;

      case 'PerceptionFlip':
        return `${baseContext}

Create a visual perception or optical illusion challenge.
Focus on cognitive biases and perceptual psychology.

Content structure:
{
  "illusionType": "perspective|ambiguous|color|motion",
  "description": "What users should observe",
  "options": ["Interpretation 1", "Interpretation 2", "Interpretation 3"],
  "hint": "Optional hint for complex illusions"
}

The correct_answer should include multiple acceptable interpretations.`;

      case 'SocialDecoder':
        return `${baseContext}

Create a social communication challenge analyzing tone, cultural context, and meaning.
Include generational differences and cultural nuances.

Content structure:
{
  "message": "Social media post or message",
  "author": "Mock username",
  "platform": "Social platform name",
  "context": "Situational context",
  "interpretations": ["Meaning 1", "Meaning 2", "Meaning 3", "Meaning 4"]
}

Focus on: sarcasm, cultural references, generational slang, emotional subtext.`;

      default:
        return `${baseContext}

Create a general cognitive challenge that tests human reasoning, creativity, or cultural understanding.
Adapt the content structure based on the challenge requirements.`;
    }
  }

  /**
   * Call Gemini API with proper error handling
   */
  private async callGeminiAPI(prompt: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Gemini API not initialized. Missing API key.');
    }
    
    try {
      // Use URL params for key to avoid CORS preflight issues
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      });

      // Improved error handling
      if (!response.ok) {
        let errorMessage = `Gemini API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.error?.message || JSON.stringify(errorData)}`;
        } catch (e) {
          // If we can't parse the error JSON, just use the status
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No content generated by Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error(`Gemini API call failed: ${error.message}`);
    }
  }

  /**
   * Parse and validate Gemini response
   */
  private parseGeminiResponse(response: string, request: ContentGenerationRequest): Omit<GeneratedContent, 'id' | 'quality_score' | 'generation_metadata'> {
    try {
      // Extract JSON from response (in case it's wrapped in markdown)
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;
      
      let parsed;
      try {
        parsed = JSON.parse(jsonString.trim());
      } catch (e) {
        // If direct parsing fails, try to find and extract the JSON object
        const jsonContent = jsonString.match(/(\{[\s\S]*\})/);
        if (jsonContent && jsonContent[1]) {
          parsed = JSON.parse(jsonContent[1]);
        } else {
          throw new Error("Couldn't extract valid JSON from the response");
        }
      }
      
      // Validate required fields
      if (!parsed.title || !parsed.description || !parsed.content || !parsed.correct_answer) {
        throw new Error('Missing required fields in generated content');
      }

      // Set defaults and validate structure
      return {
        type: request.challengeType,
        title: parsed.title,
        description: parsed.description,
        content: parsed.content,
        correct_answer: parsed.correct_answer,
        signal_tags: Array.isArray(parsed.signal_tags) ? parsed.signal_tags : ['ai-generated'],
        input_mode: parsed.input_mode || 'multiple-choice',
        difficulty: request.difficulty
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      console.error('Raw response:', response);
      throw new Error(`Invalid JSON response from Gemini API: ${error.message}`);
    }
  }

  /**
   * Generate mock content for testing when API key is not available
   */
  private async generateMockContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    // Generate different mock content based on the challenge type
    let content: Omit<GeneratedContent, 'id' | 'quality_score' | 'generation_metadata'>;
    const mockQuality = 85 + Math.floor(Math.random() * 10);
    
    switch (request.challengeType) {
      case 'SentimentSpectrum':
        content = {
          type: 'SentimentSpectrum',
          title: 'Decode This Text Message',
          description: 'Identify the true sentiment behind this text message',
          content: {
            message: "Thanks for the 'help' with the project yesterday... 🙄",
            options: ["Genuine gratitude", "Sarcastic frustration", "Neutral acknowledgment", "Confused appreciation"]
          },
          correct_answer: "Sarcastic frustration",
          signal_tags: ['sarcasm', 'text-communication', 'workplace', 'ai-generated'],
          input_mode: 'multiple-choice',
          difficulty: request.difficulty
        };
        break;
      
      case 'MemeTimeWarp':
        content = {
          type: 'MemeTimeWarp',
          title: 'Internet Culture Timeline',
          description: 'Arrange these memes in order of when they first went viral',
          content: {
            memes: [
              {id: "distracted_boyfriend", name: "Distracted Boyfriend", year: 2017, platform: "Twitter"},
              {id: "doge", name: "Doge", year: 2013, platform: "Reddit"},
              {id: "galaxy_brain", name: "Expanding Brain", year: 2017, platform: "Reddit"}
            ]
          },
          correct_answer: ["doge", "distracted_boyfriend", "galaxy_brain"],
          signal_tags: ['chronology', 'internet-culture', 'memes', 'ai-generated'],
          input_mode: 'drag-and-drop',
          difficulty: request.difficulty
        };
        break;
        
      case 'EthicsPing':
        content = {
          type: 'EthicsPing',
          title: 'AI Privacy Dilemma',
          description: 'What would you do in this ethical scenario?',
          content: {
            scenario: "An AI assistant accidentally recorded private conversations to improve its language model. The company discovers this and must decide what to do with the data.",
            choices: [
              {
                id: "delete_data",
                title: "Delete All Data",
                description: "Immediately delete all collected data and inform users",
                feedback: "Prioritizes privacy but loses valuable training data"
              },
              {
                id: "anonymize",
                title: "Anonymize and Keep",
                description: "Strip all identifiable information and use for training",
                feedback: "Balances privacy concerns with model improvement"
              },
              {
                id: "inform_opt_out",
                title: "Inform and Allow Opt-Out",
                description: "Notify users and let them choose to delete their data",
                feedback: "Respects user autonomy and transparency principles"
              }
            ],
            category: "privacy"
          },
          correct_answer: {
            acceptableChoices: ["delete_data", "anonymize", "inform_opt_out"]
          },
          signal_tags: ['ethics', 'ai-ethics', 'privacy', 'ai-generated'],
          input_mode: 'multiple-choice',
          difficulty: request.difficulty
        };
        break;
        
      case 'PatternPlay':
        content = {
          type: 'PatternPlay',
          title: 'Number Sequence Pattern',
          description: 'Identify the next number in this sequence',
          content: {
            sequence: [2, 4, 8, 16],
            options: [32, 24, 20, 18],
            rule: "Each number is double the previous number",
            category: "geometric"
          },
          correct_answer: 32,
          signal_tags: ['pattern-recognition', 'math', 'sequence', 'ai-generated'],
          input_mode: 'multiple-choice',
          difficulty: request.difficulty
        };
        break;
        
      case 'PerceptionFlip':
        content = {
          type: 'PerceptionFlip',
          title: 'Visual Perception Challenge',
          description: 'What do you see first in this image?',
          content: {
            illusionType: "ambiguous",
            options: ["Young woman", "Old woman", "Both simultaneously"],
            hint: "Look at the image from different angles"
          },
          correct_answer: {
            acceptableAnswers: ["Young woman", "Old woman"]
          },
          signal_tags: ['visual-perception', 'cognitive-bias', 'illusion', 'ai-generated'],
          input_mode: 'multiple-choice',
          difficulty: request.difficulty
        };
        break;
        
      case 'SocialDecoder':
        content = {
          type: 'SocialDecoder',
          title: 'Decode Social Context',
          description: 'What is the true meaning behind this social media post?',
          content: {
            message: "Just having the BEST day ever working on this project 🙃",
            author: "WorkplaceUser",
            platform: "Teams Chat",
            context: "Posted at 7pm on Friday after a deadline was moved up",
            interpretations: [
              "Genuinely enjoying the project",
              "Expressing frustration through sarcasm",
              "Seeking sympathy from coworkers",
              "Passive-aggressively complaining"
            ]
          },
          correct_answer: {
            acceptableAnswers: ["Expressing frustration through sarcasm", "Passive-aggressively complaining"]
          },
          signal_tags: ['social-context', 'workplace-communication', 'sarcasm', 'ai-generated'],
          input_mode: 'multiple-choice',
          difficulty: request.difficulty
        };
        break;
        
      default:
        content = {
          type: request.challengeType,
          title: 'Generic Challenge',
          description: 'A sample AI-generated challenge',
          content: {
            message: "This is a placeholder for challenge content",
            options: ["Option A", "Option B", "Option C", "Option D"]
          },
          correct_answer: "Option B",
          signal_tags: ['sample', 'placeholder', 'ai-generated'],
          input_mode: 'multiple-choice',
          difficulty: request.difficulty
        };
    }
    
    // Add randomness to make multiple generated items different
    const randomSuffix = Math.floor(Math.random() * 100);
    content.title = `${content.title} #${randomSuffix}`;
    
    // Create full GeneratedContent object
    return {
      ...content,
      id: crypto.randomUUID(),
      quality_score: mockQuality,
      generation_metadata: {
        prompt_used: "Mock prompt for testing",
        model_version: "gemini-mock-1.0",
        generated_at: new Date().toISOString(),
        review_status: 'pending'
      }
    };
  }

  /**
   * Assess content quality using multiple metrics
   */
  private async assessContentQuality(content: any): Promise<ContentQualityMetrics> {
    // Implement quality assessment algorithms
    const errors: string[] = [];
    
    const metrics: ContentQualityMetrics = {
      coherence_score: this.assessCoherence(content),
      difficulty_alignment: this.assessDifficultyAlignment(content),
      cultural_sensitivity: this.assessCulturalSensitivity(content),
      educational_value: this.assessEducationalValue(content),
      engagement_potential: this.assessEngagementPotential(content),
      safety_score: this.assessSafety(content),
      errors: errors
    };

    // Calculate weighted overall quality score
    const overallQuality = (
      metrics.coherence_score * 0.2 +
      metrics.difficulty_alignment * 0.15 +
      metrics.cultural_sensitivity * 0.2 +
      metrics.educational_value * 0.15 +
      metrics.engagement_potential * 0.15 +
      metrics.safety_score * 0.15
    );
    
    metrics.overall_quality = overallQuality;

    return metrics;
  }

  private assessCoherence(content: any): number {
    // Check if title, description, and content are logically connected
    const hasTitle = content.title && content.title.length > 5;
    const hasDescription = content.description && content.description.length > 10;
    const hasValidContent = content.content && typeof content.content === 'object';
    const hasCorrectAnswer = content.correct_answer !== undefined;

    const score = (
      (hasTitle ? 25 : 0) +
      (hasDescription ? 25 : 0) +
      (hasValidContent ? 25 : 0) +
      (hasCorrectAnswer ? 25 : 0)
    );

    return Math.min(100, score);
  }

  private assessDifficultyAlignment(content: any): number {
    // Assess if content complexity matches intended difficulty
    const titleComplexity = content.title ? content.title.split(' ').length : 0;
    const descriptionComplexity = content.description ? content.description.split(' ').length : 0;
    
    // Simple heuristic - can be enhanced with more sophisticated analysis
    let expectedComplexity = 0;
    switch (content.difficulty) {
      case 'easy': expectedComplexity = 5; break;
      case 'medium': expectedComplexity = 10; break;
      case 'hard': expectedComplexity = 15; break;
    }

    const actualComplexity = Math.max(titleComplexity, descriptionComplexity);
    const alignment = 100 - Math.abs(actualComplexity - expectedComplexity) * 5;
    
    return Math.max(0, Math.min(100, alignment));
  }

  private assessCulturalSensitivity(content: any): number {
    // Check for potentially sensitive content
    const sensitiveTerms = [
      'race', 'religion', 'gender', 'sexuality', 'disability', 
      'stereotype', 'bias', 'discrimination'
    ];
    
    const contentText = JSON.stringify(content).toLowerCase();
    let sensitivityIssues = 0;
    
    sensitiveTerms.forEach(term => {
      if (contentText.includes(term)) {
        sensitivityIssues++;
      }
    });

    // Higher sensitivity issues = lower score
    return Math.max(50, 100 - sensitivityIssues * 10);
  }

  private assessEducationalValue(content: any): number {
    // Assess learning potential and intellectual value
    const hasExplanation = content.description && content.description.length > 20;
    const hasContext = content.content && Object.keys(content.content).length > 2;
    const hasSignalTags = content.signal_tags && content.signal_tags.length > 0;

    return (
      (hasExplanation ? 40 : 0) +
      (hasContext ? 40 : 0) +
      (hasSignalTags ? 20 : 0)
    );
  }

  private assessEngagementPotential(content: any): number {
    // Assess how engaging and interesting the content might be
    const titleLength = content.title ? content.title.length : 0;
    const hasVariety = content.content && Object.keys(content.content).length > 1;
    const hasOptions = content.content && content.content.options && content.content.options.length > 2;

    let score = 0;
    
    // Title engagement (not too short, not too long)
    if (titleLength >= 10 && titleLength <= 60) score += 30;
    if (hasVariety) score += 35;
    if (hasOptions) score += 35;

    return Math.min(100, score);
  }

  private assessSafety(content: any): number {
    // Check for harmful, inappropriate, or unsafe content
    const harmfulPatterns = [
      /violence/i, /harm/i, /dangerous/i, /illegal/i, /unsafe/i,
      /offensive/i, /inappropriate/i, /explicit/i
    ];

    const contentText = JSON.stringify(content);
    let safetyIssues = 0;

    harmfulPatterns.forEach(pattern => {
      if (pattern.test(contentText)) {
        safetyIssues++;
      }
    });

    return Math.max(0, 100 - safetyIssues * 20);
  }

  /**
   * Batch generate multiple pieces of content
   */
  async batchGenerate(requests: ContentGenerationRequest[]): Promise<GeneratedContent[]> {
    const results: GeneratedContent[] = [];
    
    for (const request of requests) {
      try {
        const generated = await this.generateContent(request);
        results.push(...generated);
      } catch (error) {
        console.error('Batch generation error for request:', request, error);
        // Continue with other requests
      }
    }

    return results;
  }

  /**
   * Generate content variations for A/B testing
   */
  async generateVariations(baseRequest: ContentGenerationRequest, variationCount: number = 3): Promise<GeneratedContent[]> {
    const variations: ContentGenerationRequest[] = [];
    
    for (let i = 0; i < variationCount; i++) {
      variations.push({
        ...baseRequest,
        customPrompt: `${baseRequest.customPrompt || ''} Create variation ${i + 1} with a different approach or perspective.`
      });
    }

    return this.batchGenerate(variations);
  }
}

// Export singleton instance
export const geminiGenerator = new GeminiContentGenerator();

// Utility functions for content management
export const validateGeneratedContent = (content: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!content.title || typeof content.title !== 'string' || content.title.length < 5) {
    errors.push('Title must be a string with at least 5 characters');
  }

  if (!content.description || typeof content.description !== 'string' || content.description.length < 10) {
    errors.push('Description must be a string with at least 10 characters');
  }

  if (!content.content || typeof content.content !== 'object') {
    errors.push('Content must be a valid object');
  }

  if (content.correct_answer === undefined) {
    errors.push('Correct answer is required');
  }

  if (!Array.isArray(content.signal_tags)) {
    errors.push('Signal tags must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const filterContentBySafety = (contents: GeneratedContent[], minSafetyScore: number = 80): GeneratedContent[] => {
  return contents.filter(content => content.quality_score >= minSafetyScore);
};

export const rankContentByQuality = (contents: GeneratedContent[]): GeneratedContent[] => {
  return [...contents].sort((a, b) => b.quality_score - a.quality_score);
};