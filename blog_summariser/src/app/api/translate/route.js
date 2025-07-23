import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req) {
  try {
    let { text, targetLanguage } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not set.');
      return NextResponse.json({ success: false, error: 'Gemini API key not set.' });
    }

    // Trim whitespace and empty lines from start and end
    text = (text || '').replace(/^[\s\r\n]+|[\s\r\n]+$/g, '');
    if (!text) {
      return NextResponse.json({ success: false, error: 'No text provided for translation.' });
    }

    // Use the requested language, default to Urdu
    const language = targetLanguage || 'urdu';

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Translate the following text to ${language} and just provide the translation, no extra text: ${text}`;
    console.log('Prompt to Gemini:', prompt);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    console.log('Gemini SDK response:', response);

    // The SDK response may have a .text property or similar
    let translation = response.text || '';
    // Trim whitespace and empty lines from translation
    translation = translation.replace(/^[\s\r\n]+|[\s\r\n]+$/g, '');
    console.log('Extracted translation:', translation);

    return NextResponse.json({ success: true, translation });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
