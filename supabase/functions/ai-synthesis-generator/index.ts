// supabase/functions/ai-synthesis-generator/index.ts

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

console.log('AI Synthesis Generator function is up!');

// Initialize the Google AI Client with the API key from our secrets
const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 1. Get the business ID from the request body
    const { business_id } = await req.json();
    if (!business_id) {
      throw new Error('Missing business_id in the request body.');
    }

    // 2. Fetch all APPROVED reviews for that business
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('title, summary')
      .eq('business_id', business_id)
      .eq('status', 'approved');

    if (reviewsError) throw reviewsError;
    if (!reviews || reviews.length === 0) {
      return new Response(JSON.stringify({ message: 'No approved reviews found for this business.' }), { headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Combine all review text into a single block for the AI
    const allReviewsText = reviews.map(r => `Title: ${r.title}\nReview: ${r.summary}`).join('\n\n---\n\n');

    // 4. Prepare the prompt for Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are a helpful business analyst for a review website called Revuoo.
      Your task is to analyze a collection of customer reviews for a single business and synthesize them into a clear, structured summary.

      Here is the collection of reviews:
      ---
      ${allReviewsText}
      ---

      Based on all the reviews provided, perform the following analysis and provide your response as a single, minified JSON object with NO markdown formatting:
      1. "overall_sentiment": Classify the overall feeling from the reviews. Possible values are "Overwhelmingly Positive", "Mostly Positive", "Mixed", "Mostly Negative", "Overwhelmingly Negative".
      2. "common_themes_pros": Identify up to 3 common positive themes or keywords. Provide this as an array of strings. Example: ["Excellent Customer Service", "High Quality Work", "Punctual and Reliable"].
      3. "common_themes_cons": Identify up to 3 common negative themes or keywords. If none, provide an empty array. Example: ["Communication Issues", "Higher than expected price"].
      4. "generated_summary": Write a concise, neutral, one-paragraph summary (3-4 sentences) that synthesizes the key points from all reviews.
    `;
    
    // 5. Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiText = response.text();
    const aiAnalysis = JSON.parse(aiText); // We assume the model will follow instructions and return clean JSON this time

    // 6. Prepare data and save it to our synthesis table
    const synthesisData = {
      business_id: business_id,
      overall_sentiment: aiAnalysis.overall_sentiment,
      common_themes_pros: aiAnalysis.common_themes_pros,
      common_themes_cons: aiAnalysis.common_themes_cons,
      generated_summary: aiAnalysis.generated_summary,
      model_version: 'gemini-1.5-flash',
      last_updated_at: new Date().toISOString(),
    };

    // Use upsert: create a new row if one doesn't exist, or update it if it does.
    const { error: upsertError } = await supabase
      .from('business_ai_synthesis')
      .upsert(synthesisData, { onConflict: 'business_id' });

    if (upsertError) throw upsertError;

    console.log(`Successfully generated and saved synthesis for business ID: ${business_id}`);

    // 7. Return a success response
    return new Response(JSON.stringify({ success: true, synthesis: synthesisData }), { headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error in AI Synthesis Generator function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});