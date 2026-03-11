'use client';

import { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Search, Copy, Check, Loader2, FileText, Tag, Link as LinkIcon, MapPin, AlignLeft, Image as ImageIcon, Send, Facebook, MessageCircle, Code, UploadCloud } from 'lucide-react';

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
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [bloggerToken, setBloggerToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('blogger_access_token');
    if (token) setBloggerToken(token);
  }, []);

  const handlePublish = async () => {
    let tokenToUse = bloggerToken;
    if (!tokenToUse) {
      const token = prompt('Please enter your Blogger Access Token (from Google OAuth Playground):');
      if (!token) return;
      localStorage.setItem('blogger_access_token', token);
      setBloggerToken(token);
      tokenToUse = token;
    }

    if (!metadata.title || !metadata.htmlContent) {
      alert('Please generate a post first before publishing.');
      return;
    }

    setIsPublishing(true);
    try {
      // The Blog ID from lib/blogger.ts
      const BLOG_ID = '581318446510932811';
      
      const payload: any = {
        kind: 'blogger#post',
        blog: { id: BLOG_ID },
        title: metadata.title,
        content: metadata.htmlContent,
      };
      
      const labels = metadata.labels ? metadata.labels.split(',').map(l => l.trim()).filter(Boolean) : [];
      if (labels.length > 0) {
        payload.labels = labels;
      }

      const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenToUse}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('blogger_access_token');
          setBloggerToken('');
          throw new Error('Token expired or invalid. Please provide a new token.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to publish to Blogger');
      }
      
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

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

TASK 1: BLOG POST DATA
Extract the following information to create a highly detailed, SEO-friendly blog post in Bengali (with English terms).
Search Google Images specifically for the official job circular image or a highly relevant high-quality image for this job. Use that direct image URL.
If you absolutely cannot find an official circular image URL, use this placeholder: "https://placehold.co/800x400/006a4e/ffffff?text=Job+Circular"

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
              
              introParagraph: { type: Type.STRING, description: "Engaging Introduction Paragraph in Bengali" },
              organization: { type: Type.STRING, description: "Organization Name" },
              vacancy: { type: Type.STRING, description: "Number of Vacancies or 'Not specified'" },
              salary: { type: Type.STRING, description: "Salary Range" },
              publishedDate: { type: Type.STRING, description: "Published Date" },
              deadline: { type: Type.STRING, description: "Application Deadline" },
              requirements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of Job Description & Requirements" },
              howToApply: { type: Type.STRING, description: "Step by step application process in Bengali, formatted as an HTML <ol> list with <li> items" },
              applyLink: { type: Type.STRING, description: "Apply Link or '#'" },

              telegramPost: { type: Type.STRING, description: "Engaging Telegram channel post with emojis" },
              facebookPost: { type: Type.STRING, description: "Engaging Facebook page post with emojis and hashtags" },
              whatsappPost: { type: Type.STRING, description: "Short, urgent WhatsApp channel post with emojis" }
            },
            required: ["title", "labels", "permalink", "location", "searchDescription", "thumbnailUrl", "introParagraph", "organization", "vacancy", "salary", "publishedDate", "deadline", "requirements", "howToApply", "applyLink", "telegramPost", "facebookPost", "whatsappPost"]
          }
        },
      });

      const jsonStr = response.text || '{}';
      const data = JSON.parse(jsonStr);

      const generatedHtmlContent = `
<style>
:root{--primary-color:#006a4e;--accent-color:#f42a41;--text-color:#333;--bg-light:#f8f9fa}
body{font-family:'SolaimanLipi',Arial,sans-serif;color:var(--text-color);line-height:1.6;margin:0;padding:0;}
.post-container{max-width:100%;margin:0 auto;padding:15px;background:#fff;box-sizing:border-box;}
h1.post-title{color:var(--primary-color);font-size:24px;text-align:center;border-bottom:3px solid var(--accent-color);padding-bottom:10px;margin-bottom:20px;line-height:1.4;}
h2.section-title{color:var(--primary-color);font-size:20px;border-left:4px solid var(--accent-color);padding-left:10px;margin-top:25px;margin-bottom:15px;background:var(--bg-light);padding:8px 10px;border-radius:0 5px 5px 0;}
.intro-text{font-size:16px;margin-bottom:20px;text-align:justify;}
.job-summary-card{background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,.05);overflow:hidden;margin-bottom:30px;}
.job-summary-header{background:var(--primary-color);color:#fff;padding:12px;text-align:center;font-size:18px;font-weight:bold;}
.table-responsive{overflow-x:auto;}
.job-summary-table{width:100%;border-collapse:collapse;min-width:300px;}
.job-summary-table th,.job-summary-table td{padding:10px 12px;border-bottom:1px solid #eee;text-align:left;font-size:15px;}
.job-summary-table th{background-color:var(--bg-light);width:40%;color:var(--primary-color);}
.job-summary-table tr:last-child th,.job-summary-table tr:last-child td{border-bottom:none;}
.job-summary-table tr:nth-child(even) td{background-color:#fafafa;}
.circular-image{text-align:center;margin:25px 0;}
.circular-image img{max-width:100%;height:auto;box-shadow:0 4px 8px rgba(0,0,0,.1);border-radius:8px;border:2px solid var(--primary-color);}
.requirements-list{list-style-type:none;padding:0;}
.requirements-list li{position:relative;padding-left:25px;margin-bottom:10px;font-size:15px;}
.requirements-list li::before{content:'✓';position:absolute;left:0;top:0;color:var(--accent-color);font-weight:bold;font-size:16px;}
.apply-steps{background:var(--bg-light);padding:15px;border-radius:8px;border-left:4px solid var(--primary-color);font-size:15px;}
.apply-steps ol{margin:0;padding-left:20px;}
.apply-steps li{margin-bottom:8px;}
@media (max-width: 480px) {
  h1.post-title{font-size:20px;}
  h2.section-title{font-size:18px;}
  .job-summary-table th,.job-summary-table td{padding:8px;font-size:14px;}
  .job-summary-table th{width:45%;}
}
</style>
<div class='post-container'>
  <h1 class='post-title'>${data.title || ''}</h1>
  <p class='intro-text'>${data.introParagraph || ''}</p>
  
  <h2 class='section-title'>এক নজরে নিয়োগ বিজ্ঞপ্তি (Job Summary)</h2>
  <div class='job-summary-card'>
    <div class='job-summary-header'>${data.title || 'Job Circular'}</div>
    <div class='table-responsive'>
      <table class='job-summary-table'>
        <tbody>
          <tr><th>প্রতিষ্ঠানের নাম</th><td>${data.organization || ''}</td></tr>
          <tr><th>পদের নাম</th><td>${data.vacancy || ''}</td></tr>
          <tr><th>শিক্ষাগত যোগ্যতা</th><td>${data.requirements?.[0] || ''}</td></tr>
          <tr><th>বেতন</th><td>${data.salary || ''}</td></tr>
          <tr><th>আবেদন শুরুর তারিখ</th><td>${data.publishedDate || ''}</td></tr>
          <tr><th>আবেদনের শেষ তারিখ</th><td>${data.deadline || ''}</td></tr>
          <tr><th>অফিসিয়াল ওয়েবসাইট</th><td>${data.applyLink || ''}</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <h2 class='section-title'>শিক্ষাগত যোগ্যতা ও অন্যান্য শর্তাবলী (Requirements)</h2>
  <ul class='requirements-list'>
    ${(data.requirements || []).map((req: string) => `<li>${req}</li>`).join('\n    ')}
  </ul>

  <h2 class='section-title'>অফিসিয়াল নোটিশ (Official Circular Image)</h2>
  <p class='intro-text'>নিচে সাম্প্রতিক নিয়োগ বিজ্ঞপ্তির অফিসিয়াল ছবি দেওয়া হলো। বিস্তারিত তথ্যের জন্য নোটিশটি ভালোভাবে পড়ে নিন:</p>
  <div class='circular-image'>
    <img src='${data.thumbnailUrl || 'https://placehold.co/800x400/006a4e/ffffff?text=Job+Circular'}' alt='${data.title || 'Job Circular'} Official Notice'>
  </div>

  <h2 class='section-title'>কিভাবে আবেদন করবেন? (How to Apply)</h2>
  <div class='apply-steps'>
    ${data.howToApply || ''}
  </div>
</div>
`;

      setMetadata({
        title: data.title || '',
        labels: data.labels || '',
        permalink: data.permalink || '',
        location: data.location || '',
        searchDescription: data.searchDescription || '',
        thumbnailUrl: data.thumbnailUrl || '',
        htmlContent: generatedHtmlContent,
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
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePublish} 
                      disabled={isPublishing || publishSuccess}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-white ${publishSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-70`}
                    >
                      {isPublishing ? <Loader2 size={16} className="animate-spin" /> : publishSuccess ? <Check size={16} /> : <UploadCloud size={16} />}
                      {isPublishing ? 'Publishing...' : publishSuccess ? 'Published!' : 'Publish to Blog'}
                    </button>
                    <button onClick={() => handleCopy(metadata.htmlContent, 'html')} className="px-4 py-2 bg-[#006a4e] text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium hover:bg-[#00553e]">
                      {copiedField === 'html' ? <Check size={16} /> : <Code size={16} />}
                      {copiedField === 'html' ? 'HTML Copied!' : 'Copy Full HTML'}
                    </button>
                  </div>
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
