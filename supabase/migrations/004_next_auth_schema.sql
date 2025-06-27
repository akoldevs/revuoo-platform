-- This script is the official schema required by the NextAuth.js Supabase Adapter.

CREATE TABLE IF NOT EXISTS public.users (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NULL,
	email text NULL,
	"emailVerified" timestamptz NULL,
	image text NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.accounts (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	provider text NOT NULL,
	"providerAccountId" text NOT NULL,
	refresh_token text NULL,
	access_token text NULL,
	expires_at int8 NULL,
	token_type text NULL,
	scope text NULL,
	id_token text NULL,
	session_state text NULL,
	CONSTRAINT accounts_pkey PRIMARY KEY (id),
    CONSTRAINT accounts_userId_fkey FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.sessions (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"sessionToken" text NOT NULL,
	"userId" uuid NOT NULL,
	expires timestamptz NOT NULL,
	CONSTRAINT sessions_sessionToken_key UNIQUE ("sessionToken"),
	CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT sessions_userId_fkey FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.verification_tokens (
	identifier text NOT NULL,
	token text NOT NULL,
	expires timestamptz NOT NULL,
	CONSTRAINT verification_tokens_token_key UNIQUE (token),
	CONSTRAINT verification_tokens_pkey PRIMARY KEY (identifier, token)
);