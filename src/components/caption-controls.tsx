"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

type CaptionControlsProps = {
  selectedVibeLabel?: string;
  selectedToneLabel?: string;
  hasSelectedVibe: boolean;
  hasSelectedTone: boolean;
  isGenerateDisabled: boolean;
  isLoading: boolean;
  error: string | null;
  captions: string[] | null;
  selectedCaptionIndex: number | null;
  onGenerate: () => void;
  onSelectCaption: (index: number) => void;
  onClearVibe?: () => void;
  onClearTone?: () => void;
};

export default function CaptionControls({
  selectedVibeLabel,
  selectedToneLabel,
  hasSelectedVibe,
  hasSelectedTone,
  isGenerateDisabled,
  isLoading,
  error,
  captions,
  selectedCaptionIndex,
  onGenerate,
  onSelectCaption,
  onClearVibe,
  onClearTone,
}: CaptionControlsProps) {
  return (
    <>
      {/* selected vibe and tone display */}
      <div className="h-10 flex items-center justify-center gap-2">
        {(hasSelectedVibe || hasSelectedTone) && (
          <>
            {hasSelectedVibe && selectedVibeLabel && (
              <button
                type="button"
                className="label inline-flex items-center gap-2 hover:cursor-pointer"
                onClick={onClearVibe}
                aria-label={`Clear selected vibe ${selectedVibeLabel}`}
              >
                <FontAwesomeIcon icon={faCircleXmark} /> {selectedVibeLabel}
              </button>
            )}
            {hasSelectedTone && hasSelectedVibe && (
              <div className="text-white">+</div>
            )}
            {hasSelectedTone && selectedToneLabel && (
              <button
                type="button"
                className="label inline-flex items-center gap-2 hover:cursor-pointer"
                onClick={onClearTone}
                aria-label={`Clear selected tone ${selectedToneLabel}`}
              >
                <FontAwesomeIcon icon={faCircleXmark} /> {selectedToneLabel}
              </button>
            )}
          </>
        )}
      </div>

      {/* generate button */}
      <div className="mt-6">
        <button
          type="button"
          className="relative p-0 bg-transparent border-0 uppercase cursor-pointer select-none transition duration-200 ease-in-out group disabled:opacity-20 disabled:cursor-default disabled:pointer-events-none"
          disabled={isGenerateDisabled}
          onClick={onGenerate}
        >
          {/* shadow */}
          <span className="absolute inset-0 rounded-xl bg-black/25 transform translate-y-0.5 transition-transform duration-600 ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-1 group-active:translate-y-px"></span>

          {/* edge (gradient) */}
          <span className="absolute inset-0 rounded-xl bg-linear-to-l from-rose-900 via-rose-700 to-rose-900"></span>

          {/* front */}
          <span className="relative block px-9 py-5 rounded-xl text-white font-bold bg-[hsl(345,100%,46%)] transform -translate-y-1 transition-transform duration-600 ease-[cubic-bezier(.3,.7,.4,1)] group-hover:-translate-y-1.5 group-active:-translate-y-0.5">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-current animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating captions...
              </span>
            ) : (
              "Generate Captions"
            )}
          </span>
        </button>
      </div>

      {/* error state display */}
      {error && <p className="mt-4 text-center">{error}</p>}

      {/* caption display */}
      {captions && !error && (
        <div
          className="mt-8 flex flex-col items-center space-y-3"
          aria-busy={isLoading}
        >
          <p className="text-sm text-gray-200 mb-3 uppercase">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-current animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating captions...
              </span>
            ) : (
              "3 captions generated - choose one:"
            )}
          </p>

          {captions.map((caption, index) => {
            const isSelected = selectedCaptionIndex === index;

            return (
              <label
                key={index}
                className={[
                  "w-full flex items-start gap-2 max-w-2xl mx-auto cursor-pointer border-2 rounded p-3 hover:bg-gray-200 hover:text-black hover:border-gray-200 transition-all ease-in-out duration-300",
                  isSelected ? "bg-gray-200 border-gray-200 text-black" : "",
                  isLoading ? "opacity-50 pointer-events-none" : "",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="captionChoice"
                  className="mt-0.5 mr-2 peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 hover:border-neutral-400 checked:border-neutral-400 checked:bg-black checked:bg-clip-content checked:p-0.5 transition-all ease-in-out duration-300 [&:not(:checked):hover]:bg-slate-100"
                  checked={isSelected}
                  onChange={() => onSelectCaption(index)}
                  disabled={isLoading}
                />
                <span className="text-sm uppercase font-bold">{caption}</span>
              </label>
            );
          })}
        </div>
      )}
    </>
  );
}
