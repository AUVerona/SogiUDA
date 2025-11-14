# Vercel Deployment Configuration for SogiUDA

# 1. Build Command
npm run build

# 2. Output Directory
.next

# 3. Install Command (default)
npm install

# 4. Environment Variables
# (Set these in the Vercel dashboard, not here)
# Example:
# MONGODB_URI=your-mongodb-uri
# NEXTAUTH_URL=https://your-vercel-domain.vercel.app
# NEXTAUTH_SECRET=your-secret

# 5. Node.js Version (optional)
# Set in package.json "engines" or in Vercel dashboard

# 6. Ignore Build Step (optional)
# Add a vercel-ignore.txt if needed

# 7. Root Directory
# If deploying sogi-gestionale only, set root to /sogi-gestionale in Vercel settings

# 8. API routes
# Next.js API routes are supported out of the box

# 9. Custom Domains
# Set up in Vercel dashboard after first deploy

# 10. Static Files
# /public is automatically served

# 11. NextAuth.js
# Ensure all secrets and providers are set in Vercel dashboard

# 12. .env
# Do NOT commit secrets. Use .env.local for local dev, Vercel dashboard for production.

# 13. Clean up
# Remove any local dev/test files not needed in production

# 14. README
# Add deployment notes to README.md

# 15. Test
# Test the deployed app after first deploy and set up any required rewrites/redirects in vercel.json if needed.
