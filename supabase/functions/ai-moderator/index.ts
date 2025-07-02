// supabase/functions/ai-moderator/index.ts

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';


console.log('AI Moderator function with Gemini is up!');

const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    const { record: newReview } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are a content moderator for a business review website called Revuoo.
      Your task is to analyze the following review and determine if it is safe for the public.
      The review title is: "${newReview.title}"
      The review summary is: "${newReview.summary}"

      Analyze the text for the following:
      - Hate speech, profanity, or toxic language.
      - Personally identifiable information (PII) like full names of non-owners, phone numbers, or email addresses.
      - Spam or advertising.

      Based on your analysis, provide a JSON object with the following structure:
      {
        "is_safe": boolean,
        "reasoning": "string",
        "sentiment": "string",
        "suggested_summary": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    // --- THIS IS THE FIX ---
    // Clean the response: remove markdown backticks and the 'json' specifier.
    const cleanedText = aiText.replace(/```json\n?|```/g, '').trim();
    
    let aiAnalysis;
    try {
      // Parse the CLEANED text
      aiAnalysis = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse AI response JSON:", e);
      console.error("Original AI text was:", aiText); // Log the original text for debugging
      throw new Error("AI response was not valid JSON after cleaning.");
    }
    
    const analysisData = {
      review_id: newReview.id,
      safety_rating: aiAnalysis.is_safe ? 'SAFE' : 'FLAGGED',
      summary: aiAnalysis.suggested_summary,
      sentiment: aiAnalysis.sentiment,
      raw_response: aiAnalysis 
    };

    const { error: insertError } = await supabase
      .from('review_ai_analysis')
      .insert(analysisData);

    if (insertError) {
      throw new Error(`Database insert error: ${insertError.message}`);
    }

    console.log(`Successfully analyzed and saved results for review ID: ${newReview.id}`);

    return new Response(
      JSON.stringify({ success: true, analysis: analysisData }),
      { headers: { 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error('Error in AI Moderator function:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});