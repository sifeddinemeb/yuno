import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Play,
  Pause,
  Sparkles,
  RefreshCw,
  X,
  Save,
  AlertCircle,
  BarChart3,
  FileText,
  Zap,
  Target,
  TrendingUp,
  Brain,
  Wand2,
  Copy
} from 'lucide-react';
import { Search as SearchIcon } from 'lucide-react';
import Card from '../../../components/ui/Card/Card';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
import SkeletonLoader from '../../../components/ui/SkeletonLoader/SkeletonLoader';
import { challengeApi } from '../../../lib/api';
import ChallengePreview from '../../../components/admin/ChallengePreview/ChallengePreview';
import AIContentGenerator from '../../../components/admin/AIContentGenerator/AIContentGenerator';
import { 
  generateMemeTimeWarpChallenge, 
  generateEthicsPingChallenge,
  generatePatternPlayChallenge,
  assessChallengeDifficulty
} from '../../../lib/challenge-content';
import { getChallengeAnalytics } from '../../../lib/analytics-tracking';
import { GeneratedContent } from '../../../lib/gemini-api';

interface Challenge {
  id: string;
  type: string;
  title: string;
  description: string;
  content: any;
  correct_answer: any;
  signal_tags: string[];
  input_mode: string;
  difficulty: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ChallengeAnalytics {
  challengeId: string;
  totalAttempts: number;
  successfulAttempts: number;
  averageResponseTime: number;
  difficultyRating: number;
  userSatisfaction: number;
  completionRate: number;
}

const Challenges = () => {
  // Sample data for demonstration
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "a1b2c3d4e5f6a7b8",
      type: "SentimentSpectrum",
      title: "Workplace Sarcasm Detection",
      description: "Identify the tone and sentiment in workplace communication",
      content: { message: "Oh great, another meeting that could have been an email 📧", options: ["Genuinely excited", "Sarcastic/frustrated", "Neutral", "Confused"] },
      correct_answer: "Sarcastic/frustrated",
      signal_tags: ["sarcasm", "workplace-culture"],
      input_mode: "multiple-choice",
      difficulty: "medium",
      is_active: true,
      created_at: "2025-01-01T12:00:00Z",
      updated_at: "2025-01-01T12:00:00Z"
    },
    {
      id: "b2c3d4e5f6a7b8c9",
      type: "MemeTimeWarp",
      title: "Internet Meme Chronology",
      description: "Arrange viral memes in chronological order of their popularity",
      content: { memes: [
        { id: "distracted_boyfriend", name: "Distracted Boyfriend", year: 2017 }, 
        { id: "woman_yelling_cat", name: "Woman Yelling at Cat", year: 2019 }, 
        { id: "drake_pointing", name: "Drake Pointing", year: 2015 }
      ]},
      correct_answer: ["drake_pointing", "distracted_boyfriend", "woman_yelling_cat"],
      signal_tags: ["chronology", "internet-culture"],
      input_mode: "drag-and-drop",
      difficulty: "hard",
      is_active: true,
      created_at: "2025-01-02T12:00:00Z",
      updated_at: "2025-01-02T12:00:00Z"
    },
    {
      id: "c3d4e5f6a7b8c9d0",
      type: "EthicsPing",
      title: "Privacy vs Security Dilemma",
      description: "Consider this ethical scenario about balancing privacy rights with security needs",
      content: {
        scenario: "A tech company can prevent a terrorist attack by scanning all user messages, but this would violate privacy promises made to millions of users.",
        choices: [
          { id: "scan_messages", title: "Scan the messages", description: "Prevent the attack by violating privacy temporarily" },
          { id: "respect_privacy", title: "Respect privacy", description: "Honor the privacy commitment regardless of consequences" },
          { id: "seek_warrant", title: "Seek legal authorization", description: "Work through legal channels even if it takes time" }
        ]
      },
      correct_answer: { acceptableChoices: ["scan_messages", "respect_privacy", "seek_warrant"] },
      signal_tags: ["ethics", "privacy", "security"],
      input_mode: "multiple-choice",
      difficulty: "medium",
      is_active: true,
      created_at: "2025-01-03T12:00:00Z",
      updated_at: "2025-01-03T12:00:00Z"
    },
    {
      id: "d4e5f6a7b8c9d0e1",
      type: "PatternPlay",
      title: "Sequence Recognition Challenge",
      description: "Identify the pattern and select the next number in the sequence",
      content: {
        sequence: [2, 4, 6, 8, null],
        options: [10, 12, 9, 8],
        rule: "Add 2 to each number",
        category: "arithmetic"
      },
      correct_answer: 10,
      signal_tags: ["pattern-recognition", "logic", "sequence"],
      input_mode: "multiple-choice",
      difficulty: "easy",
      is_active: true,
      created_at: "2025-01-04T12:00:00Z",
      updated_at: "2025-01-04T12:00:00Z"
    },
    {
      id: "e5f6a7b8c9d0e1f2",
      type: "PerceptionFlip",
      title: "Visual Perception Challenge",
      description: "This figure can be seen as two different numbers depending on orientation",
      content: {
        illusionType: "ambiguous",
        options: ["6", "9", "Both 6 and 9", "Neither"],
        hint: "Try rotating your perspective"
      },
      correct_answer: { acceptableAnswers: ["Both 6 and 9", "6 or 9"] },
      signal_tags: ["perception", "visual", "ambiguous"],
      input_mode: "multiple-choice",
      difficulty: "medium",
      is_active: false,
      created_at: "2025-01-05T12:00:00Z",
      updated_at: "2025-01-05T12:00:00Z"
    }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [previewingChallenge, setPreviewingChallenge] = useState<Challenge | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);
  const [challengeAnalytics, setChallengeAnalytics] = useState<Record<string, ChallengeAnalytics>>({
    "a1b2c3d4e5f6a7b8": {
      challengeId: "a1b2c3d4e5f6a7b8",
      totalAttempts: 324,
      successfulAttempts: 298,
      averageResponseTime: 7800,
      difficultyRating: 65,
      userSatisfaction: 92,
      completionRate: 92.0
    },
    "b2c3d4e5f6a7b8c9": {
      challengeId: "b2c3d4e5f6a7b8c9",
      totalAttempts: 256,
      successfulAttempts: 225,
      averageResponseTime: 12500,
      difficultyRating: 78,
      userSatisfaction: 88,
      completionRate: 87.9
    },
    "c3d4e5f6a7b8c9d0": {
      challengeId: "c3d4e5f6a7b8c9d0",
      totalAttempts: 289,
      successfulAttempts: 275,
      averageResponseTime: 9200,
      difficultyRating: 70,
      userSatisfaction: 94,
      completionRate: 95.2
    },
    "d4e5f6a7b8c9d0e1": {
      challengeId: "d4e5f6a7b8c9d0e1",
      totalAttempts: 312,
      successfulAttempts: 265,
      averageResponseTime: 6500,
      difficultyRating: 55,
      userSatisfaction: 90,
      completionRate: 84.9
    }
  });

  const [newChallenge, setNewChallenge] = useState({
    type: 'SentimentSpectrum',
    title: '',
    description: '',
    content: '{}',
    correct_answer: '',
    signal_tags: '',
    input_mode: 'multiple-choice',
    difficulty: 'medium',
    is_active: false,
  });

  const challengeTypes = [
    'SentimentSpectrum',
    'MemeTimeWarp',
    'EthicsPing',
    'PatternPlay',
    'PerceptionFlip',
    'SocialDecoder',
    'CreativeReasoning',
    'CulturalVibes',
    'VoiceCheck'
  ];

  const quickGenerateOptions = [
    { type: 'MemeTimeWarp', label: 'Meme Timeline', icon: Sparkles, description: 'Internet culture chronology' },
    { type: 'EthicsPing', label: 'Ethics Scenario', icon: FileText, description: 'Moral reasoning challenge' },
    { type: 'PatternPlay', label: 'Pattern Logic', icon: Target, description: 'Sequence recognition' },
    { type: 'SentimentSpectrum', label: 'Sentiment Analysis', icon: Zap, description: 'Tone detection challenge' }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would fetch data from the API
      // For now, we'll just simulate a delay and use our sample data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading challenges:', err);
      setError(err.message || 'Failed to load challenges');
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && challenge.is_active) ||
                         (statusFilter === 'draft' && !challenge.is_active);
    const matchesType = typeFilter === 'all' || challenge.type === typeFilter;
    const matchesDifficulty = difficultyFilter === 'all' || challenge.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesDifficulty;
  });

  const handleCreateChallenge = async () => {
    try {
      let content, correctAnswer;
      
      try {
        content = JSON.parse(newChallenge.content);
        correctAnswer = JSON.parse(newChallenge.correct_answer);
      } catch (e) {
        setError('Invalid JSON in content or correct answer fields');
        return;
      }

      // In a real implementation, this would create a challenge via API
      const newId = Math.random().toString(36).substring(2, 15);
      const challenge = {
        id: newId,
        type: newChallenge.type,
        title: newChallenge.title,
        description: newChallenge.description,
        content,
        correct_answer: correctAnswer,
        signal_tags: newChallenge.signal_tags.split(',').map(tag => tag.trim()).filter(Boolean),
        input_mode: newChallenge.input_mode,
        difficulty: newChallenge.difficulty,
        is_active: newChallenge.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setChallenges([...challenges, challenge]);
      setShowCreateModal(false);
      resetNewChallenge();
    } catch (err: any) {
      console.error('Error creating challenge:', err);
      setError(err.message || 'Failed to create challenge');
    }
  };

  const handleGenerateChallenge = async (type: string, difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      let generatedChallenge;
      
      switch (type) {
        case 'MemeTimeWarp':
          generatedChallenge = generateMemeTimeWarpChallenge(difficulty);
          break;
        case 'EthicsPing':
          generatedChallenge = generateEthicsPingChallenge(difficulty);
          break;
        case 'PatternPlay':
          generatedChallenge = generatePatternPlayChallenge(difficulty);
          break;
        default:
          throw new Error(`Challenge type ${type} not supported for generation`);
      }
      
      setNewChallenge({
        type: generatedChallenge.type,
        title: generatedChallenge.title,
        description: generatedChallenge.description,
        content: JSON.stringify(generatedChallenge.content, null, 2),
        correct_answer: JSON.stringify(generatedChallenge.correct_answer, null, 2),
        signal_tags: generatedChallenge.signal_tags.join(', '),
        input_mode: generatedChallenge.input_mode,
        difficulty: generatedChallenge.difficulty,
        is_active: false
      });
      
      setShowCreateModal(true);
    } catch (err: any) {
      console.error('Error generating challenge:', err);
      setError(err.message || 'Failed to generate challenge');
    }
  };

  const handleUpdateChallenge = async (id: string, updates: Partial<Challenge>) => {
    try {
      // In a real implementation, this would update a challenge via API
      setChallenges(challenges.map(challenge => 
        challenge.id === id ? { ...challenge, ...updates, updated_at: new Date().toISOString() } : challenge
      ));
    } catch (err: any) {
      console.error('Error updating challenge:', err);
      setError(err.message || 'Failed to update challenge');
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    
    try {
      // In a real implementation, this would delete a challenge via API
      setChallenges(challenges.filter(challenge => challenge.id !== id));
    } catch (err: any) {
      console.error('Error deleting challenge:', err);
      setError(err.message || 'Failed to delete challenge');
    }
  };

  const handleAIContentGenerated = (content: GeneratedContent[]) => {
    // In a real implementation, this would create challenges via API
    // For now, we'll just add them to our local state
    const newChallenges = content.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      content: item.content,
      correct_answer: item.correct_answer,
      signal_tags: item.signal_tags,
      input_mode: item.input_mode,
      difficulty: item.difficulty,
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    setChallenges([...challenges, ...newChallenges]);
    setShowAIGenerator(false);
  };

  const resetNewChallenge = () => {
    setNewChallenge({
      type: 'SentimentSpectrum',
      title: '',
      description: '',
      content: '{}',
      correct_answer: '',
      signal_tags: '',
      input_mode: 'multiple-choice',
      difficulty: 'medium',
      is_active: false,
    });
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (!confirm(`Are you sure you want to ${action} ${selectedChallenges.length} challenges?`)) return;

    try {
      if (action === 'delete') {
        setChallenges(challenges.filter(challenge => !selectedChallenges.includes(challenge.id)));
      } else {
        setChallenges(challenges.map(challenge => 
          selectedChallenges.includes(challenge.id) 
            ? { ...challenge, is_active: action === 'activate', updated_at: new Date().toISOString() } 
            : challenge
        ));
      }
      setSelectedChallenges([]);
    } catch (err: any) {
      console.error(`Error performing bulk ${action}:`, err);
      setError(err.message || `Failed to ${action} challenges`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-neon-green bg-neon-green/20';
      case 'medium': return 'text-neon-orange bg-neon-orange/20';
      case 'hard': return 'text-neon-red bg-neon-red/20';
      default: return 'text-gray-400 bg-gray-600/20';
    }
  };

  const getChallengeTypeColor = (type: string) => {
    const colors = {
      'SentimentSpectrum': 'text-neon-blue bg-neon-blue/20',
      'MemeTimeWarp': 'text-neon-purple bg-neon-purple/20',
      'EthicsPing': 'text-neon-green bg-neon-green/20',
      'PatternPlay': 'text-neon-orange bg-neon-orange/20',
      'PerceptionFlip': 'text-neon-pink bg-neon-pink/20',
      'SocialDecoder': 'text-blue-400 bg-blue-400/20',
      'CreativeReasoning': 'text-purple-400 bg-purple-400/20',
      'CulturalVibes': 'text-yellow-400 bg-yellow-400/20',
      'VoiceCheck': 'text-red-400 bg-red-400/20'
    };
    return colors[type as keyof typeof colors] || 'text-gray-400 bg-gray-400/20';
  };

  if (loading) {
    return (
      <Card variant="glass" className="p-8">
        <SkeletonLoader variant="text" className="w-2/3 h-8 mb-2" />
        <SkeletonLoader variant="text" className="w-1/2 h-4 mb-8" />
        
        <SkeletonLoader variant="rect" className="h-16 mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
        </div>
        
        <SkeletonLoader variant="rect" className="h-12 mb-6" />
        
        <div className="space-y-4">
          <SkeletonLoader variant="rect" className="h-20" />
          <SkeletonLoader variant="rect" className="h-20" />
          <SkeletonLoader variant="rect" className="h-20" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Challenge Management</h1>
            <p className="text-muted">Create, edit, and manage your cognitive micro-challenges</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="secondary" onClick={loadChallenges}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowAIGenerator(true)}
              className="bg-neon-purple/20 hover:bg-neon-purple/30 border-neon-purple/40 text-neon-purple"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Generator
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Challenge
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 bg-neon-red/20 border border-neon-red/30 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-neon-red" />
          <span className="text-neon-red text-sm">{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Quick Generate Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card variant="glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Generate Challenges</h3>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setShowAIGenerator(true)}
              className="bg-neon-purple/20 hover:bg-neon-purple/30 border-neon-purple/40 text-neon-purple"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              AI Generator
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickGenerateOptions.map((option) => (
              <div key={option.type} className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <option.icon className="w-4 h-4 text-neon-blue" />
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <p className="text-xs text-muted mb-3">{option.description}</p>
                <div className="flex gap-1">
                  {['easy', 'medium', 'hard'].map((difficulty) => (
                    <Button
                      key={difficulty}
                      size="sm"
                      variant="secondary"
                      onClick={() => handleGenerateChallenge(option.type, difficulty as 'easy' | 'medium' | 'hard')}
                      className="text-xs px-2 py-1"
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card variant="glass">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                id="challenge-search"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                startIcon={<SearchIcon className="w-4 h-4" />}
                aria-label="Search challenges"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              {challengeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          {selectedChallenges.length > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-muted">
                {selectedChallenges.length} selected
              </span>
              <Button size="sm" onClick={() => handleBulkAction('activate')}>
                <Play className="w-4 h-4 mr-1" />
                Activate
              </Button>
              <Button size="sm" onClick={() => handleBulkAction('deactivate')}>
                <Pause className="w-4 h-4 mr-1" />
                Deactivate
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Challenges List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card variant="glass">
          <div className="table-container overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">
                    <input
                      id="select-all-challenges"
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedChallenges(filteredChallenges.map(c => c.id));
                        } else {
                          setSelectedChallenges([]);
                        }
                      }}
                      checked={selectedChallenges.length === filteredChallenges.length && filteredChallenges.length > 0}
                      aria-label="Select all challenges"
                    />
                  </th>
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Difficulty</th>
                  <th className="text-left py-3 px-4">Performance</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallenges.map((challenge) => {
                  const analytics = challengeAnalytics[challenge.id];
                  return (
                    <tr key={challenge.id} className="border-b border-gray-800 hover:bg-glass-light transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedChallenges.includes(challenge.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChallenges([...selectedChallenges, challenge.id]);
                            } else {
                              setSelectedChallenges(selectedChallenges.filter(id => id !== challenge.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-semibold">{challenge.title}</div>
                          <div className="text-sm text-muted truncate max-w-xs">
                            {challenge.description}
                          </div>
                          {challenge.signal_tags && challenge.signal_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {challenge.signal_tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-1 py-0.5 bg-gray-600/30 text-gray-300 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                              {challenge.signal_tags.length > 3 && (
                                <span className="text-xs text-muted">+{challenge.signal_tags.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${getChallengeTypeColor(challenge.type)}`}>
                          {challenge.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          challenge.is_active 
                            ? 'bg-neon-green/20 text-neon-green' 
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {challenge.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {analytics ? (
                          <div className="text-sm">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-3 h-3 text-neon-green" />
                              <span>{analytics.completionRate.toFixed(1)}%</span>
                            </div>
                            <div className="text-xs text-muted">
                              {analytics.totalAttempts} attempts
                            </div>
                          </div>
                        ) : challenge.is_active ? (
                          <span className="text-xs text-muted">No data yet</span>
                        ) : (
                          <span className="text-xs text-muted">Not active</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted">
                        {new Date(challenge.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-start space-x-2">
                          <Button
                            aria-label={`Preview ${challenge.title}`}
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewingChallenge(challenge)}
                            title="Preview Challenge"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {analytics && (
                            <Button
                              aria-label={`View analytics for ${challenge.title}`}
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowAnalytics(challenge.id)}
                              title="View Analytics"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            aria-label={`Edit ${challenge.title}`}
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingChallenge(challenge)}
                            title="Edit Challenge"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            aria-label={challenge.is_active ? `Deactivate ${challenge.title}` : `Activate ${challenge.title}`}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateChallenge(challenge.id, { is_active: !challenge.is_active })}
                            title={challenge.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {challenge.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            aria-label={`Delete ${challenge.title}`}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteChallenge(challenge.id)}
                            title="Delete Challenge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredChallenges.length === 0 && (
              <div className="text-center py-12 text-muted">
                {challenges.length === 0 ? (
                  <div>
                    <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No challenges created yet</h3>
                    <p className="text-sm mb-4">Get started by creating your first challenge or using the quick generate options above.</p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Challenge
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Search className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p>No challenges match your current filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Create Challenge Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create New Challenge</h2>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Challenge Type</label>
                    <select
                      value={newChallenge.type}
                      onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value })}
                      className="input-field"
                    >
                      {challengeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={newChallenge.difficulty}
                      onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value })}
                      className="input-field"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Title"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  placeholder="Enter challenge title"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    placeholder="Describe what this challenge tests"
                    className="input-field min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content (JSON)</label>
                  <textarea
                    value={newChallenge.content}
                    onChange={(e) => setNewChallenge({ ...newChallenge, content: e.target.value })}
                    placeholder='{"message": "Example content", "options": ["Option 1", "Option 2"]}'
                    className="input-field min-h-[120px] font-mono text-sm resize-none"
                  />
                </div>

                <Input
                  label="Correct Answer (JSON)"
                  value={newChallenge.correct_answer}
                  onChange={(e) => setNewChallenge({ ...newChallenge, correct_answer: e.target.value })}
                  placeholder='"Option 1"'
                />

                <Input
                  label="Signal Tags (comma-separated)"
                  value={newChallenge.signal_tags}
                  onChange={(e) => setNewChallenge({ ...newChallenge, signal_tags: e.target.value })}
                  placeholder="sarcasm, workplace, tone"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newChallenge.is_active}
                    onChange={(e) => setNewChallenge({ ...newChallenge, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm">
                    Activate immediately
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateChallenge}
                  disabled={!newChallenge.title || !newChallenge.content}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Challenge
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Content Generator Modal */}
      <AnimatePresence>
        {showAIGenerator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-hidden"
            onClick={() => setShowAIGenerator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                role="dialog" 
                aria-label="Content generation settings"
                className="glass rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden border-2 border-neon-purple/30"
              >
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-12px)]">
                  <AIContentGenerator
                    onContentGenerated={handleAIContentGenerated}
                    onClose={() => setShowAIGenerator(false)}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <ChallengePreview
        challenge={previewingChallenge}
        onClose={() => setPreviewingChallenge(null)}
        onComplete={(answer, responseTime) => {
          console.log('Preview completed:', { answer, responseTime });
        }}
      />
    </div>
  );
};

export default Challenges;