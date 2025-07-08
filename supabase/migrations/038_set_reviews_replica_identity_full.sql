-- 038_set_reviews_replica_identity_full.sql

ALTER TABLE public.reviews
REPLICA IDENTITY FULL;