// src/components/dashboard/AvatarUpload.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

export default function AvatarUpload({
  currentAvatar,
  userId,
}: {
  currentAvatar: string | null;
  userId: string;
}) {
  const [preview, setPreview] = useState(currentAvatar || "");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const blob = file.slice(0, file.size, file.type);

    const supabase = (await import("@/lib/supabase/client")).createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      toast.error("You must be signed in to upload an avatar.", {
        position: "top-right",
      });
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      return;
    }

    console.log("Uploading:", fileName, "Blob:", blob.type, blob.size);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, blob, {
        contentType: blob.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError);
      toast.error("Upload failed. Check file format, size, and policy.", {
        position: "top-right",
      });
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      return;
    }

    const publicUrl = supabase.storage.from("avatars").getPublicUrl(fileName)
      .data?.publicUrl;

    if (!publicUrl) {
      console.error("Failed to get public URL.");
      toast.error("Could not retrieve avatar URL.", {
        position: "top-right",
      });
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      return;
    }

    const newAvatarUrl = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: newAvatarUrl,
        contributor_badge: "starter", // 👑 new badge logic
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Profile update failed:", updateError);
      toast.error("Could not save avatar to profile.", {
        position: "top-right",
      });
      URL.revokeObjectURL(localPreview);
    } else {
      toast.success("Avatar updated!", {
        position: "top-right",
        style: { marginTop: "80px" },
      });

      setTimeout(() => {
        toast.message("✨ Contributor badge unlocked!", {
          position: "top-right",
          style: { marginTop: "120px" },
        });
      }, 1200);

      setPreview(newAvatarUrl);
    }

    URL.revokeObjectURL(localPreview);
    setUploading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {preview ? (
          <Image
            src={preview}
            alt="Your Avatar"
            width={80}
            height={80}
            className="rounded-full border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
            ?
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="avatar-upload"
          className="block text-sm font-medium text-gray-700"
        >
          Upload New Avatar
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mt-2"
        />
        {uploading && (
          <p className="text-sm text-blue-500 mt-1 animate-pulse">
            Uploading… Please hold tight 🍼
          </p>
        )}
      </div>
    </div>
  );
}
