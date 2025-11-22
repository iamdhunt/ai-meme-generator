import { memeTemplates } from "@/data/meme-template-imgs";
import Image from "next/image";

type MemeTemplatesProps = {
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
};

export default function MemeTemplates({
  selectedTemplateId,
  onSelectTemplate,
}: MemeTemplatesProps) {
  return (
    <>
      <h1 className="text-center font-bebas text-4xl">3. Pick a Meme</h1>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {memeTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template.id)}
              className={[
                "flex-[1_1_200px] overflow-hidden rounded-xl border-2 transition-all duration-300 hover:cursor-pointer",
                isSelected
                  ? "border-foreground ring-2 ring-purple"
                  : "border-transparent hover:border-neutral-500",
              ].join(" ")}
            >
              <img
                src={template.src}
                alt={template.alt}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
