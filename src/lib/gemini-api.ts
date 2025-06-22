/**
 * Google Gemini API integration for AI-assisted challenge content generation
 * Sprint 7: AI-Assisted Content Generation
 */

import { supabase } from './supabase';

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
}

class GeminiContentGenerator {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

  async initialize(): Promise<void> {
    try {
      // Get API key from Supabase environment
      let apiKeyFromBackend = null;
      try {
        const { data, error } = await supabase.functions.invoke('get-env-var', {
          body: { key: 'GEMINI_API_KEY' }
        });
        
        if (data?.value) {
          apiKeyFromBackend = data.value;
        }
      } catch (backendError) {
        console.warn('Failed to fetch API key from backend, trying client environment:', backendError);
      }
      
      // Use the backend key if available, otherwise try client environment
      this.apiKey = apiKeyFromBackend || import.meta.env.VITE_GEMINI_API_KEY;
      
      if (error || !data?.value) {
        if (!this.apiKey) {
          throw new Error('GEMINI_API_KEY not found in environment variables');
        }
      }

      console.log('Gemini API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini API:', error);
      throw error;
    }
  }

  /**
   * Generate challenge content using Gemini API
   */
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent[]> {
    if (!this.apiKey) {
      await this.initialize();
    }

    const prompt = this.buildPrompt(request);
    const count = request.count || 1;
    const results: GeneratedContent[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const response = await this.callGeminiAPI(prompt);
        const parsedContent = this.parseGeminiResponse(response, request);
        const qualityScore = await this.assessContentQuality(parsedContent);
        
        const generatedContent: GeneratedContent = {
          ...parsedContent,
          id: crypto.randomUUID(),
          quality_score: qualityScore.overall_quality,
          generation_metadata: {
            prompt_used: prompt,
            model_version: 'gemini-pro',
            generated_at: new Date().toISOString(),
            review_status: 'pending'
          }
        };

        results.push(generatedContent);
      } catch (error) {
        console.error(`Failed to generate content ${i + 1}/${count}:`, error);
        // Continue with other generations
      }
    }

    return results;
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
  }

  /**
   * Parse and validate Gemini response
   */
  private parseGeminiResponse(response: string, request: ContentGenerationRequest): Omit<GeneratedContent, 'id' | 'quality_score' | 'generation_metadata'> {
    try {
      // Extract JSON from response (in case it's wrapped in markdown)
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;
      
      const parsed = JSON.parse(jsonString);
      
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
      throw new Error(`Invalid JSON response from Gemini API: ${error}`);
    }
  }

  /**
   * Assess content quality using multiple metrics
   */
  private async assessContentQuality(content: any): Promise<ContentQualityMetrics> {
    // Implement quality assessment algorithms
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
    metrics.overall_quality = (
      metrics.coherence_score * 0.2 +
      metrics.difficulty_alignment * 0.15 +
      metrics.cultural_sensitivity * 0.2 +
      metrics.educational_value * 0.15 +
      metrics.engagement_potential * 0.15 +
      metrics.safety_score * 0.15
    );

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