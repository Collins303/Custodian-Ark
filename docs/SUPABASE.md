# Supabase setup

1. Create a Supabase project.
2. Grab the project URL and anon key.
3. Create the Postgres schema and migrations in the `supabase/migrations` folder.
4. Enable Row Level Security for customer tables.
5. Configure Auth with email/password and Google login.
6. Add the environment variables to your local and production platform.

## Recommended production setup

- Use a dedicated production Supabase project.
- Keep service-role credentials only on the server side.
- Restrict admin access through server-side checks and policies.
