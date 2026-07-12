-- Create one public profile for each Supabase Auth user.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Public application profile associated with a Supabase Auth user.';

-- Explicit database privileges.
grant select, update on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

-- Prevent users from accessing other users' profiles.
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) = id
);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) = id
)
with check (
  (select auth.uid()) = id
);

-- Automatically create a profile when a new Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    display_name
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'display_name'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();