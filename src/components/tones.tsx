import { toneOptions } from "@/data/tone-options";
import { ToneOptions } from "@/types/types";

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
  return (
    <>
      <h1 className="text-center">2. Select a Tone</h1>
      <div className="flex flex-wrap justify-center">
        {toneOptions.map((tone) => {
          const isSelected = tone.id === selectedTone;
          return (
            <button
              key={tone.id}
              type="button"
              onClick={() =>
                isSelected ? onSelectTone(null) : onSelectTone(tone.id)
              }
              className={[
                "m-2 p-4 border rounded hover:bg-gray-200 hover:cursor-pointer hover:text-black",
                isSelected ? "bg-gray-200 text-black" : "",
              ].join(" ")}
              title={tone.tooltip}
            >
              {tone.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
