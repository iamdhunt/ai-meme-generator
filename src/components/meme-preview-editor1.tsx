"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import MemeCanvas from "./meme-canvas";
import MemeExportCanvas from "./meme-export-canvas";

type MemePreviewEditor1Props = {
  imageSrc: string;
  alt: string;
  initialText: string | null;
  watermarkSrc: string;
};

export type CaptionPosition = {
  xPercent: number;
  yPercent: number;
};

export type TextEffect = "shadow" | "glow" | "stroke" | "none";

export default function MemePreviewEditor1({
  imageSrc,
  alt,
  initialText,
  watermarkSrc,
}: MemePreviewEditor1Props) {
  const [textEffect, setTextEffect] = useState<TextEffect>("none");
  const [fontScale, setFontScale] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  const downloadGetterRef = useRef<(() => string) | null>(null);

  const [captionPosition, setCaptionPosition] = useState<CaptionPosition>({
    xPercent: 0.5,
    yPercent: 0.6,
  });

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const [isShareSupported, setIsShareSupported] = useState(false);

  const handleReadyToDownload = (getDataUrl: () => string) => {
    downloadGetterRef.current = getDataUrl;
  };

  const handleDownloadClick = () => {
    if (!downloadGetterRef.current) return;
    const dataUrl = downloadGetterRef.current();

    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "my-meme.png";
    link.click();
  };

  const handleReset = () => {
    setCaptionPosition({ xPercent: 0.5, yPercent: 0.6 });
    setFontScale(1);
    setTextEffect("none");
  };

  const handleGenerateClick = () => {
    if (!downloadGetterRef.current) return;
    const dataUrl = downloadGetterRef.current();
    if (!dataUrl) return;

    setGeneratedUrl(dataUrl);
    setIsLightboxOpen(true);
  };

  const handleNativeShare = async () => {
    if (!generatedUrl) return;
    if (typeof navigator === "undefined" || !("share" in navigator)) {
      console.warn("Web Share API not supported in this browser.");
      return;
    }

    try {
      const response = await fetch(generatedUrl);
      const blob = await response.blob();

      const file = new File([blob], "my-meme.png", {
        type: blob.type || "image/png",
      });

      const nav = navigator as any;
      if (nav.canShare && !nav.canShare({ files: [file] })) {
        console.warn(
          "This browser/device cannot share files via Web Share API."
        );
        return;
      }

      await nav.share({
        files: [file],
        title: "Infinite Meme Generator 3000",
        text: initialText ?? "I let an AI help me meme. This happened.",
      });
    } catch (error) {
      console.error("Native image share failed:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setIsShareSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLightboxOpen]);

  return (
    <>
      <div className="space-y-4 md:flex md:gap-8 md:space-y-0 md:items-center md:justify-center">
        <div>
          <MemeCanvas
            imageUrl={imageSrc}
            caption={initialText}
            width={700}
            height={700}
            textEffect={textEffect}
            watermarkSrc={watermarkSrc}
            captionPosition={captionPosition}
            onCaptionPositionChange={setCaptionPosition}
            fontScale={fontScale}
          />
        </div>

        {/* hidden export canvas */}
        <MemeExportCanvas
          imageUrl={imageSrc}
          caption={initialText}
          baseWidth={700}
          baseHeight={700}
          textEffect={textEffect}
          fontScale={fontScale}
          captionPosition={captionPosition}
          watermarkSrc={watermarkSrc}
          onReadyToDownload={handleReadyToDownload}
        />

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="uppercase text-sm tracking-wide text-neutral-400">
              Font Size
            </span>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.05}
              value={fontScale}
              className="hover:cursor-pointer"
              onChange={(e) => setFontScale(Number(e.target.value))}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="text-effect"
              value="shadow"
              className="peer sr-only"
              checked={textEffect === "shadow"}
              onChange={(e) => {
                if (e.target.checked) {
                  setTextEffect("shadow");
                } else {
                  if (textEffect === "shadow") {
                    setTextEffect("none");
                  }
                }
              }}
            />
            <div aria-hidden className="toggles" />
            <span className="uppercase text-sm tracking-wide text-neutral-400">
              Shadow
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="text-effect"
              value="glow"
              className="peer sr-only"
              checked={textEffect === "glow"}
              onChange={(e) => {
                if (e.target.checked) {
                  setTextEffect("glow");
                } else {
                  if (textEffect === "glow") {
                    setTextEffect("none");
                  }
                }
              }}
            />
            <div aria-hidden className="toggles" />
            <span className="uppercase text-sm tracking-wide text-neutral-400">
              Glow
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="text-effect"
              value="stroke"
              className="peer sr-only"
              checked={textEffect === "stroke"}
              onChange={(e) => {
                if (e.target.checked) {
                  setTextEffect("stroke");
                } else {
                  if (textEffect === "stroke") {
                    setTextEffect("none");
                  }
                }
              }}
            />
            <div aria-hidden className="toggles" />
            <span className="uppercase text-sm tracking-wide text-neutral-400">
              Stroke
            </span>
          </label>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-900 hover:cursor-pointer transition-all duration-200 ease-in-out"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-15">
        <button
          className="relative p-0 bg-transparent border-0 uppercase cursor-pointer select-none transition duration-200 ease-in-out group disabled:opacity-20 disabled:cursor-default disabled:pointer-events-none"
          type="button"
          onClick={handleGenerateClick}
          disabled={!imageSrc || !initialText}
        >
          {/* shadow */}
          <span className="absolute inset-0 rounded-xl bg-black/25 transform translate-y-0.5 transition-transform duration-600 ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-1 group-active:translate-y-px"></span>

          {/* edge gradient */}
          <span className="absolute inset-0 rounded-xl bg-linear-to-l from-rose-900 via-rose-700 to-rose-900"></span>

          {/* front */}
          <span className="relative block px-9 py-5 rounded-xl text-white font-bold bg-[hsl(345,100%,46%)] transform -translate-y-1 transition-transform duration-600 ease-[cubic-bezier(.3,.7,.4,1)] group-hover:-translate-y-1.5 group-active:-translate-y-0.5">
            Generate Meme
          </span>
        </button>
      </div>

      {mounted &&
        isLightboxOpen &&
        generatedUrl &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsLightboxOpen(false);
              }
            }}
          >
            <div
              className="relative max-w-3xl w-full mx-4 rounded-xl bg-neutral-950 border border-neutral-700 p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute right-1 top-2 rounded-full px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800 hover:cursor-pointer"
              >
                ✕
              </button>

              <div className="flex justify-center mb-4">
                <img
                  src={generatedUrl}
                  alt="Generated meme"
                  className="max-h-[70vh] max-w-full border border-neutral-800"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleNativeShare}
                  disabled={!isShareSupported || !generatedUrl}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-s font-semibold uppercase text-foreground hover:bg-emerald-700 hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
                >
                  Share
                </button>

                <div className="flex gap-2">
                  <a
                    href={generatedUrl}
                    download="my-meme.png"
                    title="Download meme"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-s font-semibold uppercase text-foreground hover:bg-indigo-700 hover:cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
