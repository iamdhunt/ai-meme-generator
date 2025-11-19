import { vibesCategories } from "@/data/vibes-categories";

export default function Vibes() {
  return (
    <>
      <h1 className="text-center">1. Choose a Vibe</h1>
      <div className="flex flex-wrap justify-center">
        {vibesCategories.map((vibe) => (
          <button
            key={vibe.id}
            className="m-2 p-4 border rounded hover:bg-gray-200"
            title={vibe.tooltip}
          >
            {vibe.label}
          </button>
        ))}
      </div>
    </>
  );
}
