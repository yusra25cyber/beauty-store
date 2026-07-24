import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/account/", "/wishlist/", "/checkout/"],
    },
    sitemap: "https://beauty-store-21ulcd942-yusras-projects-6453f74d.vercel.app/sitemap.xml",
  };
}
