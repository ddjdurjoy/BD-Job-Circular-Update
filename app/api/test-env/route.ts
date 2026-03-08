import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ 
    nextPublic: process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'Set' : 'Not Set',
    geminiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Not Set',
    nextPublicVal: process.env.NEXT_PUBLIC_GEMINI_API_KEY?.substring(0, 10),
    geminiKeyVal: process.env.GEMINI_API_KEY?.substring(0, 10)
  });
}
