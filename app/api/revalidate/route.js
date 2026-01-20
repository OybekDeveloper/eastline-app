// app/api/revalidate/route.js
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const ALL_TAGS = [
  "admin",
  "background",
  "banner",
  "category",
  "categorySort",
  "contact",
  "currency",
  "license",
  "news",
  "partner",
  "product",
  "product-visibility",
  "productSort",
  "review",
  "selectReview",
  "sertificate",
  "topCategory",
];

const ALL_PATHS = ["/", "/sitemap.xml", "/robots.txt"];

function assertSecret(url) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return { ok: true };
  }

  const provided = url.searchParams.get("secret");
  if (provided !== secret) {
    return { ok: false };
  }

  return { ok: true };
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const auth = assertSecret(url);

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: "Invalid secret" },
        { status: 401 }
      );
    }

    const tags = [...new Set(ALL_TAGS)];
    tags.forEach((tag) => revalidateTag(tag));
    revalidatePath("/", "layout");
    ALL_PATHS.filter((path) => path !== "/").forEach((path) =>
      revalidatePath(path)
    );

    return NextResponse.json({ success: true, tags, paths: ALL_PATHS });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { tag, all } = await req.json();

    if (all || tag === "all") {
      const tags = [...new Set(ALL_TAGS)];
      tags.forEach((currentTag) => revalidateTag(currentTag));
      revalidatePath("/", "layout");
      ALL_PATHS.filter((path) => path !== "/").forEach((path) =>
        revalidatePath(path)
      );
      return NextResponse.json({ success: true, tags, paths: ALL_PATHS });
    }

    if (!tag) {
      return NextResponse.json(
        { success: false, error: "Tag is required" },
        { status: 400 }
      );
    }
    console.log(tag);

    revalidateTag(tag);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
