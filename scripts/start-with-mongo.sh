#!/bin/sh

set -eu

echo "Generating Prisma client..."
npx prisma generate

echo "Pushing Prisma schema to MongoDB..."
npx prisma db push --accept-data-loss

if [ "${SEED_BACKUP_IF_EMPTY:-1}" = "1" ]; then
  echo "Seeding MongoDB from backup if the database is empty..."
  node scripts/import-backup-to-mongo.mjs --if-empty --backup "${BACKUP_PATH:-db_cluster-14-04-2025@08-20-25.backup.gz}"
fi

exec "$@"
