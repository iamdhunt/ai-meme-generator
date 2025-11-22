import type { VibeCategories } from "@/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

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
  return (
    <>
      <h1 className="text-center font-bebas text-4xl">1. Choose a Vibe</h1>
      <div className="flex flex-wrap justify-center mt-4">
        {vibes.map((vibe) => {
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
