"use client";

import { useState } from "react";

import { generateCaptions } from "@/actions/generate-captions";
import { memeTemplates } from "@/data/meme-template-imgs";
import { vibesCategories } from "@/data/vibes-categories";
import { toneOptions } from "@/data/tone-options";

import Vibes from "./vibes";
import Tones from "./tones";

export default function MemeController() {
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  const [captions, setCaptions] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedVibeLabel = vibesCategories.find(
    (vibe) => vibe.id === selectedVibe
  )?.label;

  const selectedToneLabel = toneOptions.find(
    (tone) => tone.id === selectedTone
  )?.label;

  const handleGenerate = async () => {
    if (!selectedVibe || !selectedTone) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateCaptions({
        vibeId: selectedVibe,
        toneId: selectedTone,
      });

      if (!response.ok) {
        setCaptions(null);
        setError(response.error ?? "Something went wrong. Try again.");
        return;
      }

      setCaptions(response.captions);
    } catch (err) {
      console.error("Unexpected error calling generateCaptions:", err);
      setCaptions(null);
      setError("Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = !selectedVibe || !selectedTone || isLoading;

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
        {/* selected vibe and tone display */}
        <div>
          <span>{selectedVibeLabel}</span>
          <span>{selectedTone && selectedVibe ? " + " : ""}</span>
          <span>{selectedToneLabel}</span>
        </div>

        {/* generate button */}
        <div>
          <button
            className="ml-4 p-2 border rounded hover:bg-red-500 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
            disabled={isGenerateDisabled}
            onClick={handleGenerate}
          >
            {isLoading ? "Generating..." : "Generate Captions"}
          </button>
        </div>

        {/* error state display */}
        {error && <p className="mt-4 text-center">{error}</p>}

        {/* caption display */}
        {captions && !error && (
          <p className="mt-6 text-center">
            {captions.map((caption, i) => (
              <p key={i} className="">
                {caption}
              </p>
            ))}
          </p>
        )}
      </section>
    </>
  );
}
