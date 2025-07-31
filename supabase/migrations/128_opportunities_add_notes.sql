-- This migration adds a 'notes' column to the opportunities table.
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS notes text;