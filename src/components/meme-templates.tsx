import { memeTemplates } from "@/data/meme-template-imgs";

export default function MemeTemplates() {
  return (
    <>
      <h1 className="text-center">3. Pick a Meme</h1>
      <div className="flex flex-wrap justify-center gap-2">
        {memeTemplates.map((template) => (
          <div
            key={template.id}
            className="flex-[1_1_200px] hover:cursor-pointer"
          >
            <img
              src={template.src}
              alt={template.alt}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </>
  );
}
