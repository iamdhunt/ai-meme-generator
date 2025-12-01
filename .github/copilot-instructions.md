# AI Coding Instructions for ai-meme-generator

## Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router), React 19, TypeScript.
- **Styling**: Tailwind CSS v4.
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/openai`), OpenAI.
- **State**: Upstash Redis / Ratelimit for API limits.
- **Meme Rendering**: Client-side HTML5 Canvas (`src/lib/meme-render.ts`).

## Core Workflows

### 1. Meme Generation (Canvas)

- **Logic**: Located in `src/lib/meme-render.ts`.
- **Fonts**: "Bebas Neue" is the primary meme font. Ensure it's loaded before drawing.
- **Text Handling**: Use `wrapAndDrawText` for multi-line captions. Supports effects: `shadow`, `glow`, `stroke`.
- **Coordinate System**: Captions use percentage-based positioning (`xPercent`, `yPercent`) relative to the image, not absolute pixels.

### 2. AI Captions (Server Actions)

- **Path**: `src/actions/generate-captions.ts`.
- **Pattern**: Use Next.js Server Actions (`"use server"`).
- **Rate Limiting**: ALWAYS enforce limits using `enforceMemeLimits(ip)` before calling OpenAI.
- **Prompting**: Stateless prompts. Inject `vibe` and `tone` descriptions. Output raw text lines, no JSON.

## Project Structure & Conventions

- `src/actions/`: Server Actions (backend logic).
- `src/components/`: UI components. `meme-canvas.tsx` handles the `<canvas>` element, delegating drawing to `lib/meme-render.ts`.
- `src/data/`: Static configuration (vibes, tones, templates).
- `src/lib/`: Shared utilities (OpenAI client, rate limiter, canvas logic).
- `src/types/`: Shared TypeScript interfaces (`MemeTemplate`, `VibeCategories`).

## Critical Implementation Details

- **Canvas Drawing**: When modifying drawing logic, update `src/lib/meme-render.ts`. Do not put complex canvas logic in React components.
- **Fonts**: Use `document.fonts.load` to ensure fonts are ready before `ctx.fillText`.
- **Images**: `MemeTemplate` images are stored in `public/memes/`.
- **Rate Limiting**: Uses `x-forwarded-for` or `x-real-ip` headers to identify users.

## Common Tasks

- **Adding a new Vibe/Tone**: Update `src/data/vibes-categories.tsx` or `tone-options.tsx`.
- **Modifying AI Prompts**: Edit the prompt template in `src/actions/generate-captions.ts`.
- **Styling**: Use Tailwind utility classes. Global styles in `src/app/globals.css`.
