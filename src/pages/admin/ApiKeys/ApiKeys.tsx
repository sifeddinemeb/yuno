import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Copy, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Key,
  ExternalLink,
  CheckCircle,
  X,
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Card from '../../../components/ui/Card/Card';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import { apiKeyApi } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';

interface ApiKey {
  id: string;
  client_name: string;
  api_key: string;
  status: string;
  permissions: any;
  usage_metrics: any;
  created_at: string;
  last_used_at: string | null;
  created_by: string;
}

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const { adminUser } = useAuth();

  const [newApiKey, setNewApiKey] = useState({
    client_name: '',
    permissions: 'full-access'
  });

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiKeyApi.getAll();
      setApiKeys(data || []);
    } catch (err: any) {
      console.error('Error loading API keys:', err);
      setError(err.message || 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const filteredKeys = apiKeys.filter(key =>
    key.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.api_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateApiKey = async () => {
    if (!adminUser) {
      setError('You must be logged in to create API keys');
      return;
    }

    try {
      const apiKey = await apiKeyApi.create({
        client_name: newApiKey.client_name,
        permissions: { read: true, write: newApiKey.permissions === 'full-access' },
        usage_metrics: {},
        created_by: adminUser.id
      });
      
      setGeneratedKey(apiKey.api_key);
      await loadApiKeys();
      setNewApiKey({ client_name: '', permissions: 'full-access' });
    } catch (err: any) {
      console.error('Error creating API key:', err);
      setError(err.message || 'Failed to create API key');
    }
  };

  const handleUpdateApiKey = async (id: string, updates: Partial<ApiKey>) => {
    try {
      await apiKeyApi.update(id, updates);
      await loadApiKeys();
    } catch (err: any) {
      console.error('Error updating API key:', err);
      setError(err.message || 'Failed to update API key');
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;
    
    try {
      await apiKeyApi.delete(id);
      await loadApiKeys();
    } catch (err: any) {
      console.error('Error deleting API key:', err);
      setError(err.message || 'Failed to delete API key');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const maskApiKey = (key: string) => {
    const prefix = key.substring(0, 12);
    const suffix = key.substring(key.length - 4);
    return `${prefix}${'*'.repeat(key.length - 16)}${suffix}`;
  };

  const integrationCode = `<!-- HTML Integration -->
<script src="https://cdn.yuno.ai/widget.js"></script>
<div id="yuno-widget" data-api-key="YOUR_API_KEY"></div>

<!-- React Integration -->
import { YunoWidget } from '@yuno/react';

function App() {
  return (
    <YunoWidget 
      apiKey="YOUR_API_KEY"
      onVerified={(sessionId) => console.log('Verified:', sessionId)}
      onFailed={(sessionId) => console.log('Failed:', sessionId)}
    />
  );
}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-neon-blue" />
          <span className="text-lg">Loading API keys...</span>
        </div>
      </div>
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
            <h1 className="text-3xl font-bold mb-2">API Keys & Integrations</h1>
            <p className="text-muted">Manage your Yuno widget integrations and monitor usage</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="secondary" onClick={loadApiKeys}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Generate New API Key
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

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card variant="glass">
          <Input
            placeholder="Search API keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </Card>
      </motion.div>

      {/* API Keys List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card variant="glass">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Client Name</th>
                  <th className="text-left py-3 px-4">API Key</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-left py-3 px-4">Last Used</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="border-b border-gray-800 hover:bg-glass-light transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Key className="w-4 h-4 mr-2 text-neon-blue" />
                        <span className="font-semibold">{apiKey.client_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <code className="bg-dark-200 px-2 py-1 rounded text-sm font-mono">
                          {visibleKeys.has(apiKey.id) ? apiKey.api_key : maskApiKey(apiKey.api_key)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(apiKey.api_key, apiKey.id)}
                        >
                          {copiedKey === apiKey.id ? (
                            <CheckCircle className="w-4 h-4 text-neon-green" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        apiKey.status === 'active' 
                          ? 'bg-neon-green/20 text-neon-green' 
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {apiKey.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted">
                      {new Date(apiKey.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted">
                      {apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateApiKey(apiKey.id, { 
                            status: apiKey.status === 'active' ? 'inactive' : 'active' 
                          })}
                        >
                          {apiKey.status === 'active' ? 'Revoke' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredKeys.length === 0 && (
              <div className="text-center py-8 text-muted">
                {apiKeys.length === 0 ? 'No API keys created yet' : 'No API keys match your search'}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Integration Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card variant="glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Integration Instructions</h3>
            <Button variant="ghost">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Documentation
            </Button>
          </div>
          
          <div className="space-y-4">
            <p className="text-muted">
              Integrate the Yuno widget into your application using one of the methods below:
            </p>
            
            <div className="bg-dark-200 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{integrationCode}</code>
              </pre>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-neon-green rounded-full mr-2"></div>
                Replace YOUR_API_KEY with your actual API key
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-neon-blue rounded-full mr-2"></div>
                Widget loads in under 200ms
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-neon-purple rounded-full mr-2"></div>
                Fully customizable styling
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Create API Key Modal */}
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
              className="glass rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Generate New API Key</h2>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {generatedKey ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-neon-green mb-2">API Key Generated!</h3>
                    <p className="text-muted text-sm mb-4">
                      Copy your API key now. For security reasons, you won't be able to see it again.
                    </p>
                  </div>

                  <div className="bg-dark-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono break-all">{generatedKey}</code>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(generatedKey, 'generated')}
                      >
                        {copiedKey === 'generated' ? (
                          <CheckCircle className="w-4 h-4 text-neon-green" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setShowCreateModal(false);
                      setGeneratedKey(null);
                    }}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Client Name"
                    value={newApiKey.client_name}
                    onChange={(e) => setNewApiKey({ ...newApiKey, client_name: e.target.value })}
                    placeholder="e.g., Production Website"
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">Permissions</label>
                    <select
                      value={newApiKey.permissions}
                      onChange={(e) => setNewApiKey({ ...newApiKey, permissions: e.target.value })}
                      className="input-field"
                    >
                      <option value="full-access">Full Access</option>
                      <option value="read-only">Read Only</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateApiKey}
                      disabled={!newApiKey.client_name}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Generate API Key
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApiKeys;