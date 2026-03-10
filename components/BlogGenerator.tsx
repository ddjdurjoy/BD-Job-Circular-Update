'use client';

import { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Search, Copy, Check, Loader2, FileText, Tag, Link as LinkIcon, MapPin, AlignLeft, Image as ImageIcon, Send, Facebook, MessageCircle, Code } from 'lucide-react';

export default function BlogGenerator() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    labels: '',
    permalink: '',
    location: '',
    searchDescription: '',
    thumbnailUrl: '',
    htmlContent: '',
    telegramPost: '',
    facebookPost: '',
    whatsappPost: ''
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');
    setMetadata({ 
      title: '', labels: '', permalink: '', location: '', searchDescription: '', 
      thumbnailUrl: '', htmlContent: '', telegramPost: '', facebookPost: '', whatsappPost: '' 
    });
    setCopiedField(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API Key is missing. Please check your environment variables.');
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
You are an expert SEO content writer, social media manager, and UI/UX designer for "BD Job Circular Update".
Search the web for the latest and most accurate job circular related to the keyword: "${keyword}".

TASK 1: BLOG POST HTML
Write a highly detailed, SEO-friendly blog post in Bengali (with English terms).
You MUST use the EXACT HTML template below. Do not change the class names or structure. Just fill in the bracketed information with real data from your search.
Search Google Images specifically for the official job circular image or a highly relevant high-quality image for this job. Use that direct image URL.
If you absolutely cannot find an official circular image URL, use this placeholder: "https://placehold.co/800x400/006a4e/ffffff?text=Job+Circular"

<style>
  .job-post-container { font-family: 'Inter', sans-serif; color: #333; line-height: 1.6; }
  .job-header { background: #006a4e; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
  .job-header h1 { margin: 0; font-size: 24px; }
  .job-summary-card { background: #f9f9f9; border-left: 4px solid #f42a41; padding: 15px; margin-bottom: 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  .job-summary-card table { width: 100%; border-collapse: collapse; }
  .job-summary-card th, .job-summary-card td { padding: 10px; border-bottom: 1px solid #eee; text-align: left; }
  .job-summary-card th { width: 40%; color: #006a4e; }
  .section-title { color: #006a4e; border-bottom: 2px solid #f42a41; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; font-size: 20px; }
  .apply-btn { display: inline-block; background: #f42a41; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; text-align: center; }
  .apply-btn:hover { background: #d92238; }
  .circular-image { text-align: center; margin: 30px 0; }
  .circular-image img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
</style>
<div class="job-post-container">
  <div class="job-header">
    <h1>[SEO Optimized Job Title]</h1>
  </div>
  <p>[Engaging Introduction Paragraph in Bengali]</p>
  
  <h2 class="section-title">Job Summary</h2>
  <div class="job-summary-card">
    <table>
      <tr><th>Organization</th><td>[Organization Name]</td></tr>
      <tr><th>Vacancy</th><td>[Number of Vacancies or 'Not specified']</td></tr>
      <tr><th>Salary</th><td>[Salary Range]</td></tr>
      <tr><th>Location</th><td>[Job Location]</td></tr>
      <tr><th>Published Date</th><td>[Published Date]</td></tr>
      <tr><th>Deadline</th><td>[Application Deadline]</td></tr>
    </table>
  </div>

  <h2 class="section-title">Official Circular</h2>
  <div class="circular-image">
    <img src="[Thumbnail URL]" alt="Job Circular" />
  </div>

  <h2 class="section-title">Job Description & Requirements</h2>
  <ul>
    <li>[Requirement 1]</li>
    <li>[Requirement 2]</li>
    <li>[Requirement 3]</li>
  </ul>

  <h2 class="section-title">How to Apply</h2>
  <p>[Step by step application process in Bengali]</p>
  
  <div style="text-align: center;">
    <a href="[Apply Link or '#']" class="apply-btn" target="_blank">Apply Now / Download Circular</a>
  </div>
</div>

TASK 2: SOCIAL MEDIA POSTS
Generate engaging, emoji-rich posts for Telegram, Facebook, and WhatsApp to promote this job. Keep them concise, highlight the deadline, and include a placeholder for the website link like "[Website Link]".
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "SEO optimized blog post title" },
              labels: { type: Type.STRING, description: "Comma-separated labels/tags for the post (e.g., Govt Job, Bank Job)" },
              permalink: { type: Type.STRING, description: "SEO friendly URL slug in English (e.g., bangladesh-bank-officer-circular-2026)" },
              location: { type: Type.STRING, description: "Job location (e.g., Bangladesh, Dhaka)" },
              searchDescription: { type: Type.STRING, description: "Short SEO meta description (max 150 characters)" },
              thumbnailUrl: { type: Type.STRING, description: "URL of the official job circular image. You MUST search Google Images for the actual circular or a highly relevant high-quality image. If absolutely not found, use https://placehold.co/800x400/006a4e/ffffff?text=Job+Circular" },
              htmlContent: { type: Type.STRING, description: "The full HTML content of the blog post using the exact provided template" },
              telegramPost: { type: Type.STRING, description: "Engaging Telegram channel post with emojis" },
              facebookPost: { type: Type.STRING, description: "Engaging Facebook page post with emojis and hashtags" },
              whatsappPost: { type: Type.STRING, description: "Short, urgent WhatsApp channel post with emojis" }
            },
            required: ["title", "labels", "permalink", "location", "searchDescription", "thumbnailUrl", "htmlContent", "telegramPost", "facebookPost", "whatsappPost"]
          }
        },
      });

      const jsonStr = response.text || '{}';
      const data = JSON.parse(jsonStr);

      setMetadata({
        title: data.title || '',
        labels: data.labels || '',
        permalink: data.permalink || '',
        location: data.location || '',
        searchDescription: data.searchDescription || '',
        thumbnailUrl: data.thumbnailUrl || '',
        htmlContent: data.htmlContent || '',
        telegramPost: data.telegramPost || '',
        facebookPost: data.facebookPost || '',
        whatsappPost: data.whatsappPost || ''
      });
    } catch (err: any) {
      console.error('Error generating post:', err);
      setError(err.message || 'Failed to generate the blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setMetadata(prev => {
      // Replace the old thumbnail URL in the HTML content with the new one
      const updatedHtml = prev.thumbnailUrl 
        ? prev.htmlContent.replace(prev.thumbnailUrl, newUrl)
        : prev.htmlContent;
      return { ...prev, thumbnailUrl: newUrl, htmlContent: updatedHtml };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setMetadata(prev => {
        const updatedHtml = prev.thumbnailUrl 
          ? prev.htmlContent.replace(prev.thumbnailUrl, base64String)
          : prev.htmlContent;
        return { ...prev, thumbnailUrl: base64String, htmlContent: updatedHtml };
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#006a4e] mb-2">AI Blog Post Generator</h1>
          <p className="text-gray-600">Enter a job keyword, and AI will search the web to write a full, detailed SEO article for your Blogger site.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., Bangladesh Bank Officer Circular 2026"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#006a4e] focus:border-[#006a4e] text-gray-900"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="px-8 py-3 bg-[#006a4e] text-white font-semibold rounded-lg hover:bg-[#00553e] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Generating...
                </>
              ) : (
                'Generate Post'
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {metadata.title && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Blogger Metadata & HTML */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-900">Blogger Post Details</h2>
                  <button onClick={() => handleCopy(metadata.htmlContent, 'html')} className="px-4 py-2 bg-[#006a4e] text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium hover:bg-[#00553e]">
                    {copiedField === 'html' ? <Check size={16} /> : <Code size={16} />}
                    {copiedField === 'html' ? 'HTML Copied!' : 'Copy Full HTML'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                {/* Title */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <FileText size={16} className="text-[#006a4e]" /> Post Title
                  </label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={metadata.title} className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800" />
                    <button onClick={() => handleCopy(metadata.title, 'title')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-gray-200">
                      {copiedField === 'title' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <Tag size={16} className="text-[#006a4e]" /> Labels
                  </label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={metadata.labels} className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800" />
                    <button onClick={() => handleCopy(metadata.labels, 'labels')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-gray-200">
                      {copiedField === 'labels' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Permalink */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <LinkIcon size={16} className="text-[#006a4e]" /> Custom Permalink
                  </label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={metadata.permalink} className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800" />
                    <button onClick={() => handleCopy(metadata.permalink, 'permalink')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-gray-200">
                      {copiedField === 'permalink' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin size={16} className="text-[#006a4e]" /> Location
                  </label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={metadata.location} className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800" />
                    <button onClick={() => handleCopy(metadata.location, 'location')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-gray-200">
                      {copiedField === 'location' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Search Description */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <AlignLeft size={16} className="text-[#006a4e]" /> Search Description
                  </label>
                  <div className="flex gap-2">
                    <textarea readOnly value={metadata.searchDescription} rows={2} className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 resize-none" />
                    <button onClick={() => handleCopy(metadata.searchDescription, 'searchDescription')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-gray-200 h-fit">
                      {copiedField === 'searchDescription' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon size={16} className="text-[#006a4e]" /> Thumbnail Image URL
                    </span>
                    <label className="cursor-pointer text-xs bg-[#006a4e] text-white px-2 py-1 rounded hover:bg-[#00553e] transition-colors">
                      Upload Image
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={metadata.thumbnailUrl} 
                      onChange={handleThumbnailChange}
                      placeholder="Paste image URL or upload..."
                      className="flex-grow p-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#006a4e] focus:border-transparent" 
                    />
                    <button onClick={() => handleCopy(metadata.thumbnailUrl, 'thumbnailUrl')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-gray-200">
                      {copiedField === 'thumbnailUrl' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                  {metadata.thumbnailUrl && (
                    <div className="mt-2">
                      <img src={metadata.thumbnailUrl} alt="Thumbnail Preview" className="h-24 object-contain rounded border border-gray-200 bg-gray-50 p-1" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Social Media Posts */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Social Media Posts</h2>
              
              <div className="space-y-6">
                {/* Telegram */}
                <div>
                  <label className="block text-sm font-semibold text-[#0088cc] mb-1 flex items-center gap-2">
                    <Send size={16} /> Telegram Channel
                  </label>
                  <div className="relative">
                    <textarea readOnly value={metadata.telegramPost} rows={5} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 resize-none pr-12" />
                    <button onClick={() => handleCopy(metadata.telegramPost, 'telegram')} className="absolute top-2 right-2 p-2 bg-white hover:bg-gray-100 text-gray-700 rounded-md transition-colors border border-gray-200 shadow-sm">
                      {copiedField === 'telegram' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Facebook */}
                <div>
                  <label className="block text-sm font-semibold text-[#1877F2] mb-1 flex items-center gap-2">
                    <Facebook size={16} /> Facebook Page
                  </label>
                  <div className="relative">
                    <textarea readOnly value={metadata.facebookPost} rows={5} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 resize-none pr-12" />
                    <button onClick={() => handleCopy(metadata.facebookPost, 'facebook')} className="absolute top-2 right-2 p-2 bg-white hover:bg-gray-100 text-gray-700 rounded-md transition-colors border border-gray-200 shadow-sm">
                      {copiedField === 'facebook' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-[#25D366] mb-1 flex items-center gap-2">
                    <MessageCircle size={16} /> WhatsApp Channel
                  </label>
                  <div className="relative">
                    <textarea readOnly value={metadata.whatsappPost} rows={5} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 resize-none pr-12" />
                    <button onClick={() => handleCopy(metadata.whatsappPost, 'whatsapp')} className="absolute top-2 right-2 p-2 bg-white hover:bg-gray-100 text-gray-700 rounded-md transition-colors border border-gray-200 shadow-sm">
                      {copiedField === 'whatsapp' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
