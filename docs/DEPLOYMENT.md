# DEPLOYMENT.md — The Bike Yard

# Deployment Guide

## Overview

The Bike Yard is a Next.js application designed for deployment on Vercel or any Docker-capable platform. This document covers deployment procedures, environment configuration, and rollback procedures.

## Prerequisites

- Node.js v20.0.0+
- npm 10.0.0+
- PostgreSQL 15.0+
- S3-compatible storage (AWS S3, Cloudflare R2, or MinIO for development)
- Git 2.40+

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Required environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Auth.js session signing key (32+ chars) | Yes |
| `NEXTAUTH_URL` | Application base URL | Yes |
| `BASE_URL` | Public site URL | No |
| `STORAGE_PROVIDER` | `s3` or `local` | No |
| `S3_BUCKET_NAME` | Storage bucket name | No (if S3) |
| `S3_ENDPOINT` | S3-compatible endpoint | No (if S3) |
| `S3_ACCESS_KEY_ID` | Storage access key | No (if S3) |
| `S3_SECRET_ACCESS_KEY` | Storage secret key | No (if S3) |
| `AI_PROVIDER` | `stub`, `openai`, or `anthropic` | No |
| `AI_API_KEY` | AI provider key | No (if AI provider) |
| `PAYMENT_PROVIDER` | `stub` or `stripe` | No |

**Never commit `.env.local` to version control.**

## Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd the-bike-yard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. Create the PostgreSQL database:
   ```bash
   createdb bikeyard
   ```

5. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Seed the database (development only):
   ```bash
   npx prisma db seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open http://localhost:3000 in your browser.

## Production Deployment (Vercel)

### Option 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in the Vercel dashboard or via CLI:
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   ```

5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Git Integration

1. Push code to GitHub/GitLab:
   ```bash
   git push origin main
   ```

2. Connect the repository to Vercel:
   - Go to Vercel dashboard
   - Click "Add New" → "Project"
   - Select your repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`
   - Add environment variables
   - Deploy

## Database Migrations

### Development
```bash
npx prisma migrate dev --name <migration-name>
```

### Production
```bash
npx prisma migrate deploy
```

**Always backup the database before running migrations in production.**

## Seed Data (Development Only)

```bash
npx prisma db seed
```

**Warning:** Seed data is fictional and for development only. Never run in production.

## Rollback Procedures

### Application Rollback (Vercel)
```bash
# List deployments
vercel ls

# Rollback to a previous deployment
vercel rollback <deployment-url>
```

### Database Rollback
1. Restore database from backup
2. Run `prisma migrate deploy` to sync schema
3. Verify application functionality

## Health Checks

The application exposes health checks at:
- `GET /api/health` - Returns application health status

## Monitoring

- Application logs are available in the Vercel dashboard
- Database metrics are available in your PostgreSQL provider dashboard
- Set up uptime monitoring for `https://your-domain.com/api/health`

## Security Considerations

- Never commit `.env.local` to version control
- Rotate `NEXTAUTH_SECRET` regularly
- Restrict database access to application servers only
- Enable S3 bucket versioning for document recovery
- Review access logs regularly

## Support

Contact the system administrator for deployment issues.
