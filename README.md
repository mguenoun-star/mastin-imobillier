<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Mastin immobilier

This contains everything you need to run your app locally.

## Installation et connexion à Supabase

Prérequis : Node.js et un projet Supabase.


1. Copiez `.env.example` vers `.env.local`, puis renseignez l’URL racine du projet Supabase et sa clé publique `anon` / `publishable`.
2. Dans Supabase, ouvrez **SQL Editor** et exécutez [`supabase/schema.sql`](supabase/schema.sql).
3. Créez votre compte depuis l’application, puis confirmez l’adresse e-mail si Supabase le demande.
4. Dans le SQL Editor, attribuez le rôle chef à cette adresse en remplaçant `VOTRE_EMAIL` dans la dernière commande commentée de `schema.sql`, puis exécutez-la.
5. Exécutez `npm install`, puis `npm run dev`.

Les inscriptions suivantes auront automatiquement le rôle client. L’index SQL interdit d’avoir deux chefs. Les annonces et favoris sont enregistrés dans Supabase ; l’accès aux annonces est protégé par les règles RLS du schéma.
