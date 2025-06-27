// src/app/claim/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { claimBusiness } from '../actions' // <-- This path is now correct
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function ClaimBusinessPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?message=Please log in to claim a business')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, owner_id')
    .eq('slug', params.slug)
    .single()

  if (!business) {
    notFound()
  }

  if (business.owner_id) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Already Claimed</h1>
        <p>This business profile for "{business.name}" has already been claimed.</p>
        <p className="mt-2 text-sm text-gray-600">If you believe this is an error, please contact support.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Claim Your Business Profile</h1>
      <p className="text-lg text-gray-700 mb-8">You are about to claim ownership of the following business:</p>
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <p className="text-2xl font-semibold">{business.name}</p>
      </div>
      <p className="text-sm mb-8">By clicking "Confirm Claim", you verify that you are the owner or an authorized representative of this business.</p>
      
      <form action={claimBusiness}>
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="businessSlug" value={params.slug} />
        <Button type="submit" size="lg" className="w-full md:w-auto">
          Confirm Claim
        </Button>
      </form>
    </div>
  )
}