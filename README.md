# Infinite Meme Machine 3000

The Ultimate AI-Powered Meme Generator

Infinite Meme Machine 3000 is a fully armed computational comedy reactor.  
Feed it vibes, choose your tone, pick a template, and watch it spit out premium internet nonsense at unsafe speeds.  
Fast, fun, and dangerously easy to use.

Live Demo: https://mememachine3000.com  
Tech Stack: **Next.js 14 (App Router), TypeScript, AI SDK, Web Share API, Canvas Rendering**

---

## Features

### AI Caption Generator

- Generate 3 unique meme captions instantly
- Vibe + tone system powered by custom categories
- Optimized prompts with clean token usage

### Meme Template Picker

- Choose from a curated selection of high-quality meme templates
- Efficient loading via public assets
- Click-to-preview & drag-to-position captions on the canvas

### Canvas Meme Editor

- Realtime meme rendering using `<canvas>`
- Drag, position, and scale captions
- Text effects (stroke, shadow, glow)
- Auto-fit caption sizing with intelligent line wrapping

### Export & Sharing Tools

- Export HD PNG memes
- Share directly via the Web Share API (where supported)
- Automatic fallback messaging for unsupported browsers

### Rate Limiting

- Daily + short-window limits using custom Next.js middleware
- Friendly error messages for over-users and chaos goblins

### SEO + PWA Ready

- Full metadata setup with dynamic Open Graph tags
- `manifest.json` with full icon set
- `robots.txt` & `sitemap.xml` automatically generated
- Installable as a native-feeling web app

---

## Tech Stack

- **Next.js 14** (App Router)
- **React** with Client + Server components
- **TypeScript**
- **AI SDK (OpenAI via @ai-sdk/openai)**
- **Canvas API** for high-resolution rendering
- **Web Share API**
- **TailwindCSS** (optional depending on final UI)
- **PWA-ready configuration**
- **Vercel Deployment**

---

## Environment Variables

Create `.env.local`:

OPENAI_API_KEY=your_openai_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

---

## PWA Support

- /app/manifest.json
- Full icon set (192, 512, 1024, maskable)
- Dark theme: #0a0a0a
- Installable on mobile & desktop
- Splash screens + adaptive icons

---

## Future Improvements (Roadmap)

- User accounts + saved memes
- More text effects (outlines, gradients)
- Public image search & import
- Motion memes / gif support
- Social timeline feed for created memes
- Multi-language caption generation

---

## License

MIT — free for personal and commercial use.
Give credit if you fork something substantial.

---

## Credits

Built by Dario Hunt
Brand: LIVING LIFE FEARLESS
App: Infinite Meme Machine 3000

---
