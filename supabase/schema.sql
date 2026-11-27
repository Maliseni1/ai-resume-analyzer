-- Eukleya database schema
--
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- Safe to re-run: every statement is idempotent.

-- 1. Storage bucket for uploaded resume files + generated preview images.
-- Private bucket: files are only reachable via signed URLs or RLS-checked
-- requests from their owner, never a public URL.
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- 2. Table: one row per resume a user has uploaded.
create table if not exists public.resumes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    company_name text,
    job_title text,
    job_description text,
    resume_path text not null,
    image_path text,
    status text not null default 'pending'
        check (status in ('pending', 'processing', 'completed', 'failed')),
    feedback jsonb,
    created_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on public.resumes (user_id);

alter table public.resumes enable row level security;

drop policy if exists "Users can view own resumes" on public.resumes;
create policy "Users can view own resumes"
    on public.resumes for select
    to authenticated
    using (user_id = auth.uid());

drop policy if exists "Users can insert own resumes" on public.resumes;
create policy "Users can insert own resumes"
    on public.resumes for insert
    to authenticated
    with check (user_id = auth.uid());

drop policy if exists "Users can update own resumes" on public.resumes;
create policy "Users can update own resumes"
    on public.resumes for update
    to authenticated
    using (user_id = auth.uid());

drop policy if exists "Users can delete own resumes" on public.resumes;
create policy "Users can delete own resumes"
    on public.resumes for delete
    to authenticated
    using (user_id = auth.uid());

-- 3. Storage policies: files must live under a `<user_id>/...` path, and a
-- user may only touch objects under their own folder.
drop policy if exists "Users can read own resume files" on storage.objects;
create policy "Users can read own resume files"
    on storage.objects for select
    to authenticated
    using (
        bucket_id = 'resumes'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

drop policy if exists "Users can upload own resume files" on storage.objects;
create policy "Users can upload own resume files"
    on storage.objects for insert
    to authenticated
    with check (
        bucket_id = 'resumes'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

drop policy if exists "Users can update own resume files" on storage.objects;
create policy "Users can update own resume files"
    on storage.objects for update
    to authenticated
    using (
        bucket_id = 'resumes'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

drop policy if exists "Users can delete own resume files" on storage.objects;
create policy "Users can delete own resume files"
    on storage.objects for delete
    to authenticated
    using (
        bucket_id = 'resumes'
        and (storage.foldername(name))[1] = auth.uid()::text
    );
