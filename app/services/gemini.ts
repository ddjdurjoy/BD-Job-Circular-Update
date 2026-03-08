import { GoogleGenAI, Type } from '@google/genai';

export interface GeneratedPost {
  content: string;
  metadata: {
    title: string;
    permalink: string;
    searchDescription: string;
    location: string;
    labels: string[];
  };
}

export async function generateBlogPost(topic: string, focusArea: string, isDeepResearch: boolean): Promise<GeneratedPost> {
  // 1. Fetch raw text from backend
  const res = await fetch('/api/generate-job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: topic }), // Assuming topic is the URL here
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to fetch job data');

  // 2. Call Gemini
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a professional blog post based on the following topic and context.
    Topic: ${topic}
    Focus Area: ${focusArea}
    Deep Research: ${isDeepResearch ? 'Yes' : 'No'}
    
    Context:
    ${result.text.slice(0, 8000)}
    
    Return the output in JSON format with the following structure:
    {
      "content": "HTML content of the blog post, including h2, h3, p, ul, li tags",
      "metadata": {
        "title": "Catchy title",
        "permalink": "url-friendly-permalink",
        "searchDescription": "Short description for SEO",
        "location": "Location",
        "labels": ["label1", "label2"]
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function getTopicIdeas(focusArea: string): Promise<string[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate 5 blog post topic ideas for focus area: ${focusArea}. Return as a JSON array of strings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  return JSON.parse(response.text || '[]');
}
