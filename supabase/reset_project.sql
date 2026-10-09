
begin;

create extension if not exists pgcrypto;

drop trigger if exists on_auth_user_created_profile on auth.users;
drop table if exists public.favorites cascade;
drop table if exists public.chef_signup_requests cascade;
drop table if exists public.properties cascade;
drop table if exists public.profiles cascade;
drop function if exists public.create_profile_for_user();
drop function if exists public.prevent_role_change();
drop function if exists public.is_chef();
drop function if exists public.increment_property_counter(uuid, text);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'client' check (role in ('chef', 'client')),
  phone text,
  avatar_url text,
  is_agent boolean not null default false,
  created_at timestamptz not null default now()
);
create index profiles_role_idx on public.profiles(role);

create table public.chef_signup_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  title text not null,
  price numeric not null check (price > 0),
  currency text not null default 'DZD',
  "transactionType" text not null check ("transactionType" in ('sale', 'rent')),
  "propertyType" text not null,
  city text not null,
  district text not null default '',
  area numeric not null default 0,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  floor integer,
  "totalFloors" integer,
  description text not null default '',
  images text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'published' check (status in ('published', 'draft')),
  lat numeric not null default 0,
  lng numeric not null default 0,
  "instagramUrl" text,
  "whatsappNumber" text not null default '',
  amenities text[] not null default '{}',
  views_count integer not null default 0,
  contacts_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index properties_published_created_idx on public.properties(status, created_at desc);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  primary key (user_id, property_id)
);

create or replace function public.create_profile_for_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, role, phone, avatar_url, is_agent, created_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Utilisateur'),
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
create trigger on_auth_user_created_profile after insert on auth.users
for each row execute function public.create_profile_for_user();
insert into public.profiles (id, full_name, role, phone, avatar_url, is_agent)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', nullif(split_part(coalesce(u.email, ''), '@', 1), ''), 'Utilisateur'),
  'client',
  nullif(u.raw_user_meta_data ->> 'phone', ''),
  nullif(u.raw_user_meta_data ->> 'avatar_url', ''),
  false
from auth.users u;
insert into public.chef_signup_requests (user_id, full_name, email, phone)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data ->> 'phone', '')
from auth.users u
where u.raw_user_meta_data ->> 'account_request' = 'chef'
on conflict (user_id) do nothing;

create or replace function public.prevent_role_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.role is distinct from old.role and current_user <> 'postgres' then
    raise exception 'Role can only be changed by a database administrator';
  end if;
  return new;
end;
$$;
create trigger profiles_role_is_admin_only before update on public.profiles
for each row execute function public.prevent_role_change();

create or replace function public.is_chef()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'chef');
$$;

create or replace function public.increment_property_counter(property_id uuid, counter_name text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if counter_name = 'views_count' then
    update public.properties set views_count = views_count + 1 where id = property_id and status = 'published';
  elsif counter_name = 'contacts_count' then
    update public.properties set contacts_count = contacts_count + 1 where id = property_id and status = 'published';
  else
    raise exception 'Unknown property counter';
  end if;
end;
$$;
grant execute on function public.increment_property_counter(uuid, text) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.chef_signup_requests enable row level security;
alter table public.properties enable row level security;
alter table public.favorites enable row level security;

create policy "profiles readable by signed in users" on public.profiles
for select to authenticated using (true);
create policy "users update own profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "users read own chef signup request" on public.chef_signup_requests
for select to authenticated using (user_id = auth.uid());
create policy "published properties readable" on public.properties
for select using (status = 'published' or public.is_chef());
create policy "chef creates properties" on public.properties
for insert to authenticated with check (public.is_chef() and owner_id = auth.uid());
create policy "chef updates properties" on public.properties
for update to authenticated using (public.is_chef()) with check (public.is_chef());
create policy "chef deletes properties" on public.properties
for delete to authenticated using (public.is_chef());
create policy "users read own favorites" on public.favorites
for select to authenticated using (user_id = auth.uid());
create policy "users add own favorites" on public.favorites
for insert to authenticated with check (user_id = auth.uid());
create policy "users remove own favorites" on public.favorites
for delete to authenticated using (user_id = auth.uid());

commit;
