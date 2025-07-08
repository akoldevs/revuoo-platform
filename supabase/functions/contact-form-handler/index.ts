// supabase/functions/contact-form-handler/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "akoldevs@gmail.com";

// --- THIS IS THE FIX ---
// Create a common CORS headers object to use in every response.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle the preflight CORS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, subject, message } = await req.json();

    if (!firstName || !lastName || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required." }), {
        status: 400,
        // Add CORS headers to the error response
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ADMIN_EMAIL,
      reply_to: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <p>You have a new contact form submission from Revuoo:</p>
        <ul>
          <li><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response(JSON.stringify({ message: "Message sent successfully!" }), {
      status: 200,
      // Add CORS headers to the success response
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to send message." }), {
      status: 500,
      // Add CORS headers to the final catch-all error response
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});