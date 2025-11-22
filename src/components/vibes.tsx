"use client";

import { useState } from "react";

import type { VibeCategories } from "@/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Shuffler from "@/utils/shuffler";

type VibeSelectorProps = {
  vibes: VibeCategories[];
  selectedVibe: string | null;
  onSelectVibe: (vibeId: string | null) => void;
};

export default function Vibes({
  vibes,
  selectedVibe,
  onSelectVibe,
}: VibeSelectorProps) {
  const [shuffledVibes] = useState(() => Shuffler(vibes));

  return (
    <>
      <div className="flex flex-wrap justify-center mt-4">
        {shuffledVibes.map((vibe) => {
          const isSelected = vibe.id === selectedVibe;

          return (
            <button
              key={vibe.id}
              type="button"
              onClick={() =>
                isSelected ? onSelectVibe(null) : onSelectVibe(vibe.id)
              }
              className={[
                "secondary-buttons",
                isSelected ? "bg-gray-200 text-black border-gray-200" : "",
              ].join(" ")}
              title={vibe.tooltip}
            >
              {isSelected && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="mr-1 text-black"
                />
              )}
              {vibe.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
