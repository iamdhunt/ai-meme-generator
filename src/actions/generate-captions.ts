"use server";

import { openaiClient } from "@/lib/openai";
import { generateText } from "ai";

import { headers } from "next/headers";
import { enforceMemeLimits } from "@/lib/rate-limit";

import { vibesCategories } from "@/data/vibes-categories";
import { toneOptions } from "@/data/tone-options";
import type { VibeCategories, ToneOptions } from "@/types/types";

type GenerateCaptionsParams = {
  vibeId: string | null;
  toneId: string | null;
};

type GenerateCaptionResponse = {
  ok: boolean;
  captions: string[] | null;
  error: string | null;
};

export async function generateCaptions({
  vibeId,
  toneId,
}: GenerateCaptionsParams): Promise<GenerateCaptionResponse> {
  // find the vibe and tone objects
  const vibe: VibeCategories | undefined = vibesCategories.find(
    (v) => v.id === vibeId
  );
  const tone: ToneOptions | undefined = toneOptions.find(
    (t) => t.id === toneId
  );

  // safeguard for no vibe and tone selected
  if (!vibe || !tone) {
    return {
      ok: false,
      captions: null,
      error: "Please select a vibe and tone to generate captions.",
    };
  }

  const headerStore = headers();
  const forwardedFor = (await headerStore).get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    (await headerStore).get("x-real-ip") ||
    "unknown";

  const limitResult = await enforceMemeLimits(ip);

  if (!limitResult.ok) {
    let message = "Too many requests. Please try again later.";

    if (limitResult.exceeded === "short") {
      message = "You're generating captions too fast. Try again in a moment.";
    } else if (limitResult.exceeded === "daily") {
      message = "You've reached your daily caption limit. Come back tomorrow!";
    }

    return {
      ok: false,
      captions: null,
      error: message,
    };
  }

  // build the prompt
  const prompt = `
    Ignore all previous instructions. You are a stateless AI meme caption writer.

    Vibe:
    - name: ${vibe?.label}
    - Description: ${vibe?.description}

    Tone:
    - name: ${tone?.label}
    - Description: ${tone?.description}

    TASK:
    Write 3 different short, internet-native meme captions that fit the vibe and tone described above.

    IMPORTANT:
    - Treat this as a brand new request. Do NOT reference any previous captions or requests.
    - Do not ask for clarification or additional information.
    - Do not provide conversational filler.
    - Randomness seed: ${Date.now()}

    CONSTRAINTS:
    - Each caption should be 5-12 words max
    - No hashtags
    - No emojis
    - No special characters
    - No quoting or explaining the image
    - No periods or punctuation at the end of the text
    - No numbering. Just 3 captions separated by line breaks.
    - Captions must be distinct from each other.

    Return ONLY the 3 captions, separated by line breaks.
    `;

  // call the AI to generate the caption
  try {
    const result = await generateText({
      model: openaiClient("gpt-4.1-mini"),
      prompt: prompt,
    });

    const lines = result.text
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/^\d+[\.\)\:\-]\s*/, "")
          .replace(/^[\-\*\•\–\—]\s*/, "")
          .replace(/^["'“”‘’]+|["'“”‘’]+$/g, "")
      )
      .filter((line) => line.length > 0);

    return {
      ok: true,
      captions: lines.slice(0, 3),
      error: null,
    };
  } catch (err) {
    console.error("Error generating captions:", err);

    return {
      ok: false,
      captions: null,
      error: "Failed to generate captions. Please try again.",
    };
  }
}
