import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const uploadsDir = process.env.UPLOADS_DIR || "/root/server/uploads";
const dryRun = process.argv.includes("--dry-run");

const models = [
  ["background", "image"],
  ["banner", "image"],
  ["bannerSort", "image"],
  ["category", "image"],
  ["license", "image"],
  ["news", "image"],
  ["partner", "image"],
  ["product", "image"],
  ["sertificate", "image"],
];

function stripServerSuffix(filename) {
  return filename.replace(/-\d{16}(?=\.[^.]+$)/, "");
}

function basenameFromValue(value) {
  if (!value || typeof value !== "string") return null;

  if (value.startsWith("/images/")) {
    return path.basename(value);
  }

  try {
    const url = new URL(value);
    return path.basename(url.pathname);
  } catch {
    return path.basename(value);
  }
}

function toStoredPath(filename) {
  return `/images/${filename}`;
}

function normalizeValue(value, strippedMap) {
  if (!value || typeof value !== "string") {
    return { changed: false, value };
  }

  if (value.startsWith("/images/")) {
    return { changed: false, value };
  }

  const base = basenameFromValue(value);
  if (!base) {
    return { changed: false, value };
  }

  const matches = (strippedMap.get(base) || []).sort(
    (left, right) => right.mtimeMs - left.mtimeMs
  );
  if (!matches.length) {
    return { changed: false, value, unmatched: true, matches: [] };
  }

  const nextValue = toStoredPath(matches[0].filename);
  return { changed: nextValue !== value, value: nextValue };
}

async function main() {
  if (!fs.existsSync(uploadsDir)) {
    throw new Error(`Uploads directory not found: ${uploadsDir}`);
  }

  const strippedMap = new Map();
  for (const filename of fs.readdirSync(uploadsDir)) {
    const fullPath = path.join(uploadsDir, filename);
    const stats = fs.statSync(fullPath);
    const stripped = stripServerSuffix(filename);
    if (!strippedMap.has(stripped)) strippedMap.set(stripped, []);
    strippedMap.get(stripped).push({
      filename,
      mtimeMs: stats.mtimeMs,
    });
  }

  const summary = {
    uploadsDir,
    dryRun,
    updatedRows: 0,
    updatedValues: 0,
    filteredValues: 0,
    unmatchedValues: 0,
    byModel: {},
  };

  for (const [modelName, fieldName] of models) {
    const delegate = prisma[modelName];
    const rows = await delegate.findMany({
      select: { id: true, [fieldName]: true },
    });

    let updatedRows = 0;
    let updatedValues = 0;
    let filteredValues = 0;
    let unmatchedValues = 0;
    const unmatchedExamples = [];

    for (const row of rows) {
      const current = row[fieldName];
      const values = Array.isArray(current) ? current : [current];
      let rowChanged = false;

      const nextValues = values.map((value) => {
        const normalized = normalizeValue(value, strippedMap);
        if (normalized.unmatched) {
          unmatchedValues += 1;
          if (unmatchedExamples.length < 10) {
            unmatchedExamples.push({
              id: row.id,
              value,
              matches: normalized.matches.map((item) => item.filename),
            });
          }
        }
        if (normalized.changed) {
          rowChanged = true;
          updatedValues += 1;
        }
        return normalized.value;
      });

      const hasLocalImage = nextValues.some(
        (value) => typeof value === "string" && value.startsWith("/images/")
      );

      const compactValues =
        Array.isArray(current) && hasLocalImage
          ? nextValues.filter(
              (value) =>
                !(
                  typeof value === "string" &&
                  value.includes("supabase.co/storage")
                )
            )
          : nextValues;

      if (Array.isArray(current) && compactValues.length !== nextValues.length) {
        rowChanged = true;
        filteredValues += nextValues.length - compactValues.length;
      }

      if (!rowChanged) continue;

      updatedRows += 1;

      if (!dryRun) {
        await delegate.update({
          where: { id: row.id },
          data: {
            [fieldName]: Array.isArray(current) ? compactValues : compactValues[0],
          },
        });
      }
    }

    summary.updatedRows += updatedRows;
    summary.updatedValues += updatedValues;
    summary.filteredValues += filteredValues;
    summary.unmatchedValues += unmatchedValues;
    summary.byModel[modelName] = {
      updatedRows,
      updatedValues,
      filteredValues,
      unmatchedValues,
      unmatchedExamples,
    };
  }

  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
