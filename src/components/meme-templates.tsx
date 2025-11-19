import { memeTemplates } from "@/data/meme-template-imgs";

export default function MemeTemplates() {
  return (
    <>
      <h1 className="text-center">3. Pick a Meme</h1>
      <div className="flex flex-wrap justify-center">
        {memeTemplates.map((template) => (
          <div key={template.id} className="flex-[1_1_150px]">
            <img
              src={template.src}
              alt={template.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
