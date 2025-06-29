import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Wand2, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Download,
  Eye,
  X,
  Settings,
  TrendingUp,
  FileText,
  Zap
} from 'lucide-react';
import Button from '../../ui/Button/Button';
import Card from '../../ui/Card/Card';
import Input from '../../ui/Input/Input';
import { 
  geminiGenerator, 
  ContentGenerationRequest, 
  GeneratedContent,
  validateGeneratedContent,
  rankContentByQuality 
} from '../../../lib/gemini-api';
import { challengeApi } from '../../../lib/api';

interface AIContentGeneratorProps {
  onContentGenerated?: (content: GeneratedContent[]) => void;
  onClose?: () => void;
}

const AIContentGenerator = ({ onContentGenerated, onClose }: AIContentGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [previewContent, setPreviewContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [generationSettings, setGenerationSettings] = useState<ContentGenerationRequest>({
    challengeType: 'SentimentSpectrum',
    difficulty: 'medium',
    theme: '',
    customPrompt: '',
    count: 3
  });

  const challengeTypes = [
    { value: 'SentimentSpectrum', label: 'Sentiment Analysis', icon: Brain },
    { value: 'MemeTimeWarp', label: 'Meme Timeline', icon: TrendingUp },
    { value: 'EthicsPing', label: 'Ethics Scenario', icon: FileText },
    { value: 'PatternPlay', label: 'Pattern Logic', icon: Settings },
    { value: 'PerceptionFlip', label: 'Visual Perception', icon: Eye },
    { value: 'SocialDecoder', label: 'Social Context', icon: Zap }
  ];

  const themes = {
    SentimentSpectrum: ['Workplace Communication', 'Social Media', 'Generational Differences', 'Cultural Context'],
    MemeTimeWarp: ['Early Internet', 'Social Media Era', 'Gaming Culture', 'Pop Culture'],
    EthicsPing: ['AI Ethics', 'Privacy Rights', 'Medical Decisions', 'Environmental Impact'],
    PatternPlay: ['Mathematical Sequences', 'Logical Patterns', 'Visual Patterns', 'Temporal Patterns'],
    PerceptionFlip: ['Optical Illusions', 'Cognitive Biases', 'Perspective Shifts', 'Visual Ambiguity'],
    SocialDecoder: ['Sarcasm Detection', 'Cultural Nuances', 'Emotional Subtext', 'Communication Styles']
  };

  // Initialize geminiGenerator when component mounts
  useEffect(() => {
    const initGenerator = async () => {
      try {
        await geminiGenerator.initialize();
      } catch (err) {
        console.warn("Couldn't initialize Gemini generator, will use mock data:", err);
      }
    };
    
    initGenerator();
  }, []);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setSuccess(null);

      let content;
      
      try {
        content = await geminiGenerator.generateContent(generationSettings);
      } catch (err: any) {
        console.error('API call error:', err);
        throw new Error(`Failed to generate content: ${err.message}`);
      }
      
      if (content.length === 0) {
        throw new Error('No content was generated. Please try again.');
      }

      // Validate and rank content
      const validatedContent = content.filter(item => {
        const validation = validateGeneratedContent(item);
        if (!validation.isValid) {
          console.warn('Invalid content generated:', validation.errors);
          return false;
        }
        return true;
      });

      if (validatedContent.length === 0) {
        throw new Error('All generated content failed validation. Please adjust your parameters and try again.');
      }

      const rankedContent = rankContentByQuality(validatedContent);
      setGeneratedContent(rankedContent);
      setSuccess(`Successfully generated ${rankedContent.length} high-quality challenge${rankedContent.length > 1 ? 's' : ''}!`);
      
      onContentGenerated?.(rankedContent);
    } catch (err: any) {
      console.error('Content generation error:', err);
      // Provide more detailed error message to help users troubleshoot
      setError(err.message || 'Failed to generate content. Please check your API configuration and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveContent = async (contentIds: string[]) => {
    try {
      setIsGenerating(true);
      
      const contentToApprove = generatedContent.filter(content => contentIds.includes(content.id));
      
      for (const content of contentToApprove) {
        // Create challenge in database
        await challengeApi.create({
          type: content.type,
          title: content.title,
          description: content.description,
          content: content.content,
          correct_answer: content.correct_answer,
          signal_tags: [...content.signal_tags, 'ai-generated'],
          input_mode: content.input_mode,
          difficulty: content.difficulty,
          is_active: false, // Start as draft for human review
          generation_metadata: content.generation_metadata,
          quality_score: content.quality_score
        });
      }

      setSuccess(`Successfully created ${contentToApprove.length} challenge${contentToApprove.length > 1 ? 's' : ''} in the database!`);
      setSelectedContent([]);
      
      // Remove approved content from the list
      setGeneratedContent(prev => prev.filter(content => !contentIds.includes(content.id)));
      
    } catch (err: any) {
      console.error('Error approving content:', err);
      setError(err.message || 'Failed to save content to database.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectContent = (contentId: string) => {
    setSelectedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-neon-green';
    if (score >= 60) return 'text-neon-orange';
    return 'text-neon-red';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Review';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-neon-purple" />
            AI Content Generator
          </h2>
          <p className="text-muted">Generate high-quality challenges using AI assistance</p>
        </div>
        {onClose && (
          <Button variant="ghost" onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 bg-neon-red/20 border border-neon-red/30 rounded-lg"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 text-neon-red" />
          <span className="text-neon-red text-sm">{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 bg-neon-green/20 border border-neon-green/30 rounded-lg"
          role="alert"
        >
          <CheckCircle className="w-5 h-5 text-neon-green" />
          <span className="text-neon-green text-sm">{success}</span>
        </motion.div>
      )}

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-8"
          aria-live="polite"
        >
          <div className="flex flex-col items-center">
            <RefreshCw className="w-10 h-10 text-neon-purple animate-spin mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-primary mb-2">Generating Content</h3>
            <p className="text-muted text-sm text-center max-w-md">
              Creating high-quality challenges using AI. This may take 10-30 seconds per challenge.
            </p>
          </div>
        </motion.div>
      )}

      {/* Generation Settings */}
      <Card variant="glass">
        <h3 className="text-lg font-semibold text-primary mb-4">Generation Settings</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2" htmlFor="challenge-type">
              Challenge Type
            </label>
            <select
              id="challenge-type"
              value={generationSettings.challengeType}
              onChange={(e) => setGenerationSettings(prev => ({ 
                ...prev, 
                challengeType: e.target.value,
                theme: '' // Reset theme when type changes
              }))}
              className="input-field"
              aria-label="Select challenge type"
            >
              {challengeTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2" htmlFor="difficulty-level">
              Difficulty Level
            </label>
            <select
              id="difficulty-level"
              value={generationSettings.difficulty}
              onChange={(e) => setGenerationSettings(prev => ({ 
                ...prev, 
                difficulty: e.target.value as 'easy' | 'medium' | 'hard'
              }))}
              className="input-field"
              aria-label="Select difficulty level"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2" htmlFor="theme-selection">
              Theme (Optional)
            </label>
            <select
              id="theme-selection"
              value={generationSettings.theme}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, theme: e.target.value }))}
              className="input-field"
              aria-label="Select theme"
            >
              <option value="">Any Theme</option>
              {themes[generationSettings.challengeType as keyof typeof themes]?.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2" htmlFor="generate-count">
              Number to Generate
            </label>
            <select
              id="generate-count"
              value={generationSettings.count}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, count: parseInt(e.target.value) }))}
              className="input-field"
              aria-label="Select number of challenges to generate"
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-2" htmlFor="custom-instructions">
              Custom Instructions (Optional)
            </label>
            <textarea
              id="custom-instructions"
              value={generationSettings.customPrompt}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, customPrompt: e.target.value }))}
              placeholder="Additional instructions for the AI (e.g., 'Focus on workplace scenarios', 'Include diverse cultural perspectives')"
              className="input-field min-h-[80px] resize-none"
              aria-label="Custom instructions for AI generation"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 ai-generator-btn"
            aria-busy={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" aria-hidden="true" />
                Generate Content
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Generated Content */}
      {generatedContent.length > 0 && (
        <Card variant="glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Generated Content</h3>
            <div className="flex items-center gap-2">
              {selectedContent.length > 0 && (
                <Button
                  onClick={() => handleApproveContent(selectedContent)}
                  disabled={isGenerating}
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                  Approve Selected ({selectedContent.length})
                </Button>
              )}
              <Button
                onClick={() => setSelectedContent(generatedContent.map(c => c.id))}
                variant="secondary"
                size="sm"
              >
                Select All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {generatedContent.map((content) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 glass-light rounded-lg border transition-all duration-200 ${
                  selectedContent.includes(content.id) 
                    ? 'border-neon-blue bg-neon-blue/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id={`select-content-${content.id}`}
                        checked={selectedContent.includes(content.id)}
                        onChange={() => handleSelectContent(content.id)}
                        className="w-4 h-4"
                        aria-label={`Select ${content.title}`}
                      />
                      <label htmlFor={`select-content-${content.id}`} className="font-semibold text-primary">{content.title}</label>
                      <span className={`px-2 py-1 rounded text-xs ${
                        content.difficulty === 'easy' ? 'bg-neon-green/20 text-neon-green' :
                        content.difficulty === 'medium' ? 'bg-neon-orange/20 text-neon-orange' :
                        'bg-neon-red/20 text-neon-red'
                      }`}
                      style={{ minWidth: '60px', textAlign: 'center' }}>
                        {content.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getQualityColor(content.quality_score)} bg-current/20`}>
                        {getQualityLabel(content.quality_score)} ({content.quality_score.toFixed(0)}%)
                      </span>
                    </div>
                    
                    <p className="text-muted text-sm mb-2">{content.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {content.signal_tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-600/30 text-gray-300 dark:text-gray-300 light:text-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewContent(content)}
                    aria-label={`Preview ${content.title}`}
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewContent && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewContent(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 id="preview-title" className="text-xl font-bold text-primary">Content Preview</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setPreviewContent(null)}
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Title</label>
                  <p className="text-primary">{previewContent.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                  <p className="text-muted">{previewContent.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Content</label>
                  <pre className="bg-dark-200 p-3 rounded text-sm overflow-x-auto">
                    <code>{JSON.stringify(previewContent.content, null, 2)}</code>
                  </pre>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Correct Answer</label>
                  <pre className="bg-dark-200 p-3 rounded text-sm overflow-x-auto">
                    <code>{JSON.stringify(previewContent.correct_answer, null, 2)}</code>
                  </pre>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Quality Score</label>
                  <div className={`text-lg font-semibold ${getQualityColor(previewContent.quality_score)}`}>
                    {getQualityLabel(previewContent.quality_score)} ({previewContent.quality_score.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!generatedContent.length && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card variant="glass" className="bg-neon-purple/5 border-neon-purple/20">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-neon-purple" aria-hidden="true" />
              Tips for Optimal Results
            </h3>
            
            <div className="space-y-3 text-sm text-muted">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-neon-purple/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs text-neon-purple">1</span>
                </div>
                <p>Choose a specific challenge type and difficulty level for more focused results.</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-5 h-5 bg-neon-purple/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs text-neon-purple">2</span>
                </div>
                <p>Use the theme selector to generate content within a specific context.</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-5 h-5 bg-neon-purple/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs text-neon-purple">3</span>
                </div>
                <p>Add custom instructions for more targeted results (e.g., "Focus on workplace scenarios").</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-5 h-5 bg-neon-purple/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs text-neon-purple">4</span>
                </div>
                <p>Generated content receives a quality score. Items scoring 85%+ can be auto-approved.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AIContentGenerator;