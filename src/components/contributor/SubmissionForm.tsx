// src/components/contributor/SubmissionForm.tsx
"use client";

import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { submitExpertReview } from "@/app/actions/contributorActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Client-side validation schema remains the same
const formSchema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must be at least 10 characters." }),
  summary: z
    .string()
    .min(50, { message: "Summary must be at least 50 characters." }),
  bodyContent: z
    .string()
    .min(100, { message: "The full review content is too short." }),
  ratingOverall: z.coerce
    .number()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot be more than 5."),
  ratingPros: z.string().min(3, { message: "Please list at least one pro." }),
  ratingCons: z.string().min(3, { message: "Please list at least one con." }),
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton({ isRevision }: { isRevision: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
        </>
      ) : isRevision ? (
        "Resubmit for Approval"
      ) : (
        "Submit for Approval"
      )}
    </Button>
  );
}

// ✅ UPDATED: The component now accepts optional props for handling revisions.
export function SubmissionForm({
  assignmentId,
  reviewId,
  initialData,
}: {
  assignmentId: number;
  reviewId?: string; // Optional: for revisions
  initialData?: Partial<FormValues>; // Optional: for pre-filling the form
}) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    // ✅ UPDATED: Use the initialData to set default values for the form.
    defaultValues: initialData || {
      title: "",
      summary: "",
      bodyContent: "",
      ratingOverall: 5,
      ratingPros: "",
      ratingCons: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("assignmentId", String(assignmentId));
    formData.append("title", values.title);
    formData.append("summary", values.summary);
    formData.append("bodyContent", values.bodyContent);
    formData.append("ratingOverall", String(values.ratingOverall));
    formData.append("ratingPros", values.ratingPros);
    formData.append("ratingCons", values.ratingCons);

    // ✅ UPDATED: If it's a revision, add the reviewId to the form data.
    if (reviewId) {
      formData.append("reviewId", reviewId);
    }

    const result = await submitExpertReview(null, formData);
    if (result?.error) {
      toast.error("Submission Failed", { description: result.error });
    }
    if (result?.success) {
      toast.success("Submission Successful!", {
        description: result.success,
      });
      router.push("/dashboard/contributor/content");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* All FormField components remain the same */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., An In-Depth Look at HubSpot CRM"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brief Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A one-paragraph summary of your findings..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bodyContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Review Content</FormLabel>
              <FormControl>
                <TiptapEditor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="ratingOverall"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Rating (1-5)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="5" step="0.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ratingPros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pros</FormLabel>
                <FormControl>
                  <Input placeholder="Easy to use, Great support" {...field} />
                </FormControl>
                <FormDescription>Comma-separated list.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ratingCons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cons</FormLabel>
                <FormControl>
                  <Input placeholder="Expensive, Limited features" {...field} />
                </FormControl>
                <FormDescription>Comma-separated list.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitButton isRevision={!!reviewId} />
      </form>
    </Form>
  );
}
