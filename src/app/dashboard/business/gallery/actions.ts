// src/app/dashboard/business/gallery/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated.");

  const businessId = formData.get('businessId') as string;
  const file = formData.get('photo') as File;
  const caption = formData.get('caption') as string;

  if (!file || !businessId) {
    throw new Error("File or business ID missing.");
  }
  
  const filePath = `${businessId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('business-photos')
    .upload(filePath, file);

  if (uploadError) {
    console.error("Storage Upload Error:", uploadError);
    throw new Error("Failed to upload photo to storage.");
  }

  const { error: insertError } = await supabase
    .from('business_photos')
    .insert({
      business_id: Number(businessId),
      user_id: user.id,
      photo_path: filePath,
      caption: caption,
    });
  
  if (insertError) {
    console.error("Database Insert Error:", insertError);
    throw new Error("Failed to save photo metadata.");
  }

  revalidatePath('/dashboard/business/gallery');
}


// --- NEW FUNCTION TO DELETE A PHOTO ---
export async function deletePhoto(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated.");

  const photoId = formData.get('photoId') as string;
  const photoPath = formData.get('photoPath') as string;

  if (!photoId || !photoPath) {
    throw new Error("Photo ID or path missing.");
  }

  // SECURITY CHECK: Fetch the photo's business to ensure the user is the owner
  const { data: photo } = await supabase
    .from('business_photos')
    .select('businesses (owner_id)')
    .eq('id', photoId)
    .single();

  if (!photo || photo.businesses?.owner_id !== user.id) {
    throw new Error("User is not authorized to delete this photo.");
  }

  // 1. Delete the file from Storage
  const { error: storageError } = await supabase.storage
    .from('business-photos')
    .remove([photoPath]);
  
  if (storageError) {
    console.error("Storage Deletion Error:", storageError);
    throw new Error("Failed to delete photo from storage.");
  }

  // 2. Delete the metadata from the database
  const { error: dbError } = await supabase
    .from('business_photos')
    .delete()
    .eq('id', photoId);
  
  if (dbError) {
    console.error("Database Deletion Error:", dbError);
    throw new Error("Failed to delete photo metadata.");
  }

  // 3. Revalidate the gallery path to show the updated gallery
  revalidatePath('/dashboard/business/gallery');
}