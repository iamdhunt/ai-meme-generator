"use client";

import { useState } from "react";

import { generateCaptions } from "@/actions/generate-captions";
import { memeTemplates } from "@/data/meme-template-imgs";
import { vibesCategories } from "@/data/vibes-categories";
import { toneOptions } from "@/data/tone-options";

import Vibes from "./vibes";
import Tones from "./tones";
import MemeTemplates from "./meme-templates";
import MemePreviewEditor from "./meme-preview-editor";
import MemePreviewEditor1 from "./meme-preview-editor1";
import CaptionControls from "./caption-controls";

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

  // step visibility flags — once unlocked they remain visible
  const [showToneSection, setShowToneSection] = useState<boolean>(false);
  const [showCaptionSection, setShowCaptionSection] = useState<boolean>(false);
  const [showTemplatesSection, setShowTemplatesSection] =
    useState<boolean>(false);
  const [showPreviewSection, setShowPreviewSection] = useState<boolean>(false);

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

  // handlers that unlock steps (they set both the selection and the "shown" flag)
  const handleSelectVibe = (vibeId: string | null) => {
    setSelectedVibe(vibeId);
    if (vibeId && !showToneSection) setShowToneSection(true);
  };

  const handleSelectTone = (toneId: string | null) => {
    setSelectedTone(toneId);
    if (toneId && !showCaptionSection) setShowCaptionSection(true);
  };

  const handleSelectTemplate = (templateId: string | null) => {
    setSelectedTemplateId(templateId);
    if (templateId && !showPreviewSection) setShowPreviewSection(true);
  };

  const handleGenerate = async () => {
    if (!selectedVibe || !selectedTone) return;

    // clear any current caption selection and mark loading
    setSelectedCaptionIndex(null);
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
      // captions were successfully generated — unlock templates step
      if (!showTemplatesSection) setShowTemplatesSection(true);
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
      {/* vibe selection */}
      <section className="">
        <h1 className="text-center font-bebas text-4xl">1. Choose a Vibe</h1>
        <Vibes
          vibes={vibesCategories}
          selectedVibe={selectedVibe}
          onSelectVibe={handleSelectVibe}
        />
      </section>

      {/* tone selection */}
      {showToneSection && (
        <section className="mt-20 grow-in">
          <h1 className="text-center font-bebas text-4xl">2. Select a Tone</h1>

          <Tones
            tones={toneOptions}
            selectedTone={selectedTone}
            onSelectTone={handleSelectTone}
          />
        </section>
      )}

      {/* selected vibe and tone display */}
      {showCaptionSection && (
        <section className="mt-20 grow-in">
          <h1 className="text-center font-bebas text-4xl">
            3. Select a Caption
          </h1>
          <CaptionControls
            selectedVibeLabel={selectedVibeLabel}
            selectedToneLabel={selectedToneLabel}
            hasSelectedVibe={Boolean(selectedVibe)}
            hasSelectedTone={Boolean(selectedTone)}
            isGenerateDisabled={isGenerateDisabled}
            isLoading={isLoading}
            error={error}
            captions={captions}
            selectedCaptionIndex={selectedCaptionIndex}
            onGenerate={handleGenerate}
            onSelectCaption={setSelectedCaptionIndex}
            onClearVibe={() => setSelectedVibe(null)}
            onClearTone={() => setSelectedTone(null)}
          />
        </section>
      )}

      {/* meme templates */}
      {showTemplatesSection && (
        <section className="mt-20 grow-in">
          <h1 className="text-center font-bebas text-4xl">4. Pick a Meme</h1>
          <MemeTemplates
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleSelectTemplate}
          />
        </section>
      )}

      {/* meme preview */}
      {showPreviewSection && (
        <section className="mt-20 grow-in">
          <h1 className="text-center font-bebas text-4xl">
            5. Preview Your Meme
          </h1>
          <div className="mt-4">
            {selectedTemplate ? (
              <MemePreviewEditor1
                imageSrc={selectedTemplate.src}
                alt={selectedTemplate.alt}
                initialText={selectedCaption}
                watermarkSrc="/logos/Brand-Logo-Wave-White-Retina.png"
              />
            ) : (
              <div className="mx-auto flex h-80 items-center justify-center">
                <p className="text-neutral-300 text-center px-4">
                  Select an image to start customizing your meme.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
