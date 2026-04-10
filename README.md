# EAST LINE TELEKOM

This project now supports a temporary local MongoDB runtime through Docker Compose for both development and production. It seeds business data from `db_cluster-14-04-2025@08-20-25.backup.gz` until the external MongoDB Atlas cluster is available again.

## What It Does

- Runs MongoDB in Docker as a single-node replica set compatible with Prisma.
- Runs the Next.js frontend in Docker for dev or prod.
- Imports the old Supabase/Postgres `public` business data into MongoDB.
- Skips re-import when the MongoDB database already contains data.

Images are not copied into MongoDB. The imported documents still reference the existing public Supabase image URLs.

## Development

Start MongoDB and the Next.js dev server:

```bash
npm run docker:dev
```

The app will be available at `http://localhost:3000`.

## Production

Start MongoDB and the production Next.js container:

```bash
npm run docker:prod
```

Set `NEXT_PUBLIC_SITE_URL` before starting if you want canonical metadata to use your real domain:

```bash
NEXT_PUBLIC_SITE_URL=https://elt.uz npm run docker:prod
```

## Manual Backup Import

You can import the backup into the configured MongoDB connection manually:

```bash
node scripts/import-backup-to-mongo.mjs --if-empty
```

Force a full replacement of existing MongoDB business data:

```bash
node scripts/import-backup-to-mongo.mjs --force
```
