import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { PrismaClient } from "@prisma/client";

const DEFAULT_BACKUP_PATH = "db_cluster-14-04-2025@08-20-25.backup.gz";
const TARGET_TABLES = [
  'public."Admin"',
  'public."Background"',
  'public."Banner"',
  'public."BannerSort"',
  'public."Category"',
  'public."CategorySort"',
  'public."Contacts"',
  'public."Currency"',
  'public."License"',
  'public."News"',
  'public."Partner"',
  'public."Product"',
  'public."Reviews"',
  'public."SelectReview"',
  'public."Sertificate"',
  'public."TopCategory"',
  'public."TopCategorySort"',
];

function parseArgs(argv) {
  const options = {
    backup: process.env.BACKUP_PATH || DEFAULT_BACKUP_PATH,
    ifEmpty: false,
    force: false,
    summaryOnly: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--if-empty") {
      options.ifEmpty = true;
      continue;
    }
    if (arg === "--force") {
      options.force = true;
      continue;
    }
    if (arg === "--summary-only") {
      options.summaryOnly = true;
      continue;
    }
    if (arg === "--backup") {
      options.backup = argv[index + 1];
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function decodeCopyValue(value) {
  if (value === undefined || value === "\\N") {
    return null;
  }

  return value
    .replace(/\\\\/g, "\u0000")
    .replace(/\\t/g, "\t")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\v/g, "\v")
    .replace(/\\([0-7]{1,3})/g, (_, octal) =>
      String.fromCharCode(Number.parseInt(octal, 8))
    )
    .replace(/\u0000/g, "\\");
}

function parsePgArray(value) {
  if (!value || value === "{}") {
    return [];
  }

  const inner = value.startsWith("{") && value.endsWith("}")
    ? value.slice(1, -1)
    : value;

  const items = [];
  let current = "";
  let inQuotes = false;
  let isEscaped = false;

  for (const char of inner) {
    if (isEscaped) {
      current += char;
      isEscaped = false;
      continue;
    }
    if (char === "\\") {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      if (current.length > 0) {
        items.push(current);
      }
      current = "";
      continue;
    }
    current += char;
  }

  if (current.length > 0) {
    items.push(current);
  }

  return items.map((item) => item.trim()).filter(Boolean);
}

function parseDate(value) {
  if (!value) {
    return undefined;
  }

  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const withTimezone =
    /(?:Z|[+-]\d{2}(?::?\d{2})?)$/.test(normalized) ? normalized : `${normalized}Z`;
  const parsed = new Date(withTimezone);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function parseCopySections(sql) {
  const lines = sql.split(/\r?\n/);
  const tables = new Map();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^COPY ([^ ]+) \((.*)\) FROM stdin;$/);
    if (!match) {
      continue;
    }

    const tableName = match[1];
    if (!TARGET_TABLES.includes(tableName)) {
      while (index + 1 < lines.length && lines[index + 1] !== "\\.") {
        index += 1;
      }
      index += 1;
      continue;
    }

    const columns = match[2].split(",").map((column) => column.trim());
    const rows = [];

    for (index += 1; index < lines.length; index += 1) {
      const currentLine = lines[index];
      if (currentLine === "\\.") {
        break;
      }

      const values = currentLine.split("\t").map(decodeCopyValue);
      const row = {};

      columns.forEach((column, columnIndex) => {
        row[column] = values[columnIndex] ?? null;
      });

      rows.push(row);
    }

    tables.set(tableName, rows);
  }

  return tables;
}

function maybeMappedId(oldValue, mapping, label) {
  if (!oldValue || oldValue === "0") {
    return null;
  }

  const mappedValue = mapping.get(String(oldValue));
  if (!mappedValue) {
    console.warn(`Missing ${label} mapping for source ID: ${oldValue}`);
    return null;
  }

  return mappedValue;
}

async function clearDatabase(prisma) {
  await prisma.sortProduct.deleteMany();
  await prisma.categorySortTest.deleteMany();
  await prisma.categorySort.deleteMany();
  await prisma.bannerSort.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.selectReview.deleteMany();
  await prisma.reviews.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.topCategorySort.deleteMany();
  await prisma.topCategory.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.news.deleteMany();
  await prisma.license.deleteMany();
  await prisma.sertificate.deleteMany();
  await prisma.background.deleteMany();
  await prisma.contacts.deleteMany();
  await prisma.currency.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.productVisibility.deleteMany();
}

async function importDump(prisma, tables) {
  const topCategoryMap = new Map();
  const topCategorySortMap = new Map();
  const topCategorySortByTopCategoryMap = new Map();
  const categoryMap = new Map();
  const productMap = new Map();
  const bannerMap = new Map();
  const reviewMap = new Map();

  const resolveTopCategorySortId = (oldValue) => {
    if (!oldValue || oldValue === "0") {
      return null;
    }

    return (
      topCategorySortMap.get(String(oldValue)) ||
      topCategorySortByTopCategoryMap.get(String(oldValue)) ||
      null
    );
  };

  for (const row of tables.get('public."Admin"') || []) {
    await prisma.admin.create({
      data: {
        name: row.name,
        password: row.password,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."Background"') || []) {
    await prisma.background.create({
      data: {
        name: row.name,
        image: row.image,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."Contacts"') || []) {
    await prisma.contacts.create({
      data: {
        company_name: row.company_name,
        phone1: row.phone1,
        phone2: row.phone2,
        work_hours: row.work_hours,
        email: row.email,
        address: row.address,
        telegram: row.telegram,
        telegram_bot: row.telegram_bot,
        facebook: row.facebook,
        instagram: row.instagram,
        youtube: row.youtube,
        footer_info: row.footer_info,
        experience_info: row.experience_info,
        more_call_info: row.more_call_info,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."Currency"') || []) {
    await prisma.currency.create({
      data: {
        sum: row.sum,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."TopCategory"') || []) {
    const created = await prisma.topCategory.create({
      data: {
        name: row.name,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
    topCategoryMap.set(String(row.id), created.id);
  }

  for (const row of tables.get('public."TopCategorySort"') || []) {
    const created = await prisma.topCategorySort.create({
      data: {
        name: row.name,
        topCategoryId: maybeMappedId(
          row['"topCategoryId"'],
          topCategoryMap,
          "topCategory"
        ),
        uniqueId: row['"uniqueId"'] ? Number.parseInt(row['"uniqueId"'], 10) : null,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
    topCategorySortMap.set(String(row.id), created.id);
    if (row['"topCategoryId"']) {
      topCategorySortByTopCategoryMap.set(String(row['"topCategoryId"']), created.id);
    }
  }

  for (const row of tables.get('public."Category"') || []) {
    const created = await prisma.category.create({
      data: {
        name: row.name,
        image: row.image,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
        topCategoryId: maybeMappedId(
          row['"topCategoryId"'],
          topCategoryMap,
          "topCategory"
        ),
        topCategorySortId: maybeMappedId(
          row['"topCategorySortId"'],
          {
            get: (key) => resolveTopCategorySortId(key),
          },
          "topCategorySort"
        ),
      },
    });
    categoryMap.set(String(row.id), created.id);
  }

  for (const row of tables.get('public."CategorySort"') || []) {
    await prisma.categorySort.create({
      data: {
        name: row.name,
        uniqueId: Number.parseInt(row['"uniqueId"'], 10),
        categoryId: maybeMappedId(row['"categoryId"'], categoryMap, "category"),
        topCategorySortId: maybeMappedId(
          row['"topCategorySortId"'],
          {
            get: (key) => resolveTopCategorySortId(key),
          },
          "topCategorySort"
        ),
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."CategorySort"') || []) {
    await prisma.categorySortTest.create({
      data: {
        name: row.name,
        uniqueId: Number.parseInt(row['"uniqueId"'], 10),
        categoryId: maybeMappedId(row['"categoryId"'], categoryMap, "category"),
        topCategorySortId: maybeMappedId(
          row['"topCategorySortId"'],
          {
            get: (key) => resolveTopCategorySortId(key),
          },
          "topCategorySort"
        ),
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  const productRows = tables.get('public."Product"') || [];
  for (const row of productRows) {
    const created = await prisma.product.create({
      data: {
        name: row.name,
        description: row.description || "",
        feature: row.feature || "",
        price: row.price || "",
        brand: row.brand || "",
        image: parsePgArray(row.image),
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
        categoryId: maybeMappedId(row['"categoryId"'], categoryMap, "category"),
      },
    });
    productMap.set(String(row.id), created.id);
  }

  const productsByCategory = new Map();
  for (const row of productRows) {
    const sourceCategoryId = String(row['"categoryId"'] || "");
    if (!sourceCategoryId) {
      continue;
    }
    const group = productsByCategory.get(sourceCategoryId) || [];
    group.push(row);
    productsByCategory.set(sourceCategoryId, group);
  }

  for (const [sourceCategoryId, rows] of productsByCategory.entries()) {
    const categoryId = categoryMap.get(sourceCategoryId);
    if (!categoryId) {
      continue;
    }
    let uniqueId = 1;
    for (const row of rows) {
      const productId = productMap.get(String(row.id));
      if (!productId) {
        continue;
      }
      await prisma.sortProduct.create({
        data: {
          name: row.name,
          categoryId,
          productId,
          uniqueId,
          createdAt: parseDate(row['"createdAt"']),
        },
      });
      uniqueId += 1;
    }
  }

  for (const row of tables.get('public."Banner"') || []) {
    const created = await prisma.banner.create({
      data: {
        image: row.image,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
        topCategoryId: maybeMappedId(
          row['"topCategoryId"'],
          topCategoryMap,
          "topCategory"
        ),
        categoryId: maybeMappedId(row['"categoryId"'], categoryMap, "category"),
        productId: maybeMappedId(row['"productId"'], productMap, "product"),
      },
    });
    bannerMap.set(String(row.id), created.id);
  }

  for (const row of tables.get('public."BannerSort"') || []) {
    await prisma.bannerSort.create({
      data: {
        image: row.image,
        uniqueId: row['"uniqueId"'] ? Number.parseInt(row['"uniqueId"'], 10) : null,
        bannerId: maybeMappedId(row['"bannerId"'], bannerMap, "banner"),
        topCategoryId: maybeMappedId(
          row['"topCategoryId"'],
          topCategoryMap,
          "topCategory"
        ),
        categoryId: maybeMappedId(row['"categoryId"'], categoryMap, "category"),
        productId: maybeMappedId(row['"productId"'], productMap, "product"),
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."Partner"') || []) {
    await prisma.partner.create({
      data: {
        name: row.name,
        image: row.image,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."News"') || []) {
    await prisma.news.create({
      data: {
        name: row.name,
        image: row.image,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."License"') || []) {
    await prisma.license.create({
      data: {
        name: row.name,
        image: row.image,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."Sertificate"') || []) {
    await prisma.sertificate.create({
      data: {
        name: row.name,
        image: row.image,
        createdAt: parseDate(row['"createdAt"']),
        updateAt: parseDate(row['"updateAt"']),
      },
    });
  }

  for (const row of tables.get('public."Reviews"') || []) {
    const created = await prisma.reviews.create({
      data: {
        name: row.name,
        phone: row.phone || "",
        email: row.email || "",
        message: row.message || "",
        createdAt: parseDate(row['"createdAt"']),
      },
    });
    reviewMap.set(String(row.id), created.id);
  }

  for (const row of tables.get('public."SelectReview"') || []) {
    await prisma.selectReview.create({
      data: {
        name: row.name,
        phone: row.phone || "",
        email: row.email || "",
        message: row.message || "",
        reviewId: maybeMappedId(row['"reviewId"'], reviewMap, "review"),
        createdAt: parseDate(row['"createdAt"']),
      },
    });
  }

  const existingVisibility = await prisma.productVisibility.findFirst();
  if (!existingVisibility) {
    await prisma.productVisibility.create({
      data: {
        show: true,
      },
    });
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const backupPath = path.resolve(process.cwd(), options.backup);

  if (!existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }

  const sql = gunzipSync(readFileSync(backupPath)).toString("utf8");
  const tables = parseCopySections(sql);

  if (options.summaryOnly) {
    const summary = Object.fromEntries(
      Array.from(tables.entries()).map(([tableName, rows]) => [tableName, rows.length])
    );
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  const prisma = new PrismaClient();

  try {
    await prisma.$connect();

    const existingCounts = await Promise.all([
      prisma.topCategory.count(),
      prisma.category.count(),
      prisma.product.count(),
    ]);
    const hasExistingData = existingCounts.some((count) => count > 0);

    if (hasExistingData && options.ifEmpty) {
      console.log("Skip import: MongoDB already contains business data.");
      return;
    }

    if (hasExistingData && !options.force) {
      throw new Error(
        "MongoDB already contains data. Use --force to replace it or --if-empty to skip."
      );
    }

    if (hasExistingData && options.force) {
      console.log("Clearing existing MongoDB data...");
      await clearDatabase(prisma);
    }

    console.log(`Importing backup from ${backupPath}...`);
    await importDump(prisma, tables);

    const summary = {
      topCategories: await prisma.topCategory.count(),
      categories: await prisma.category.count(),
      products: await prisma.product.count(),
      partners: await prisma.partner.count(),
      news: await prisma.news.count(),
      banners: await prisma.banner.count(),
      reviews: await prisma.reviews.count(),
      selectedReviews: await prisma.selectReview.count(),
      storageDependency: "Images still point to the existing Supabase public URLs.",
    };

    console.log("MongoDB import completed.");
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
