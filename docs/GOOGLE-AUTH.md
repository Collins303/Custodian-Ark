# Google OAuth setup

1. Create a new Google Cloud project.
2. Enable the Google Identity Services OAuth flow.
3. Configure the OAuth consent screen.
4. Create OAuth credentials for a web application.
5. Add authorized JavaScript origins and redirect URIs for local development and production.
6. Connect the credentials to Supabase Auth.
7. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the environment.

## Local development

Use `http://localhost:3000` for the redirect and ensure the same domain is registered in the Google console.

## Production

Use the production domain and the Vercel domain configured for the application. Add both to the allowed redirect URIs list.
