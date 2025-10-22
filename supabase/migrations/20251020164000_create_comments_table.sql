
create table comments (
  id uuid primary key default gen_random_uuid(),
  x float8 not null,
  y float8 not null,
  "normalizedX" float8 not null,
  "normalizedY" float8 not null,
  text text not null,
  "authorName" text not null,
  "userId" text not null,
  "pagePath" text not null,
  timestamp timestamptz not null default now(),
  replies jsonb not null default '[]'::jsonb,
  status text not null default 'open'
);
