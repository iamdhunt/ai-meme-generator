import { APP_URL } from "@/config/share-config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
