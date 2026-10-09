-- À exécuter dans Supabase > SQL Editor, après schema.sql.
-- Remplacez l’adresse ci-dessous par l’adresse exacte du compte déjà créé.
-- Cette opération accorde l’accès à l’administration du site.

begin;

do $$
declare
  admin_email text := lower('VOTRE_EMAIL_EXACT');
  admin_user_id uuid;
begin
  select id into admin_user_id
  from auth.users
  where lower(email) = admin_email;

  if admin_user_id is null then
    raise exception 'Aucun compte Supabase trouvé pour %', admin_email;
  end if;

  insert into public.profiles (id, full_name, role)
  select
    u.id,
    coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1)),
    'chef'
  from auth.users u
  where u.id = admin_user_id
  on conflict (id) do update set role = 'chef';

  -- Si ce compte a aussi une demande d’administration, la marquer approuvée.
  update public.chef_signup_requests
  set status = 'approved'
  where user_id = admin_user_id;
end;
$$;

commit;

-- Vérification : le résultat doit afficher le compte avec role = chef.
select u.email, p.role
from auth.users u
join public.profiles p on p.id = u.id
where lower(u.email) = lower('VOTRE_EMAIL_EXACT');
