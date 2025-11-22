"use client";

import { useState } from "react";

import { generateCaptions } from "@/actions/generate-captions";
import { memeTemplates } from "@/data/meme-template-imgs";
import { vibesCategories } from "@/data/vibes-categories";
import { toneOptions } from "@/data/tone-options";

import Vibes from "./vibes";
import Tones from "./tones";
import MemeTemplates from "./meme-templates";

export default function MemeController() {
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  const [captions, setCaptions] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedCaptionIndex, setSelectedCaptionIndex] = useState<
    number | null
  >(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const selectedVibeLabel = vibesCategories.find(
    (vibe) => vibe.id === selectedVibe
  )?.label;

  const selectedToneLabel = toneOptions.find(
    (tone) => tone.id === selectedTone
  )?.label;

  const selectedCaption =
    selectedCaptionIndex !== null && captions
      ? captions[selectedCaptionIndex]
      : null;

  const selectedTemplate =
    selectedTemplateId !== null
      ? memeTemplates.find((template) => template.id === selectedTemplateId) ??
        null
      : null;

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
        setSelectedCaptionIndex(null);
        setError(response.error ?? "Something went wrong. Try again.");
        return;
      }

      setCaptions(response.captions);
      setSelectedCaptionIndex(null);
    } catch (err) {
      console.error("Unexpected error calling generateCaptions:", err);
      setCaptions(null);
      setSelectedCaptionIndex(null);
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
      <section className="mt-20">
        <Tones
          tones={toneOptions}
          selectedTone={selectedTone}
          onSelectTone={setSelectedTone}
        />
      </section>
      <section className="mt-10">
        {/* selected vibe and tone display */}
        <div className="h-10 flex items-center justify-center gap-2">
          {(selectedVibe || selectedTone) && (
            <>
              {selectedVibe && <div className="label">{selectedVibeLabel}</div>}
              {selectedTone && selectedVibe && (
                <div className="text-white">+</div>
              )}
              {selectedTone && <div className="label">{selectedToneLabel}</div>}
            </>
          )}
        </div>

        {/* generate button */}
        <div className="mt-6">
          <button
            className="uppercase px-9 py-5 font-bold border-3 rounded hover:cursor-pointer hover:bg-foreground hover:text-black hover:border-foreground disabled:bg-none disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground disabled:hover:cursor-default transition-all ease-in-out duration-500"
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
          <div className="mt-8 flex flex-col items-center space-y-3">
            <p className="text-sm text-gray-200 mb-3 uppercase">
              3 captions generated - choose one:
            </p>

            {captions?.map((caption, i) => {
              const isSelected = selectedCaptionIndex === i;

              return (
                <label
                  key={i}
                  className={[
                    "w-full flex items-start gap-2 max-w-2xl mx-auto cursor-pointer border-2 rounded p-3 hover:bg-gray-200 hover:text-black hover:border-gray-200 transition-all ease-in-out duration-300",
                    isSelected ? "bg-gray-200 border-gray-200 text-black" : "",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="captionChoice"
                    className="mt-0.5 mr-2 peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-neutral-400 checked:bg-black checked:bg-clip-content checked:p-0.5 transition-all ease-in-out duration-300 [&:not(:checked):hover]:bg-slate-100"
                    checked={isSelected}
                    onChange={() => setSelectedCaptionIndex(i)}
                  />
                  <span className="text-sm uppercase font-bold">{caption}</span>
                </label>
              );
            })}
          </div>
        )}
      </section>

      {/* meme templates */}
      <section className="mt-20">
        <MemeTemplates
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={setSelectedTemplateId}
        />
      </section>
      <section className="mt-20">
        <div className="">
          {selectedTemplate ? (
            <div className="relative h-full w-full">
              <img
                src={selectedTemplate.src}
                alt={selectedTemplate.alt}
                className=""
              />

              {/* overlay the selected caption */}
              {selectedCaption && (
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 text-center font-black uppercase text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.95)]">
                  <span className="text-sm sm:text-base md:text-lg">
                    {selectedCaption}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-neutral-300 text-center px-4">
              Select a meme template above to see it previewed here.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
