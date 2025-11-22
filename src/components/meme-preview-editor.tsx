"use client";

import { faL } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";

type MemePreviewEditorProps = {
  imageSrc: string;
  alt: string;
  initialText?: string | null;
  watermarkSrc: string;
  watermarkAlt?: string;
};

type Position = {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
};

export default function MemePreviewEditor({
  imageSrc,
  alt,
  initialText = "",
  watermarkSrc,
  watermarkAlt = "Watermark",
}: MemePreviewEditorProps) {
  const [caption, setCaption] = useState(initialText ?? "");
  const [fontSize, setFontSize] = useState<number>(28);
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 }); // centered
  const [isDragging, setIsDragging] = useState(false);

  const [hasShadow, setHasShadow] = useState<boolean>(false);
  const [hasGlow, setHasGlow] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);

  // track where the mouse and position started when drag began
  const dragStartMouseRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartPositionRef = useRef<Position | null>(null);

  const [textBoxWidth, setTextBoxWidth] = useState<number>(70);

  useEffect(() => {
    setCaption(initialText ?? "");
  }, [initialText]);

  // handle dragging logic
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (
        !containerRef.current ||
        !dragStartMouseRef.current ||
        !dragStartPositionRef.current
      )
        return;

      const containerRect = containerRef.current.getBoundingClientRect();

      const dx = event.clientX - dragStartMouseRef.current.x; // pixels moved horizontally
      const dy = event.clientY - dragStartMouseRef.current.y; // pixels moved vertically

      const deltaXPercent = (dx / containerRect.width) * 100;
      const deltaYPercent = (dy / containerRect.height) * 100;

      let newX = dragStartPositionRef.current.x + deltaXPercent;
      let newY = dragStartPositionRef.current.y + deltaYPercent;

      //   if (dragRef.current) {
      //     const captionRect = dragRef.current.getBoundingClientRect();
      //     const halfWidthPercent =
      //       (captionRect.width / 2 / containerRect.width) * 100;
      //     const halfHeightPercent =
      //       (captionRect.height / 2 / containerRect.height) * 100;

      //     const minX = halfWidthPercent;
      //     const maxX = 100 - halfWidthPercent;
      //     const minY = halfHeightPercent;
      //     const maxY = 100 - halfHeightPercent;

      //     newX = Math.min(maxX, Math.max(minX, newX));
      //     newY = Math.min(maxY, Math.max(minY, newY));
      //   } else {
      //     newX = Math.min(100, Math.max(0, newX));
      //     newY = Math.min(100, Math.max(0, newY));
      //   }

      newX = Math.min(100, Math.max(0, newX));
      newY = Math.min(100, Math.max(0, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDownOnCaption = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!containerRef.current) return;

    dragStartMouseRef.current = { x: event.clientX, y: event.clientY };

    dragStartPositionRef.current = { ...position };

    setIsDragging(true);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      {/* preview */}
      <div
        ref={containerRef}
        className="relative mx-auto h-full w-full max-w-xl overflow-hidden md:max-w-2xl md:w-2/3"
      >
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-contain"
        />

        {/* watermark overlay */}
        {watermarkSrc && (
          <img
            src={watermarkSrc}
            alt={watermarkAlt}
            className="pointer-events-none absolute bottom-2 right-2 h-10 w-auto opacity-70"
          />
        )}

        {caption && (
          <div
            ref={dragRef}
            onMouseDown={handleMouseDownOnCaption}
            className={[
              "absolute cursor-move select-none px-2 py-1 text-center uppercase font-black text-white border border-dashed z-10",
              hasShadow && "caption-shadow",
              hasGlow && "caption-glow",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              fontSize: `${fontSize}px`,
              top: `${position.y}%`,
              left: `${position.x}%`,
              transform: "translate(-50%, -50%)",
              width: `${textBoxWidth}%`,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {caption}
          </div>
        )}
      </div>

      {/* controls */}
      <div className="flex flex-col gap-5 w-full pr-8 md:w-1/3">
        <label className="flex items-center gap-3 text-sm">
          <span className="uppercase tracking-wide text-neutral-400 mr-1">
            Font Size
          </span>
          <input
            type="range"
            min={14}
            max={72}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="flex-1 hover:cursor-pointer"
          />
        </label>

        <label className="flex items-center gap-3 text-sm">
          <span className="uppercase tracking-wide text-neutral-400">
            Box Width
          </span>
          <input
            type="range"
            min={30}
            max={100}
            value={textBoxWidth}
            onChange={(e) => setTextBoxWidth(Number(e.target.value))}
            className="flex-1 hover:cursor-pointer"
          />
        </label>

        <div className="flex flex-row items-center justify-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasShadow}
              onChange={(e) => {
                const checked = e.target.checked;
                setHasShadow(checked);
                if (checked) {
                  setHasGlow(false);
                }
              }}
              className="peer sr-only"
            />
            <div aria-hidden className="toggles" />
            <span className="uppercase text-sm tracking-wide text-neutral-400">
              Shadow
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasGlow}
              onChange={(e) => {
                const checked = e.target.checked;
                setHasGlow(checked);
                if (checked) {
                  setHasShadow(false);
                }
              }}
              className="peer sr-only"
            />
            <div aria-hidden className="toggles" />
            <span className="uppercase text-sm tracking-wide text-neutral-400">
              Glow
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
