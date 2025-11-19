import { toneOptions } from "@/data/tone-options";

export default function Tones() {
  return (
    <>
      <h1 className="text-center">2. Select a Tone</h1>
      <div className="flex flex-wrap justify-center">
        {toneOptions.map((tone) => (
          <button
            key={tone.id}
            className="m-2 p-4 border rounded hover:bg-gray-200"
            title={tone.tooltip}
          >
            {tone.label}
          </button>
        ))}
      </div>
    </>
  );
}
