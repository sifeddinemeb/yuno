import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '../../../types';
import Button from '../../ui/Button/Button';

interface ChallengeRendererProps {
  challenge: Challenge;
  onComplete: (answer: any, responseTime: number) => void;
}

const ChallengeRenderer = ({ challenge, onComplete }: ChallengeRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MemeTimeWarp specific state
  const [memeOrder, setMemeOrder] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // EthicsPing specific state
  const [ethicsChoice, setEthicsChoice] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string>('');
  
  // PatternPlay specific state
  const [selectedPattern, setSelectedPattern] = useState<number[]>([]);
  const [patternAnswer, setPatternAnswer] = useState<number | null>(null);
  
  // PerceptionFlip specific state
  const [perceptionAnswer, setPerceptionAnswer] = useState<string | null>(null);
  
  // SocialDecoder specific state
  const [decodedMeaning, setDecodedMeaning] = useState<string | null>(null);

  // Reset state when challenge changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitting(false);
    setMemeOrder([]);
    setDraggedItem(null);
    setEthicsChoice(null);
    setReasoning('');
    setSelectedPattern([]);
    setPatternAnswer(null);
    setPerceptionAnswer(null);
    setDecodedMeaning(null);
  }, [challenge.id]);

  const handleSubmit = async () => {
    let answer = selectedAnswer;
    
    // Prepare answer based on challenge type
    if (challenge.type === 'MemeTimeWarp') {
      answer = memeOrder;
    } else if (challenge.type === 'EthicsPing') {
      answer = { choice: ethicsChoice, reasoning };
    } else if (challenge.type === 'PatternPlay') {
      answer = patternAnswer;
    } else if (challenge.type === 'PerceptionFlip') {
      answer = perceptionAnswer;
    } else if (challenge.type === 'SocialDecoder') {
      answer = decodedMeaning;
    }

    if (answer !== null && !isSubmitting) {
      setIsSubmitting(true);
      const responseTime = Date.now() - startTime;
      
      // Add small delay to prevent instant submissions (bot detection)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      onComplete(answer, responseTime);
    }
  };

  // MemeTimeWarp drag and drop handlers
  const handleDragStart = (e: React.DragEvent, memeId: string) => {
    setDraggedItem(memeId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', memeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    const draggedMemeId = e.dataTransfer.getData('text/plain');
    
    if (!draggedMemeId) return;

    if (targetIndex !== undefined) {
      // Dropping in timeline
      const newOrder = [...memeOrder];
      const existingIndex = newOrder.indexOf(draggedMemeId);
      
      if (existingIndex > -1) {
        newOrder.splice(existingIndex, 1);
      }
      
      newOrder.splice(targetIndex, 0, draggedMemeId);
      setMemeOrder(newOrder);
    }
    
    setDraggedItem(null);
  };

  const addMemeToTimeline = (memeId: string) => {
    if (!memeOrder.includes(memeId)) {
      setMemeOrder([...memeOrder, memeId]);
    }
  };

  const removeMemeFromTimeline = (memeId: string) => {
    setMemeOrder(memeOrder.filter(id => id !== memeId));
  };

  const renderChallengeContent = () => {
    switch (challenge.type) {
      case 'SentimentSpectrum':
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">{challenge.title}</h3>
            <p className="text-gray-300 text-center mb-6">{challenge.description}</p>
            
            <div className="bg-dark-200 rounded-lg p-4 mb-6">
              <p className="text-center text-lg italic">"{challenge.content.message}"</p>
            </div>
            
            <div className="space-y-3">
              {challenge.content.options.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                    selectedAnswer === option
                      ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue text-neon-blue'
                      : 'glass hover:bg-glass-light'
                  }`}
                  onClick={() => setSelectedAnswer(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  role="radio"
                  aria-checked={selectedAnswer === option}
                  aria-label={`Select sentiment option ${option}`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'MemeTimeWarp':
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">{challenge.title}</h3>
            <p className="text-gray-300 text-center mb-6">{challenge.description}</p>
            
            {/* Available Memes */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">Available Memes:</h4>
              <div className="grid grid-cols-2 gap-3">
                {challenge.content.memes?.map((meme: any) => {
                  const isInTimeline = memeOrder.includes(meme.id);
                  return (
                    <div
                      key={meme.id}
                      className={`p-3 glass rounded-lg cursor-move transition-all duration-300 ${
                        isInTimeline ? 'opacity-50 bg-gray-700' : 'hover:bg-glass-light'
                      } ${draggedItem === meme.id ? 'scale-105 border-2 border-neon-blue' : ''}`}
                      draggable={!isInTimeline}
                      onDragStart={(e) => handleDragStart(e, meme.id)}
                      onClick={() => !isInTimeline && addMemeToTimeline(meme.id)}
                    >
                      <div className="text-sm font-medium">{meme.name}</div>
                      <div className="text-xs text-muted">Year: {meme.year}</div>
                      {isInTimeline && (
                        <div className="text-xs text-neon-blue mt-1">
                          Position: {memeOrder.indexOf(meme.id) + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chronological Timeline */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">
                Chronological Timeline ({memeOrder.length}/{challenge.content.memes?.length || 0}):
              </h4>
              <div 
                className="min-h-[120px] border-2 border-dashed border-gray-600 rounded-lg p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
              >
                {memeOrder.length === 0 ? (
                  <div className="text-center text-muted py-8">
                    Drag memes here or click them to add to timeline
                  </div>
                ) : (
                  <div className="space-y-2">
                    {memeOrder.map((memeId, index) => {
                      const meme = challenge.content.memes?.find((m: any) => m.id === memeId);
                      return (
                        <div
                          key={memeId}
                          className="p-3 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/30 rounded-lg flex items-center justify-between"
                          onDragOver={handleDragOver}
                          onDrop={(e) => {
                            e.stopPropagation();
                            handleDrop(e, index);
                          }}
                        >
                          <div className="flex items-center">
                            <span className="text-neon-blue font-bold mr-3 text-lg">
                              #{index + 1}
                            </span>
                            <div>
                              <span className="font-medium">{meme?.name}</span>
                              <div className="text-xs text-muted">Year: {meme?.year}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeMemeFromTimeline(memeId)}
                            className="text-neon-red hover:text-red-400 transition-colors px-2 py-1"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-muted text-center">
              Arrange all {challenge.content.memes?.length || 0} memes from oldest to newest
            </div>
          </div>
        );

      case 'EthicsPing':
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">{challenge.title}</h3>
            <p className="text-gray-300 text-center mb-6">{challenge.description}</p>
            
            {/* Scenario */}
            <div className="bg-dark-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-3 text-neon-green">Ethical Scenario:</h4>
              <p className="text-gray-300 leading-relaxed">{challenge.content.scenario}</p>
            </div>

            {/* Choices */}
            <div className="space-y-3 mb-6">
              <h4 className="font-medium">What would you do?</h4>
              {challenge.content.choices?.map((choice: any, index: number) => (
                <motion.button
                  key={index}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                    ethicsChoice === choice.id
                      ? 'bg-gradient-to-r from-neon-green/20 to-emerald-500/20 border border-neon-green text-neon-green'
                      : 'glass hover:bg-glass-light'
                  }`}
                  onClick={() => setEthicsChoice(choice.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  <div className="font-medium mb-2">{choice.title}</div>
                  <div className="text-sm text-muted">{choice.description}</div>
                </motion.button>
              ))}
            </div>

            {/* Optional Reasoning */}
            {ethicsChoice && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Why did you choose this option? (Optional)
                </label>
                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Share your reasoning..."
                  className="w-full p-3 glass rounded-lg resize-none h-20 text-sm"
                  disabled={isSubmitting}
                />
                <div className="text-xs text-muted mt-1">
                  Your reasoning helps train AI to understand human ethical thinking
                </div>
              </div>
            )}
          </div>
        );

      case 'PatternPlay':
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">{challenge.title}</h3>
            <p className="text-gray-300 text-center mb-6">{challenge.description}</p>
            
            {/* Pattern Sequence Display */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">Pattern Sequence:</h4>
              <div className="flex justify-center mb-4">
                <div className="grid grid-cols-4 gap-2 max-w-xs">
                  {challenge.content.sequence?.map((item: number, index: number) => (
                    <div
                      key={index}
                      className={`h-16 w-16 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                        item === 1 ? 'bg-gradient-to-r from-neon-blue to-blue-600 text-white' :
                        item === 2 ? 'bg-gradient-to-r from-neon-purple to-violet-600 text-white' :
                        item === 3 ? 'bg-gradient-to-r from-neon-green to-emerald-600 text-white' :
                        item === 4 ? 'bg-gradient-to-r from-neon-orange to-orange-600 text-white' :
                        'bg-gray-600 text-gray-300 border-2 border-dashed border-gray-500'
                      }`}
                    >
                      {item || '?'}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pattern Options */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">What comes next?</h4>
              <div className="grid grid-cols-2 gap-3">
                {challenge.content.options?.map((option: number, index: number) => (
                  <motion.button
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      patternAnswer === option
                        ? 'border-neon-blue bg-neon-blue/20 text-neon-blue'
                        : 'border-gray-600 glass hover:bg-glass-light'
                    }`}
                    onClick={() => setPatternAnswer(option)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    <div className="flex justify-center">
                      <div
                        className={`h-12 w-12 rounded flex items-center justify-center text-lg font-bold ${
                          option === 1 ? 'bg-gradient-to-r from-neon-blue to-blue-600 text-white' :
                          option === 2 ? 'bg-gradient-to-r from-neon-purple to-violet-600 text-white' :
                          option === 3 ? 'bg-gradient-to-r from-neon-green to-emerald-600 text-white' :
                          option === 4 ? 'bg-gradient-to-r from-neon-orange to-orange-600 text-white' :
                          'bg-gray-500 text-white'
                        }`}
                      >
                        {option}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="text-sm text-muted text-center">
              Identify the pattern and select the correct next number
            </div>
          </div>
        );

      case 'PerceptionFlip':
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">{challenge.title}</h3>
            <p className="text-gray-300 text-center mb-6">{challenge.description}</p>
            
            {/* Optical Illusion */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-64 h-64 bg-dark-200 rounded-lg overflow-hidden border border-gray-600">
                {challenge.content.illusionType === 'perspective' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="200" height="200" className="text-white">
                      <defs>
                        <pattern id="checkerboard" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="10" height="10" fill="white"/>
                          <rect x="10" y="10" width="10" height="10" fill="white"/>
                          <rect x="10" y="0" width="10" height="10" fill="#2a2a2a"/>
                          <rect x="0" y="10" width="10" height="10" fill="#2a2a2a"/>
                        </pattern>
                      </defs>
                      <polygon points="100,50 150,150 50,150" fill="url(#checkerboard)" transform="perspective(100px)"/>
                    </svg>
                  </div>
                )}
                {challenge.content.illusionType === 'ambiguous' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl font-bold text-white transform">
                      {challenge.content.ambiguousText || '6 9'}
                    </div>
                  </div>
                )}
                {challenge.content.illusionType === 'color' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1 w-32 h-32">
                      <div className="bg-red-500 relative">
                        <div className="absolute inset-2 bg-gray-400"></div>
                      </div>
                      <div className="bg-green-500 relative">
                        <div className="absolute inset-2 bg-gray-400"></div>
                      </div>
                      <div className="bg-blue-500 relative">
                        <div className="absolute inset-2 bg-gray-400"></div>
                      </div>
                      <div className="bg-yellow-500 relative">
                        <div className="absolute inset-2 bg-gray-400"></div>
                      </div>
                    </div>
                  </div>
                )}
                {challenge.content.hint && (
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                    {challenge.content.hint}
                  </div>
                )}
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-center">What do you see?</h4>
              {challenge.content.options?.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                    perceptionAnswer === option
                      ? 'bg-gradient-to-r from-neon-purple/20 to-violet-500/20 border border-neon-purple text-neon-purple'
                      : 'glass hover:bg-glass-light'
                  }`}
                  onClick={() => setPerceptionAnswer(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'SocialDecoder':
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">{challenge.title}</h3>
            <p className="text-gray-300 text-center mb-6">{challenge.description}</p>
            
            {/* Social Context */}
            <div className="bg-dark-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-sm font-bold">
                  {challenge.content.author?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{challenge.content.author || 'User'}</span>
                    <span className="text-xs text-muted">{challenge.content.platform || 'Social Media'}</span>
                    {challenge.content.timestamp && (
                      <span className="text-xs text-muted">• {challenge.content.timestamp}</span>
                    )}
                  </div>
                  <p className="text-lg mb-2">{challenge.content.message}</p>
                  {challenge.content.emojis && (
                    <div className="text-2xl mb-2">{challenge.content.emojis}</div>
                  )}
                  {challenge.content.context && (
                    <p className="text-sm text-muted bg-gray-700/30 px-3 py-2 rounded mt-2">
                      <strong>Context:</strong> {challenge.content.context}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Interpretation Options */}
            <div className="space-y-3">
              <h4 className="font-medium">How would you interpret this message?</h4>
              {challenge.content.interpretations?.map((interpretation: string, index: number) => (
                <motion.button
                  key={index}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                    decodedMeaning === interpretation
                      ? 'bg-gradient-to-r from-neon-orange/20 to-yellow-500/20 border border-neon-orange text-neon-orange'
                      : 'glass hover:bg-glass-light'
                  }`}
                  onClick={() => setDecodedMeaning(interpretation)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {interpretation}
                </motion.button>
              ))}
            </div>

            <div className="mt-4 text-sm text-muted text-center">
              Consider tone, context, cultural nuances, and generational differences
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full text-center">
            <h3 className="text-lg font-semibold mb-4">{challenge.title}</h3>
            <p className="text-gray-300 mb-6">{challenge.description}</p>
            <div className="p-8 glass rounded-lg">
              <p className="text-gray-400 mb-4">🚧 Challenge Type: {challenge.type}</p>
              <p className="text-sm text-muted">
                This challenge type is coming soon in a future update.
              </p>
              <Button 
                onClick={() => setSelectedAnswer('skip')}
                className="mt-4"
                variant="secondary"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        );
    }
  };

  // Determine if submit button should be shown
  const canSubmit = () => {
    switch (challenge.type) {
      case 'SentimentSpectrum':
        return selectedAnswer !== null;
      case 'MemeTimeWarp':
        return memeOrder.length === challenge.content.memes?.length;
      case 'EthicsPing':
        return ethicsChoice !== null;
      case 'PatternPlay':
        return patternAnswer !== null;
      case 'PerceptionFlip':
        return perceptionAnswer !== null;
      case 'SocialDecoder':
        return decodedMeaning !== null;
      default:
        return selectedAnswer !== null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {renderChallengeContent()}
      
      {canSubmit() && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit() || isSubmitting}
            className="px-8"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Answer'
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default ChallengeRenderer;