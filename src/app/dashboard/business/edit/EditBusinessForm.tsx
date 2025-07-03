// src/app/dashboard/business/edit/EditBusinessForm.tsx
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateBusinessProfile } from './actions';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// Define types for operating hours
type OperatingHour = { open: string; close: string; is_closed: boolean };
type OperatingHours = { [day: string]: OperatingHour };

// A new sub-component to manage the schedule for a single day
function DaySchedule({
  day,
  hours,
  setHours,
}: {
  day: string;
  hours: OperatingHours;
  setHours: React.Dispatch<React.SetStateAction<OperatingHours>>;
}) {
  const dayKey = day.toLowerCase();
  const isClosed = hours[dayKey]?.is_closed || false;

  const handleTimeChange = (field: 'open' | 'close', value: string) => {
    setHours({
      ...hours,
      [dayKey]: { ...hours[dayKey], [field]: value, is_closed: false },
    });
  };

  const handleClosedToggle = (checked: boolean) => {
    setHours({
      ...hours,
      [dayKey]: { ...hours[dayKey], is_closed: checked },
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4 items-center">
      <Label className="capitalize">{day}</Label>
      <div className="col-span-2 flex items-center gap-2">
        <Input 
          type="time" 
          value={hours[dayKey]?.open || ''} 
          onChange={(e) => handleTimeChange('open', e.target.value)}
          disabled={isClosed}
        />
        <span>-</span>
        <Input 
          type="time" 
          value={hours[dayKey]?.close || ''} 
          onChange={(e) => handleTimeChange('close', e.target.value)}
          disabled={isClosed}
        />
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`closed-${dayKey}`}
            checked={isClosed}
            onCheckedChange={handleClosedToggle}
          />
          <Label htmlFor={`closed-${dayKey}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Closed
          </Label>
        </div>
      </div>
    </div>
  );
}

// Define a type for the business prop
type Business = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  address?: string;
  phone_number?: string;
  website_url?: string;
  business_email?: string;
  services?: string[];
  operating_hours?: OperatingHours;
  // Add any other fields as needed
};

export default function EditBusinessForm({ business }: { business: Business }) {
  const [services, setServices] = useState<string[]>(business.services || []);
  const [currentService, setCurrentService] = useState('');
  
  // --- NEW: State management for operating hours ---
  const [operatingHours, setOperatingHours] = useState<OperatingHours>(business.operating_hours || {});

  const handleAddService = () => {
    if (currentService && !services.includes(currentService)) {
      setServices([...services, currentService]);
      setCurrentService('');
    }
  };
  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter(service => service !== serviceToRemove));
  };

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <form action={updateBusinessProfile} className="space-y-8">
      <input type="hidden" name="businessId" value={business.id} />
      <input type="hidden" name="businessSlug" value={business.slug} />
      <input type="hidden" name="services" value={JSON.stringify(services)} />
      {/* This hidden input sends the hours object to the server action */}
      <input type="hidden" name="operatingHours" value={JSON.stringify(operatingHours)} />

      {/* Core Details & Contact Info Cards ... */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-xl font-semibold mb-4">Core Details</h3>
        <div className="space-y-4">
          <div className="space-y-2"><Label htmlFor="name">Business Name</Label><Input id="name" name="name" type="text" defaultValue={business.name} required /></div>
          <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={business.description || ''} rows={5} /></div>
        </div>
      </div>
       <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" name="address" type="text" defaultValue={business.address || ''} /></div>
            <div className="space-y-2"><Label htmlFor="phone_number">Phone Number</Label><Input id="phone_number" name="phone_number" type="tel" defaultValue={business.phone_number || ''} /></div>
            <div className="space-y-2"><Label htmlFor="website_url">Website URL</Label><Input id="website_url" name="website_url" type="url" defaultValue={business.website_url || ''} /></div>
            <div className="space-y-2"><Label htmlFor="business_email">Public Email</Label><Input id="business_email" name="business_email" type="email" defaultValue={business.business_email || ''} /></div>
        </div>
      </div>

      {/* Services Section... */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-xl font-semibold mb-4">Services Offered</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {services.map(service => (<Badge key={service} variant="secondary" className="text-base py-1 pl-3 pr-1">{service}<button type="button" onClick={() => handleRemoveService(service)} className="ml-2 rounded-full hover:bg-gray-300 p-0.5"><X className="h-3 w-3" /></button></Badge>))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="e.g., Deep Cleaning" value={currentService} onChange={(e) => setCurrentService(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddService(); }}}/>
          <Button type="button" onClick={handleAddService}>Add Service</Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Type a service and click &quot;Add&quot; or press Enter.</p>
      </div>

      {/* --- NEW: Operating Hours Section --- */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-xl font-semibold mb-4">Operating Hours</h3>
        <div className="space-y-4">
          {weekDays.map(day => (
            <DaySchedule key={day} day={day} hours={operatingHours} setHours={setOperatingHours} />
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        Save All Changes
      </Button>
    </form>
  );
}