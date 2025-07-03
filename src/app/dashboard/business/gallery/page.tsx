// src/app/dashboard/business/gallery/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadPhoto, deletePhoto } from './actions'; // <-- Import deletePhoto action
import { Trash2 } from 'lucide-react'; // <-- Removed unused GalleryHorizontal import

export const dynamic = 'force-dynamic';

export default async function GalleryManagementPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?message=You must be logged in to view this page.');
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_id', user.id)
    .single();

  if (!business) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No Business Profile Found</h1>
        <p>Your account is not associated with a business profile.</p>
        <Button asChild className="mt-4"><Link href="/reviews">Explore Businesses</Link></Button>
      </div>
    );
  }

  const { data: photos } = await supabase
    .from('business_photos')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });
  
  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('business-photos').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="border-b pb-6 mb-8">
        <h1 className="text-4xl font-bold">Manage Gallery</h1>
        <p className="mt-2 text-lg text-gray-600">Upload and manage photos for {business.name}</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload a New Photo</CardTitle>
          <CardDescription>Add a new image to your public gallery.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={uploadPhoto} className="space-y-4">
            <input type="hidden" name="businessId" value={business.id} />
            <div className="space-y-2"><Label htmlFor="photo">Photo File</Label><Input id="photo" name="photo" type="file" required /></div>
            <div className="space-y-2"><Label htmlFor="caption">Caption (Optional)</Label><Input id="caption" name="caption" type="text" placeholder="e.g., 'Our friendly team' or 'Front of our shop'" /></div>
            <Button type="submit">Upload Photo</Button>
          </form>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-3xl font-semibold mb-6">Your Current Gallery</h2>
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative group">
                <Image 
                  src={getPublicUrl(photo.photo_path)}
                  alt={photo.caption || 'Business photo'}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover aspect-square"
                />
                {/* --- NEW: Delete Button Form --- */}
                <form action={deletePhoto} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input type="hidden" name="photoPath" value={photo.photo_path} />
                  <Button type="submit" size="icon" variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Your gallery is empty. Upload your first photo!</p>
        )}
      </div>
    </div>
  );
}