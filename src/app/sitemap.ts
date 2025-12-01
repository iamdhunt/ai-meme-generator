// app/sitemap.ts
import { APP_URL } from "@/config/share-config";

export default function sitemap() {
  return [
    {
      url: APP_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
