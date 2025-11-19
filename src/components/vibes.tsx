import type { VibeCategories } from "@/types/types";

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
      <h1 className="text-center">1. Choose a Vibe</h1>
      <div className="flex flex-wrap justify-center">
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
                "m-2 p-4 border rounded hover:bg-gray-200 hover:cursor-pointer hover:text-black",
                isSelected ? "bg-gray-200 text-black" : "",
              ].join(" ")}
              title={vibe.tooltip}
            >
              {vibe.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
