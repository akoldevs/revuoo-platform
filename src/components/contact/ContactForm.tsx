"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

const FUNCTION_URL =
  "https://mhumpgmhvamsizrrsopq.supabase.co/functions/v1/contact-form-handler";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const data = {
      firstName: formData.get("first-name"),
      lastName: formData.get("last-name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server responded with an error:", errorData);
        throw new Error("Failed to send message");
      }

      setStatus("success");
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className="text-center p-8 rounded-md bg-green-50 text-green-800 border border-green-200"
        role="status"
        aria-live="polite"
      >
        <CheckCircle className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-2xl font-semibold">Message Sent!</h3>
        <p className="mt-2 text-base">
          Thank you for reaching out. We&apos;ll get back to you as soon as
          possible.
        </p>
        <Button onClick={() => setStatus("idle")} className="mt-6">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
      aria-labelledby="contact-form-heading"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name">First name</Label>
          <Input
            type="text"
            name="first-name"
            id="first-name"
            required
            disabled={status === "submitting"}
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            type="text"
            name="last-name"
            id="last-name"
            required
            disabled={status === "submitting"}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          disabled={status === "submitting"}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          type="text"
          name="subject"
          id="subject"
          required
          disabled={status === "submitting"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          name="message"
          id="message"
          rows={4}
          required
          disabled={status === "submitting"}
        />
      </div>

      {/* Submit Button & Status Messages */}
      <div className="mt-10">
        <Button
          type="submit"
          className="w-full"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send message"
          )}
        </Button>

        {status === "error" && (
          <div
            className="mt-4 text-center p-3 rounded-md bg-red-100 text-red-800 flex items-center justify-center gap-2 border border-red-200"
            role="alert"
          >
            <AlertTriangle className="h-5 w-5" />
            <p>Something went wrong. Please try again.</p>
          </div>
        )}
      </div>
    </form>
  );
}
