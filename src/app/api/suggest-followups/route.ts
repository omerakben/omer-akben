import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// Allow up to 10 seconds for generation
export const maxDuration = 10;

const SYSTEM_PROMPT = `You are a follow-up question generator for a portfolio assistant conversation.

Your task: Generate exactly 2 follow-up questions that:
1. Are highly relevant to the conversation context
2. Encourage deeper exploration of topics mentioned
3. Sound natural and conversational
4. Are specific, not generic
5. Focus on Omer's skills, experience, projects, or expertise

Guidelines:
- Each question should be 10-15 words max
- Avoid questions already shown recently
- Prioritize questions about technical details, project outcomes, or specific experiences
- Use "you/your" language (e.g., "What challenges did you face..." not "What challenges were faced...")

Return ONLY a JSON array of 2 strings, nothing else.
Example: ["What was the biggest technical challenge?", "How did you measure success?"]`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userMessage, assistantMessage, recentlyShown = [] } = body;

    // Validate input
    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'userMessage is required and must be a string' },
        { status: 400 }
      );
    }

    if (!assistantMessage || typeof assistantMessage !== 'string') {
      return NextResponse.json(
        { error: 'assistantMessage is required and must be a string' },
        { status: 400 }
      );
    }

    if (!Array.isArray(recentlyShown)) {
      return NextResponse.json(
        { error: 'recentlyShown must be an array' },
        { status: 400 }
      );
    }

    // Construct prompt
    const prompt = `User asked: "${userMessage}"

Assistant replied: "${assistantMessage}"

${recentlyShown.length > 0 ? `Recently shown questions (avoid these):\n${recentlyShown.map(q => `- ${q}`).join('\n')}` : ''}

Generate 2 follow-up questions as a JSON array:`;

    // Generate follow-up questions using AI
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt,
      temperature: 0.8, // Higher temperature for more creative questions
    });

    // Parse response
    let suggestions: string[];
    try {
      const parsed = JSON.parse(result.text.trim());
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }
      suggestions = parsed.slice(0, 2); // Ensure exactly 2 questions
    } catch {
      console.error('[SuggestFollowups] Failed to parse AI response:', result.text);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Validate suggestions
    if (suggestions.length !== 2) {
      console.error('[SuggestFollowups] AI returned wrong number of suggestions:', suggestions.length);
      return NextResponse.json(
        { error: 'AI returned invalid number of suggestions' },
        { status: 500 }
      );
    }

    // Ensure all suggestions are strings
    if (!suggestions.every(s => typeof s === 'string' && s.length > 0)) {
      console.error('[SuggestFollowups] AI returned invalid suggestion format');
      return NextResponse.json(
        { error: 'AI returned invalid suggestion format' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      suggestions,
    });
  } catch (error) {
    console.error('[SuggestFollowups] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
