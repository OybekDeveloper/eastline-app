import { describe, expect, it, vi } from "vitest";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

vi.mock("@/lib/api.services", () => ({
  getData: vi.fn(async (endpoint) => {
    if (endpoint === "/api/category") {
      return [
        {
          id: "c1",
          topCategoryId: "t1",
          updateAt: "2024-08-01T00:00:00.000Z",
        },
      ];
    }
    if (endpoint === "/api/product") {
      return [
        {
          id: "p1",
          categoryId: "c1",
          updateAt: "2024-08-02T00:00:00.000Z",
          image: ["https://example.com/p1.jpg"],
          name: "Test product",
        },
      ];
    }
    return [];
  }),
}));

describe("SEO utilities", () => {
  it("creates metadata with canonical and OpenGraph URLs", () => {
    const metadata = buildMetadata({
      title: "Test Page",
      description: "Description",
      path: "/test",
    });
    const canonical = absoluteUrl("/test");
    expect(metadata.alternates.canonical).toBe(canonical);
    expect(metadata.openGraph.url).toBe(canonical);
    expect(metadata.twitter.images?.length).toBeGreaterThan(0);
  });

  it("builds sitemap entries for static and dynamic routes", async () => {
    const sitemapModule = await import("@/app/sitemap");
    const entries = await sitemapModule.default();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain(absoluteUrl("/"));
    expect(urls).toContain(absoluteUrl("/about-us"));
    expect(
      urls.some((url) => url.includes("/t1/c1/p1"))
    ).toBe(true);
  });
});
