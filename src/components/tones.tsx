"use client";

import { useState, useEffect } from "react";

import { ToneOptions } from "@/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Shuffler from "@/utils/shuffler";

type ToneSelectorProps = {
  tones: ToneOptions[];
  selectedTone: string | null;
  onSelectTone: (toneId: string | null) => void;
};

export default function Tones({
  tones,
  selectedTone,
  onSelectTone,
}: ToneSelectorProps) {
  const [shuffledTones, setShuffledTones] = useState(tones);

  useEffect(() => {
    setShuffledTones(Shuffler([...tones]));
  }, [tones]);

  return (
    <>
      <div className="flex flex-wrap justify-center mt-4">
        {shuffledTones.map((tone) => {
          const isSelected = tone.id === selectedTone;
          return (
            <button
              key={tone.id}
              type="button"
              onClick={() =>
                isSelected ? onSelectTone(null) : onSelectTone(tone.id)
              }
              className={[
                "secondary-buttons",
                isSelected ? "bg-gray-200 text-black" : "",
              ].join(" ")}
              title={tone.tooltip}
            >
              {isSelected && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="mr-1 text-black"
                />
              )}
              {tone.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
