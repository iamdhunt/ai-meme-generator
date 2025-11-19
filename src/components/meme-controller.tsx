"use client";

import { useState } from "react";

import { memeTemplates } from "@/data/meme-template-imgs";
import Vibes from "./vibes";
import { vibesCategories } from "@/data/vibes-categories";
import Tones from "./tones";
import { toneOptions } from "@/data/tone-options";

export default function MemeController() {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const selectedVibeLabel = vibesCategories.find(
    (vibe) => vibe.id === selectedVibe
  )?.label;

  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const selectedToneLabel = toneOptions.find(
    (tone) => tone.id === selectedTone
  )?.label;

  return (
    <>
      <section className="">
        <Vibes
          vibes={vibesCategories}
          selectedVibe={selectedVibe}
          onSelectVibe={setSelectedVibe}
        />
      </section>

      <section className="mt-10">
        <Tones
          tones={toneOptions}
          selectedTone={selectedTone}
          onSelectTone={setSelectedTone}
        />
      </section>

      <section className="mt-10">
        <div>
          <span>{selectedVibeLabel}</span>
          <span>{selectedTone && selectedVibe ? " + " : ""}</span>
          <span>{selectedToneLabel}</span>
        </div>
        <div>
          <button className="ml-4 p-2 border rounded hover:bg-red-500 hover:text-white">
            Generate Captions
          </button>
        </div>
      </section>
    </>
  );
}
