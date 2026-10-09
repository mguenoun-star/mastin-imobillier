-- Pending requests for new administration accounts.
-- Run this migration in Supabase SQL Editor before enabling the signup form.
create table if not exists public.chef_signup_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
alter table public.chef_signup_requests enable row level security;
drop policy if exists "users read own chef signup request" on public.chef_signup_requests;
create policy "users read own chef signup request" on public.chef_signup_requests
for select to authenticated using (user_id = auth.uid());

-- Approved chef accounts are individually protected by the profiles role trigger.
drop index if exists public.one_chef_only;

-- Keep the profile table compatible with existing Supabase profile schemas.
alter table public.profiles add column if not exists full_name text not null default '';
alter table public.profiles add column if not exists role text not null default 'client';
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists is_agent boolean not null default false;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
create index if not exists profiles_role_idx on public.profiles (role);

create or replace function public.create_profile_for_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, role, phone, avatar_url, is_agent, created_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'client',
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    false,
    now()
  );

  if new.raw_user_meta_data ->> 'account_request' = 'chef' then
    insert into public.chef_signup_requests (user_id, full_name, email, phone)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', ''),
      coalesce(new.email, ''),
      coalesce(new.raw_user_meta_data ->> 'phone', '')
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users
for each row execute function public.create_profile_for_user();

-- Recover requests created before this trigger was installed. Re-running this
-- migration is safe; existing requests are not duplicated or overwritten.
insert into public.chef_signup_requests (user_id, full_name, email, phone)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data ->> 'phone', '')
from auth.users u
where u.raw_user_meta_data ->> 'account_request' = 'chef'
on conflict (user_id) do nothing;

-- Review pending requests:
-- select user_id, full_name, email, phone, created_at
-- from public.chef_signup_requests where status = 'pending' order by created_at;
-- Approve one request after verifying its owner, using Supabase SQL Editor:
-- begin;
-- update public.profiles p set role = 'chef'
-- from public.chef_signup_requests r
-- where p.id = r.user_id and lower(r.email) = lower('EMAIL_TO_APPROVE')
--   and r.status = 'pending';
-- update public.chef_signup_requests set status = 'approved'
-- where lower(email) = lower('EMAIL_TO_APPROVE') and status = 'pending';
-- commit;
