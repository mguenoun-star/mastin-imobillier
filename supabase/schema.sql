-- Exécuter ce fichier dans Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'client' check (role in ('chef', 'client')),
  created_at timestamptz not null default now()
);

-- Mise à niveau des tables profiles déjà présentes dans les anciens projets.
alter table public.profiles
  add column if not exists role text not null default 'client';
alter table public.profiles
  add column if not exists full_name text not null default '',
  add column if not exists phone text,
  add column if not exists avatar_url text,
  add column if not exists is_agent boolean not null default false,
  add column if not exists created_at timestamptz not null default now();

-- Chef signup requests remain private and can only be reviewed in Supabase.
create table if not exists public.chef_signup_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_allowed' and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles add constraint profiles_role_allowed
      check (role in ('chef', 'client'));
  end if;
end;
$$;

-- Plusieurs comptes chef peuvent exister, mais seul un administrateur DB peut
-- leur attribuer ce rôle (trigger profiles_role_is_admin_only ci-dessous).
drop index if exists public.one_chef_only;
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

create or replace function public.prevent_role_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.role is distinct from old.role and current_user <> 'postgres' then
    raise exception 'Le rôle est géré exclusivement par un administrateur de la base';
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_role_is_admin_only on public.profiles;
create trigger profiles_role_is_admin_only before update on public.profiles
for each row execute function public.prevent_role_change();

create or replace function public.is_chef()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'chef');
$$;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id),
  title text not null, price numeric not null check (price > 0), currency text not null default 'DZD',
  "transactionType" text not null check ("transactionType" in ('sale', 'rent')),
  "propertyType" text not null, city text not null, district text not null default '',
  area numeric not null default 0, bedrooms integer not null default 0, bathrooms integer not null default 0,
  floor integer, "totalFloors" integer, description text not null default '', images text[] not null default '{}',
  featured boolean not null default false, status text not null default 'published' check (status in ('published','draft')),
  lat numeric not null default 0, lng numeric not null default 0, "instagramUrl" text,
  "whatsappNumber" text not null default '', amenities text[] not null default '{}',
  views_count integer not null default 0, contacts_count integer not null default 0,
  created_at timestamptz not null default now()
);
-- Mise à niveau des anciennes tables properties pour tous les champs du formulaire.
alter table public.properties
  add column if not exists "transactionType" text not null default 'sale',
  add column if not exists "propertyType" text not null default 'appartement',
  add column if not exists city text not null default '',
  add column if not exists district text not null default '',
  add column if not exists area numeric not null default 0,
  add column if not exists bedrooms integer not null default 0,
  add column if not exists bathrooms integer not null default 0,
  add column if not exists floor integer,
  add column if not exists "totalFloors" integer,
  add column if not exists description text not null default '',
  add column if not exists images text[] not null default '{}',
  add column if not exists featured boolean not null default false,
  add column if not exists status text not null default 'published',
  add column if not exists lat numeric not null default 0,
  add column if not exists lng numeric not null default 0,
  add column if not exists "instagramUrl" text,
  add column if not exists "whatsappNumber" text not null default '',
  add column if not exists amenities text[] not null default '{}',
  add column if not exists views_count integer not null default 0,
  add column if not exists contacts_count integer not null default 0,
  add column if not exists created_at timestamptz not null default now();
create index if not exists properties_published_created_idx on public.properties(status, created_at desc);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  primary key (user_id, property_id)
);

alter table public.profiles enable row level security;
alter table public.chef_signup_requests enable row level security;
alter table public.properties enable row level security;
alter table public.favorites enable row level security;
create policy "profiles readable by signed in users" on public.profiles for select to authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "users read own chef signup request" on public.chef_signup_requests;
create policy "users read own chef signup request" on public.chef_signup_requests for select to authenticated using (user_id = auth.uid());
create policy "published properties readable" on public.properties for select using (status = 'published' or public.is_chef());
create policy "chef creates properties" on public.properties for insert to authenticated with check (public.is_chef() and owner_id = auth.uid());
create policy "chef updates properties" on public.properties for update to authenticated using (public.is_chef()) with check (public.is_chef());
create policy "chef deletes properties" on public.properties for delete to authenticated using (public.is_chef());
create policy "users read own favorites" on public.favorites for select to authenticated using (user_id = auth.uid());
create policy "users add own favorites" on public.favorites for insert to authenticated with check (user_id = auth.uid());
create policy "users remove own favorites" on public.favorites for delete to authenticated using (user_id = auth.uid());

-- Autorise les visiteurs à compter vues et prises de contact sans leur donner
-- le droit de modifier le reste d'une annonce.
create or replace function public.increment_property_counter(property_id uuid, counter_name text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if counter_name = 'views_count' then
    update public.properties set views_count = views_count + 1 where id = property_id and status = 'published';
  elsif counter_name = 'contacts_count' then
    update public.properties set contacts_count = contacts_count + 1 where id = property_id and status = 'published';
  else
    raise exception 'Compteur inconnu';
  end if;
end;
$$;
grant execute on function public.increment_property_counter(uuid, text) to anon, authenticated;

-- ADMIN SIGNUP APPROVAL
-- Review the pending requests in Supabase SQL Editor:
-- select user_id, full_name, email, phone, status, created_at
-- from public.chef_signup_requests where status = 'pending' order by created_at;
-- Approve the verified request by email (run as postgres in SQL Editor):
-- begin;
-- update public.profiles p set role = 'chef'
-- from public.chef_signup_requests r
-- where p.id = r.user_id and lower(r.email) = lower('EMAIL_TO_APPROVE')
--   and r.status = 'pending';
-- update public.chef_signup_requests set status = 'approved'
-- where lower(email) = lower('EMAIL_TO_APPROVE') and status = 'pending';
-- commit;
-- The auth trigger always creates a client profile first. Only a database admin
-- can promote it; unapproved users are signed out and cannot open chef pages.
