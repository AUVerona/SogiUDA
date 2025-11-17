# Vercel deploy instructions (project: sogi-gestionale)

This file explains how to deploy the `sogi-gestionale` subfolder of this repository to Vercel and lists the required environment variables.

Steps
1. On Vercel, create a new Project and import this Git repository (AUVerona / SogiUDA).
2. In the **Project Settings > General > Root Directory** set the root to: `sogi-gestionale`
   - This tells Vercel to run the build from that folder instead of the repository root.
3. Ensure the Framework Preset is detected as Next.js (the repo contains a `package.json` in `sogi-gestionale`).
4. Add the following Environment Variables in Vercel (Production and Preview as needed):

   - `MONGODB_URI` — MongoDB connection string used by `src/lib/mongodb.ts`.
   - `NEXTAUTH_URL` — The public URL of your app (e.g. `https://your-app.vercel.app`).
   - `NEXTAUTH_SECRET` — A long, random secret string used by NextAuth.

Optional but recommended:
   - `NEXTAUTH_DEBUG=true` (only for Preview or Development if you need extra logs)

Build & Output
- Build command: `npm run build` (already set in `sogi-gestionale/package.json`)
- Output: default Next.js output; Vercel will handle the serverless routes for `app/api`.

Notes about this repository
- I fixed a blank/invalid `vercel.json` in the repo root and added a valid `sogi-gestionale/vercel.json` that uses the Next.js builder. The project is configured so Vercel will build the Next.js app from `sogi-gestionale`.
- `.vercelignore` was adjusted so Vercel ignores everything except `sogi-gestionale` (good for monorepos).
- If you prefer not to set the project's Root Directory in Vercel, you can instead create a Vercel monorepo configuration; the simplest route is to set Root Directory to `sogi-gestionale`.

If you want, I can:
- trigger a preview deploy (you'll need to push a branch to the remote and share the branch name), or
- prepare a small checklist with exact values to paste into Vercel's env vars UI.
