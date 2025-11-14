# Deployment notes for Vercel

1. Deploy only the `sogi-gestionale` folder as the root in Vercel settings.
2. Set environment variables in the Vercel dashboard (es: MONGODB_URI, NEXTAUTH_URL, NEXTAUTH_SECRET).
3. Build command: `npm run build`
4. Output directory: `.next`
5. Node version: >=18 (impostato in package.json)
6. Ignora file non necessari con `.vercelignore`.
7. Se usi custom domain, configura dopo il primo deploy.
8. Per API e NextAuth.js non serve configurazione extra.
9. Per aggiornare Next.js: `npm install next@latest`.
10. Testa sempre il deploy dopo ogni modifica importante.
