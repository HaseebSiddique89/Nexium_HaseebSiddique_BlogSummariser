'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  FileText, 
  Languages, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  ScrollText,
  History,
  Settings,
  Download,
  Share2,
  Bookmark,
  Clock,
  User,
  BarChart3,
  Filter,
  Search,
  ChevronDown,
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  Eye,
  BookOpen,
  Users,
  Heart,
  MessageCircle,
  Rss,
  X,
  Menu,
} from 'lucide-react';

export default function EnhancedBlogSummarizer() {
  const [url, setUrl] = useState('');
  const [blogText, setBlogText] = useState('');
  const [summary, setSummary] = useState('');
  const [urduSummary, setUrduSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  // Remove darkMode state
  // const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('summarize');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('urdu');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryStyle, setSummaryStyle] = useState('professional');

  const steps = [
    { label: 'Scraping blog content', icon: Globe },
    { label: 'Generating AI summary', icon: FileText },
    { label: 'Translating to target language', icon: Languages },
    { label: 'Saving to database', icon: CheckCircle }
  ];

  // State for live recent summaries
  const [recentSummaries, setRecentSummaries] = useState<Array<{ title?: string; url: string; created_at?: string }>>([]);
  const [recentSummariesLoading, setRecentSummariesLoading] = useState(true);
  const [recentSummariesError, setRecentSummariesError] = useState('');

  useEffect(() => {
    async function fetchRecentSummaries() {
      setRecentSummariesLoading(true);
      setRecentSummariesError('');
      try {
        const res = await fetch('/api/recent-summaries');
        const data = await res.json();
        if (data.success) {
          setRecentSummaries(data.summaries);
        } else {
          setRecentSummariesError('Failed to load recent summaries');
        }
      } catch (err) {
        setRecentSummariesError('Failed to load recent summaries');
      } finally {
        setRecentSummariesLoading(false);
      }
    }
    fetchRecentSummaries();
  }, []);

  // State for live popular blogs
  const [popularBlogs, setPopularBlogs] = useState<Array<{ title?: string; url?: string; category?: string; reads?: number }>>([]);
  const [popularBlogsLoading, setPopularBlogsLoading] = useState(true);
  const [popularBlogsError, setPopularBlogsError] = useState('');

  useEffect(() => {
    async function fetchPopularBlogs() {
      setPopularBlogsLoading(true);
      setPopularBlogsError('');
      try {
        const res = await fetch('/api/popular-blogs');
        const data = await res.json();
        if (data.success) {
          setPopularBlogs(data.blogs);
        } else {
          setPopularBlogsError('Failed to load popular blogs');
        }
      } catch (err) {
        setPopularBlogsError('Failed to load popular blogs');
      } finally {
        setPopularBlogsLoading(false);
      }
    }
    fetchPopularBlogs();
  }, []);

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Get summaries in seconds' },
    { icon: Shield, title: 'Secure & Private', description: 'Your data stays protected' },
    { icon: Languages, title: 'Multi-language', description: 'Support for 50+ languages' },
    { icon: Sparkles, title: 'AI Powered', description: 'Advanced GPT technology' }
  ];

  // State for live stats
  const [stats, setStats] = useState({
    totalSummaries: null,
    totalBlogs: null,
    totalUsers: null,
    uptime: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      setStatsError('');
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setStatsError('Failed to load stats');
        }
      } catch (err) {
        setStatsError('Failed to load stats');
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'urdu', name: 'Urdu', flag: '🇵🇰' },
  ];

  const handleSubmit = async () => {
    if (!url) return;

    setLoading(true);
    setError('');
    setCurrentStep(0);
    setBlogText('');
    setSummary('');
    setUrduSummary('');

    try {
      // 1. Scrape blog content
      setCurrentStep(1);
      const scrapeRes = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!scrapeRes.ok) throw new Error('Failed to scrape content');
      const scraped = await scrapeRes.json();
      setBlogText(scraped.content || '');

      // 2. Generate AI summary
      setCurrentStep(2);
      const summaryRes = await fetch('/api/summarise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: scraped.content }),
      });
      if (!summaryRes.ok) throw new Error('Failed to generate summary');
      const summaryData = await summaryRes.json();
      setSummary(summaryData.summary);

      // 3. Translate to Urdu
      setCurrentStep(3);
      const urduRes = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: summaryData.summary, targetLanguage: selectedLanguage }),
      });
      if (!urduRes.ok) throw new Error('Failed to translate summary');
      const urduData = await urduRes.json();
      setUrduSummary(urduData.translation);

      // 4. Save to databases
      setCurrentStep(4);
      await Promise.all([
        fetch('/api/save-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, summary: urduData.translation }),
        }),
        fetch('/api/save-fulltext', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, content: scraped.content }),
        })
      ]);

      setCurrentStep(5);
    } catch (err: unknown) { // Changed 'any' to 'unknown'
      if (err instanceof Error) { // Type guard to safely access 'message'
        setError(err.message);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      console.error('Failed to copy text');
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const NavigationMenu = () => (
    <nav className="hidden lg:flex items-center space-x-8">
      <button
        onClick={() => setActiveTab('summarize')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          activeTab === 'summarize' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Summarize
      </button>
      <button
        onClick={() => setActiveTab('history')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          activeTab === 'history' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <History className="w-4 h-4 inline mr-2" />
        History
      </button>
      <button
        onClick={() => setActiveTab('analytics')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          activeTab === 'analytics' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <BarChart3 className="w-4 h-4 inline mr-2" />
        Analytics
      </button>
      <button
        onClick={() => setActiveTab('settings')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          activeTab === 'settings' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Settings className="w-4 h-4 inline mr-2" />
        Settings
      </button>
    </nav>
  );

  const MobileSidebar = () => (
    <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
      <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Menu</h2>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => { setActiveTab('summarize'); setSidebarOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ScrollText className="w-5 h-5 inline mr-3" />
            Summarize
          </button>
          <button
            onClick={() => { setActiveTab('history'); setSidebarOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <History className="w-5 h-5 inline mr-3" />
            History
          </button>
          <button
            onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BarChart3 className="w-5 h-5 inline mr-3" />
            Analytics
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5 inline mr-3" />
            Settings
          </button>
        </nav>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-blue-50 via-white to-purple-50`}>
      <MobileSidebar />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <ScrollText className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BlogSummarizer
                </span>
              </div>
            </div>
            
            <NavigationMenu />
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-9 h-9 p-0"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {activeTab === 'summarize' && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI-Powered Blog
                </span>
                <br />
                <span className="text-gray-800">Summarization</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Transform lengthy articles into concise, actionable insights. Get multilingual summaries 
                powered by advanced AI technology in seconds.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {statsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="text-center animate-pulse">
                      <div className="flex justify-center mb-2">
                        <Loader2 className="w-6 h-6 text-blue-300" />
                      </div>
                      <div className="text-2xl font-bold text-gray-300">---</div>
                      <div className="text-sm text-gray-300">Loading...</div>
                    </div>
                  ))
                ) : statsError ? (
                  <div className="col-span-4 text-center text-red-600">{statsError}</div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalSummaries ?? '---'}</div>
                      <div className="text-sm text-gray-600">Blogs Summarized</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Languages className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">1+</div>
                      <div className="text-sm text-gray-600">Languages Supported</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalUsers ?? '---'}</div>
                      <div className="text-sm text-gray-600">Happy Users</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.uptime ?? '---'}</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Advanced Input Section */}
            <Card className="shadow-2xl border-0 bg-card rounded-2xl mb-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Smart Blog Analyzer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Paste your blog URL here (e.g., https://medium.com/article-title)"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-14 text-lg px-6 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                      disabled={loading}
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!url || !isValidUrl(url) || loading}
                    className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                </div>

                {/* Advanced Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Translation Language
                    </label>
                    <div className="relative">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Summary Length
                    </label>
                    <div className="relative">
                      <select
                        value={summaryLength}
                        onChange={(e) => setSummaryLength(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        <option value="short">Short (50-100 words)</option>
                        <option value="medium">Medium (100-200 words)</option>
                        <option value="long">Long (200-300 words)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Writing Style
                    </label>
                    <div className="relative">
                      <select
                        value={summaryStyle}
                        onChange={(e) => setSummaryStyle(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="academic">Academic</option>
                        <option value="creative">Creative</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Steps */}
            {loading && (
              <Card className="shadow-xl border-0 bg-card rounded-2xl mb-8">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                    Processing Your Blog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {steps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isActive = currentStep === index + 1;
                      const isCompleted = currentStep > index + 1;

                      return (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                            ${isCompleted
                              ? 'bg-green-500 text-white shadow-lg'
                              : isActive
                              ? 'bg-blue-500 text-white shadow-lg animate-pulse'
                              : 'bg-gray-200 text-gray-500'
                            }`}>
                            {isActive ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <StepIcon className="w-5 h-5" />
                            )}
                          </div>
                          <span className={`text-lg font-medium transition-colors
                            ${isCompleted
                              ? 'text-green-700'
                              : isActive
                              ? 'text-blue-700'
                              : 'text-gray-500'
                            }`}>
                            {step.label}
                          </span>
                          {isActive && (
                            <div className="flex-1 mx-4">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Results */}
            {(blogText || summary || urduSummary) && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Original Content */}
                  {blogText && (
                    <Card className="shadow-xl border-0 bg-card rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">Original Content</div>
                              <div className="text-sm text-gray-500">Extracted from source</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(blogText, 0)}
                              className="h-9 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                              {copiedIndex === 0 ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(url, '_blank')}
                              className="h-9 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={blogText}
                          readOnly
                          className="min-h-[300px] max-h-[500px] resize-none bg-gray-50 border-0 text-base leading-relaxed custom-scrollbar rounded-xl p-4"
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* AI Summary */}
                  {summary && (
                    <Card className="shadow-xl border-0 bg-card rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">AI Summary</div>
                              <div className="text-sm text-gray-500">English • {summaryLength} length</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(summary, 1)}
                              className="h-9 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                              {copiedIndex === 1 ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={summary}
                          readOnly
                          className="min-h-[300px] max-h-[500px] resize-none bg-blue-50 border-0 text-base leading-relaxed custom-scrollbar rounded-xl p-4"
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Translation */}
                {urduSummary && (
                  <Card className="shadow-xl border-0 bg-card rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Languages className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-lg font-semibold">Translated Summary</div>
                            <div className="text-sm text-gray-500">
                              🇵🇰 {languages.find(l => l.code === selectedLanguage)?.name} • {summaryStyle} style
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(urduSummary, 2)}
                            className="h-9 px-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                          >
                            {copiedIndex === 2 ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={urduSummary}
                        readOnly
                        className="min-h-[250px] max-h-[400px] resize-none bg-purple-50 border-0 text-base leading-relaxed text-right custom-scrollbar rounded-xl p-4"
                        dir="rtl"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Success Message */}
            {currentStep === 5 && (
              <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 text-green-800">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Processing Complete!</h3>
                      <p className="text-lg text-green-700 mt-1">
                        Your blog has been successfully analyzed, summarized, and translated.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-lg border-0 bg-card rounded-xl hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Summary History</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search summaries..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentSummariesLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <Card key={index} className="shadow-lg border-0 bg-card rounded-xl animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                      <div className="h-8 bg-gray-100 rounded w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : recentSummariesError ? (
                <div className="col-span-2 text-center text-red-600">{recentSummariesError}</div>
              ) : recentSummaries.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500">No recent summaries found.</div>
              ) : (
                recentSummaries.map((item, index) => (
                  <Card key={index} className="shadow-lg border-0 bg-card rounded-xl hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 flex-1">{item.title || item.url}</h3>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.url}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0 bg-card rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Summaries</p>
                      <p className="text-2xl font-bold text-gray-900">147</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-card rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Time Saved</p>
                      <p className="text-2xl font-bold text-gray-900">24.5h</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-card rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg. Reading Time</p>
                      <p className="text-2xl font-bold text-gray-900">2.3 min</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    -15% from last month
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-0 bg-card rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Popular Blog Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularBlogsLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div>
                          <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                          <div className="h-4 w-20 bg-gray-100 rounded" />
                        </div>
                        <div className="h-4 w-16 bg-gray-100 rounded" />
                      </div>
                    ))
                  ) : popularBlogsError ? (
                    <div className="text-center text-red-600">{popularBlogsError}</div>
                  ) : popularBlogs.length === 0 ? (
                    <div className="text-center text-gray-500">No popular blogs found.</div>
                  ) : (
                    popularBlogs.map((blog, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-800">{blog.title || blog.url}</h3>
                          <p className="text-sm text-gray-600">{blog.category || ''}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          {blog.reads !== undefined ? `${blog.reads} reads` : ''}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-card rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Default Language</h3>
                      <p className="text-sm text-gray-600">Enable dark theme</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {}}
                    >
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Default Language</h3>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>English</option>
                      <option>Urdu</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Auto-save Summaries</h3>
                    <Button variant="outline" size="sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Enabled
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ScrollText className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold">BlogSummarizer</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transform your reading experience with AI-powered summaries and translations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>AI Summarization</li>
                <li>Multi-language Support</li>
                <li>Smart Analytics</li>
                <li>Export Options</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Contact Us</li>
                <li>Status Page</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-gray-400 hover:text-white">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-gray-400 hover:text-white">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-gray-400 hover:text-white">
                  <Rss className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 BlogSummarizer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}