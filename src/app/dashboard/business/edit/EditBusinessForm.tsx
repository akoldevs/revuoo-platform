// src/app/dashboard/business/edit/EditBusinessForm.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateBusinessProfile } from './actions'; // <-- 1. UNCOMMENT (or add) THIS LINE

export default function EditBusinessForm({ business }: { business: any }) {
  
  return (
    // 2. ADD the action attribute to the form
    <form action={updateBusinessProfile} className="space-y-6">
      <input type="hidden" name="businessId" value={business.id} />
      <div className="space-y-2">
        <Label htmlFor="name">Business Name</Label>
        <Input id="name" name="name" type="text" defaultValue={business.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={business.description || ''}
          rows={6}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" type="text" defaultValue={business.address || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input id="phone_number" name="phone_number" type="tel" defaultValue={business.phone_number || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" name="website_url" type="url" defaultValue={business.website_url || ''} />
        </div>
          <div className="space-y-2">
          <Label htmlFor="business_email">Public Email</Label>
          <Input id="business_email" name="business_email" type="email" defaultValue={business.business_email || ''} />
        </div>
      </div>
      <Button type="submit" className="w-full text-lg">
        Save Changes
      </Button>
    </form>
  );
}