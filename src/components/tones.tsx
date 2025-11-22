import { toneOptions } from "@/data/tone-options";
import { ToneOptions } from "@/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

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
      <h1 className="text-center font-bebas text-4xl">2. Select a Tone</h1>
      <div className="flex flex-wrap justify-center mt-4">
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
