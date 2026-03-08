import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  FileText, 
  Tag, 
  Monitor,
  GraduationCap,
  Briefcase,
  Globe,
  Search,
  Lightbulb,
  XCircle,
  Bold,
  Italic,
  List,
  Youtube,
  Shield,
  Wand2,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { generateBlogPost, getTopicIdeas, GeneratedPost } from '../services/gemini';
import confetti from 'canvas-confetti';

const FOCUS_AREAS = [
  { id: 'computer', label: 'Computer Basic', icon: Monitor },
  { id: 'pte', label: 'PTE', icon: GraduationCap },
  { id: 'seminar', label: 'Seminar', icon: Globe },
  { id: 'no-ads', label: 'No Ads', icon: Briefcase },
];

export default function BlogGenerator() {
  const [topic, setTopic] = useState('');
  const [focusArea, setFocusArea] = useState(FOCUS_AREAS[0].id);
  const [isDeepResearch, setIsDeepResearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [post, setPost] = useState<GeneratedPost | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPermalink, setEditedPermalink] = useState('');
  const [editedSearchDescription, setEditedSearchDescription] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedPostUrl, setPublishedPostUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  const handleGenerate = async (mode: 'new' | 'refine' = 'new') => {
    const contentToUse = mode === 'refine' ? editedContent : topic;
    if (!contentToUse.trim()) return;
    
    setLoading(true);
    setIsHtmlMode(false);
    abortControllerRef.current = new AbortController();

    try {
      const result = await generateBlogPost(contentToUse, focusArea, isDeepResearch);
      
      if (abortControllerRef.current.signal.aborted) return;

      setPost(result);
      setEditedContent(result.content);
      
      if (editorRef.current && !isHtmlMode) {
        editorRef.current.innerHTML = result.content;
      }
      setEditedTitle(result.metadata.title);
      setEditedPermalink(result.metadata.permalink);
      setEditedSearchDescription(result.metadata.searchDescription);
      setEditedLocation(result.metadata.location);
      setSelectedLabels(result.metadata.labels);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00a830', '#008c27', '#ffffff']
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error(error);
      alert('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetIdeas = async () => {
    setLoadingIdeas(true);
    try {
      const suggested = await getTopicIdeas(focusArea);
      setIdeas(suggested);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIdeas(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setEditedContent(editorRef.current.innerHTML);
    }
  };

  const insertYoutube = () => {
    if (!showYoutubeInput) {
      setShowYoutubeInput(true);
      return;
    }

    if (!youtubeUrl) {
      setShowYoutubeInput(false);
      return;
    }
    
    const videoIdMatch = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtu\.be\/)([^&?/\s]+)/);
    if (!videoIdMatch) {
      alert('সঠিক YouTube লিঙ্ক দিন।');
      return;
    }
    
    const videoId = videoIdMatch[1];
    const embedHtml = `
      <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 15px; background: #1a1a1a; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e1e4e8; margin-bottom: 30px;">
        <iframe 
          src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&showinfo=0&color=white&iv_load_policy=3" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      </div>
    `;
    
    if (editorRef.current) {
        editorRef.current.innerHTML += embedHtml;
        setEditedContent(editorRef.current.innerHTML);
    }
    setYoutubeUrl('');
    setShowYoutubeInput(false);
  };

  const handlePublishToBlogger = async () => {
    if (!editedContent) return;
    
    if (!showPinInput) {
      setShowPinInput(true);
      return;
    }

    if (pinInput !== '7858') {
      alert('ভুল পিন! দয়া করে সঠিক পিন দিন।');
      setPinInput('');
      return;
    }
    
    setIsPublishing(true);
    try {
      // Placeholder for actual publishing logic
      alert('Publishing to Blogger is not implemented in this demo.');
      setShowPinInput(false);
      setPinInput('');
    } catch (error) {
      console.error('Publish Error:', error);
      alert('An error occurred while publishing.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2 rounded-lg">
            <Monitor className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">Point IT Blog Studio</h1>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">Professional Content Creator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {loading && (
            <button 
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-all border border-red-100"
            >
              <XCircle size={16} /> Stop Processing
            </button>
          )}
          
          <div className="h-8 w-[1px] bg-gray-200 mx-2" />
          
          <button 
            onClick={handlePublishToBlogger}
            disabled={isPublishing || !editedContent}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark disabled:bg-gray-300 transition-all shadow-lg shadow-primary/20"
          >
            {isPublishing ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} />}
            {isPublishing ? 'Publishing...' : 'Publish to Blogger'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Generation Tools */}
        <motion.aside 
          initial={false}
          animate={{ width: leftSidebarOpen ? 320 : 0, opacity: leftSidebarOpen ? 1 : 0 }}
          className="bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar relative"
        >
          <div className="p-6 space-y-8 w-[320px]">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Wand2 size={14} /> Content Generation
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 block">Topic or Concept</label>
                  <button onClick={() => copyToClipboard(topic, 'topic')} className="text-gray-400 hover:text-primary transition-all">
                    {copied === 'topic' ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="যেমন: ২০২৬ সালে কেন কম্পিউটার শেখা জরুরি?"
                  className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm text-gray-800 bg-gray-50"
                />
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleGetIdeas}
                    disabled={loadingIdeas}
                    className="flex-1 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg flex items-center justify-center gap-2 transition-all border border-primary/10"
                  >
                    {loadingIdeas ? <RefreshCw size={14} className="animate-spin" /> : <Lightbulb size={14} />}
                    Get Ideas
                  </button>
                  <button
                    onClick={() => handleGenerate('new')}
                    disabled={loading || !topic.trim()}
                    className="flex-[2] py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark disabled:bg-gray-300 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                    Generate Post
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {ideas.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 pt-2"
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suggested Topics</p>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                      {ideas.map((idea, i) => (
                        <button
                          key={i}
                          onClick={() => setTopic(idea)}
                          className="w-full text-left p-2 text-[11px] text-gray-600 hover:bg-primary/5 hover:text-primary rounded-lg border border-transparent hover:border-primary/20 transition-all truncate"
                        >
                          {i + 1}. {idea}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <section className="space-y-4 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Settings size={14} /> Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2">Focus Area</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FOCUS_AREAS.map((area) => (
                      <button
                        key={area.id}
                        onClick={() => setFocusArea(area.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          focusArea === area.id
                            ? 'bg-primary/5 border-primary text-primary'
                            : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <area.icon size={18} className="mb-1" />
                        <span className="text-[10px] font-bold">{area.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Search size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Deep Research</span>
                  </div>
                  <button
                    onClick={() => setIsDeepResearch(!isDeepResearch)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      isDeepResearch ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isDeepResearch ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </motion.aside>

        {/* Center - Editor Area */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
          <button 
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 p-1 rounded-r-lg shadow-md text-gray-400 hover:text-primary transition-all"
          >
            {leftSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          
          <button 
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 p-1 rounded-l-lg shadow-md text-gray-400 hover:text-primary transition-all"
          >
            {rightSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 mr-2">
                <button 
                  onClick={() => setIsHtmlMode(false)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${!isHtmlMode ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Composed
                </button>
                <button 
                  onClick={() => setIsHtmlMode(true)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${isHtmlMode ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  HTML
                </button>
              </div>

              {!isHtmlMode && (
                <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                  <button onClick={() => execCommand('bold')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all" title="Bold"><Bold size={16} /></button>
                  <button onClick={() => execCommand('italic')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all" title="Italic"><Italic size={16} /></button>
                  <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all" title="Bullet List"><List size={16} /></button>
                  <button onClick={() => execCommand('formatBlock', 'h2')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all font-bold text-xs" title="Heading 2">H2</button>
                  <button onClick={() => execCommand('formatBlock', 'h3')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all font-bold text-xs" title="Heading 3">H3</button>
                  <button onClick={insertYoutube} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all" title="Insert YouTube"><Youtube size={16} /></button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white relative">
            <div className="max-w-4xl mx-auto p-8 md:p-12 min-h-full">
              {isHtmlMode ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-[800px] p-6 font-mono text-sm bg-gray-900 text-emerald-400 rounded-xl border-none focus:ring-0 resize-none shadow-inner"
                  spellCheck={false}
                />
              ) : (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => setEditedContent(e.currentTarget.innerHTML)}
                  className="prose prose-lg max-w-none focus:outline-none min-h-[800px] blog-content"
                  style={{ direction: 'ltr' }}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* YouTube Input Modal */}
      <AnimatePresence>
        {showYoutubeInput && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 w-full max-w-md">
              <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Youtube className="text-red-600" size={18} /> YouTube ভিডিও যোগ করুন
              </h4>
              <input 
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="ভিডিও লিঙ্ক দিন (যেমন: https://youtu.be/...)"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary text-sm mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={() => setShowYoutubeInput(false)} className="flex-1 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-all">বাতিল</button>
                <button onClick={insertYoutube} className="flex-1 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">যোগ করুন</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
