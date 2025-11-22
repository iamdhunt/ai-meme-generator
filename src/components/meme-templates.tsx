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
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {memeTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template.id)}
              className={[
                "flex-none w-[150px] aspect-* overflow-hidden rounded-xl border-2 transition-all duration-300 hover:cursor-pointer",
                isSelected
                  ? "border-foreground ring-2 ring-foreground"
                  : "border-transparent hover:border-foreground",
              ].join(" ")}
            >
              <img
                src={template.src}
                alt={template.alt}
                className="w-full h-full object-cover hover:scale-110 transition-all ease-in-out duration-300"
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
