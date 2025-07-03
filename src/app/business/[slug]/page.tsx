// src/app/business/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Globe, Phone, Mail, ShieldCheck, CornerDownRight, Clock, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import AiSynthesisCard from '@/components/AiSynthesisCard';

const formatTime = (time: string | null) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Defined strong types to remove ':any'
type Profile = { full_name: string | null; };
type BusinessResponse = { response_text: string; created_at: string; status: string; };
type Review = { id: number; created_at: string; title: string; summary: string; overall_rating: number | null; status: string; profiles: Profile; business_responses: BusinessResponse[]; };
type AiSynthesis = { overall_sentiment: string; generated_summary: string; common_themes_pros: string[]; common_themes_cons: string[]; };
type Photo = { id: number; photo_path: string; caption: string | null; };
type OperatingHour = { open: string; close: string; is_closed: boolean };
type OperatingHours = { [day: string]: OperatingHour };

type Business = {
  id: number; name: string; slug: string; description: string | null; address: string | null; website_url: string | null;
  phone_number: string | null; business_email: string | null; revuoo_score: number | null; is_verified: boolean;
  category: string | null; services: string[] | null; owner_id: string | null; operating_hours: OperatingHours | null;
  reviews: Review[];
  business_ai_synthesis: AiSynthesis | null;
  business_photos: Photo[];
};

async function getBusinessData(slug: string): Promise<Business | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
    .from('businesses')
    .select(`*, reviews (*, profiles (*), business_responses (*)), business_ai_synthesis (*), business_photos (*)`)
    .eq('slug', slug)
    .single();

  if (error) { console.error('Error fetching business data:', error); return null; }
  
  if (data && Array.isArray(data.business_ai_synthesis) && data.business_ai_synthesis.length === 0) {
    data.business_ai_synthesis = null;
  }
  return data;
}

export default async function BusinessProfilePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const business = await getBusinessData(params.slug);

  if (!business) { notFound(); }
  
  const approvedReviews = business.reviews.filter(review => review.status === 'approved');
  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const synthesis = business.business_ai_synthesis;
  
  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('business-photos').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-4 mb-2"><h1 className="text-4xl font-bold text-gray-900">{business.name}</h1>{business.is_verified && (<Badge variant="default" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Verified</Badge>)}</div>
                  <p className="text-lg text-gray-600">{business.description}</p>
                </div>
                {business.revuoo_score && (<div className="flex-shrink-0 text-center bg-indigo-600 text-white p-4 rounded-lg"><p className="text-sm font-semibold uppercase tracking-wider">Revuoo Score</p><p className="text-5xl font-bold">{Number(business.revuoo_score).toFixed(1)}</p></div>)}
            </div>
            {!business.owner_id && (<div className="mt-6 border-t pt-6 text-center"><p className="font-semibold mb-2">Are you the owner of {business.name}?</p><Button asChild><Link href={`/claim/${business.slug}`}>Claim This Profile</Link></Button></div>)}
        </div>

        {business.business_photos && business.business_photos.length > 0 && (
          <div className="mb-8 bg-white p-8 rounded-lg shadow-md">
             <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"><Camera className="h-8 w-8 text-indigo-600"/> Photo Gallery</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {business.business_photos.map(photo => (
                  <div key={photo.id} className="aspect-w-1 aspect-h-1">
                     <Image src={getPublicUrl(photo.photo_path)} alt={photo.caption || `Photo for ${business.name}`} width={400} height={400} className="rounded-lg object-cover" />
                  </div>
                ))}
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {synthesis && (<div className="mb-8"><AiSynthesisCard synthesis={synthesis} /></div>)}
            <h2 className="text-2xl font-bold text-gray-900">Individual Reviews ({approvedReviews.length})</h2>
            {approvedReviews.length > 0 ? (approvedReviews.map((review) => { const approvedResponse = review.business_responses.find(r => r.status === 'approved'); return (<Card key={review.id} className="w-full"><CardHeader><div className="flex justify-between items-start"><div><CardTitle className="text-lg">{review.title}</CardTitle><p className="text-sm text-gray-500 mt-1">By {review.profiles?.full_name || 'Anonymous'} on {format(new Date(review.created_at), 'MMM d, yyyy')}</p></div>{review.overall_rating && (<div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-bold"><Star className="h-4 w-4"/><span>{review.overall_rating.toFixed(1)}</span></div>)}</div></CardHeader><CardContent><p className="text-gray-700">{review.summary}</p></CardContent>{approvedResponse && (<CardContent><div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-4 rounded-r-lg"><div className="flex items-start gap-3"><CornerDownRight className="h-5 w-5 text-indigo-600 flex-shrink-0" /><div><h4 className="font-bold text-indigo-800">Response from the business</h4><p className="text-gray-700 mt-1 italic">&quot;{approvedResponse.response_text}&quot;</p></div></div></div></CardContent>)}</Card>)})) : (<div className="text-center py-12 bg-white rounded-lg shadow-sm"><p className="text-gray-600">No approved reviews yet for {business.name}.</p></div>)}
          </div>

          <div className="lg-col-span-1"><Card className="sticky top-24"><CardHeader><CardTitle>Business Details</CardTitle></CardHeader><CardContent className="space-y-4 text-sm">{business.address && (<div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" /><p className="text-gray-700">{business.address}</p></div>)}{business.phone_number && (<div className="flex items-start gap-3"><Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" /><p className="text-gray-700">{business.phone_number}</p></div>)}{business.website_url && (<div className="flex items-start gap-3"><Globe className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" /><a href={business.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">{business.website_url}</a></div>)}{business.business_email && (<div className="flex items-start gap-3"><Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" /><p className="text-gray-700 break-all">{business.business_email}</p></div>)}{business.operating_hours && Object.keys(business.operating_hours).length > 0 && (<div className="pt-4 border-t"><h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Clock className="h-4 w-4"/> Operating Hours</h4><div className="space-y-1">{weekDays.map(day => { const hours = business.operating_hours[day]; if (!hours) return null; return (<div key={day} className="flex justify-between"><span className="capitalize">{day}</span><span className="font-medium">{hours.is_closed ? 'Closed' : `${formatTime(hours.open)} - ${formatTime(hours.close)}`}</span></div>)})}</div></div>)}{business.services && business.services.length > 0 && (<div className="pt-4 border-t"><h4 className="font-semibold text-gray-800 mb-2">Services Offered</h4><div className="flex flex-wrap gap-2">{business.services.map(service => (<Badge key={service} variant="secondary">{service}</Badge>))}</div></div>)}</CardContent></Card></div>
        </div>
      </div>
    </div>
  );
}