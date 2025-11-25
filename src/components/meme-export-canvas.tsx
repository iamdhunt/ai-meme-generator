"use client";

import { useEffect, useRef } from "react";
import type { CaptionPosition, TextEffect } from "./meme-preview-editor1";
import { getContainSize, drawCaption, drawWatermark } from "@/lib/meme-render";

type MemeExportCanvasProps = {
  imageUrl: string | null;
  caption: string | null;
  baseWidth?: number;
  baseHeight?: number;
  textEffect: TextEffect;
  fontScale: number;
  captionPosition: CaptionPosition;
  watermarkSrc?: string;
  onReadyToDownload?: (getDataUrl: () => string) => void;
};

export default function MemeExportCanvas({
  imageUrl,
  caption,
  baseWidth = 700,
  baseHeight = 700,
  textEffect,
  fontScale,
  captionPosition,
  watermarkSrc,
  onReadyToDownload,
}: MemeExportCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    let cancelled = false;

    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageUrl;

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject();
      });

      if (cancelled) return;

      const { drawWidth, drawHeight } = getContainSize(
        image.width,
        image.height,
        baseWidth,
        baseHeight
      );

      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = drawWidth * devicePixelRatio;
      canvas.height = drawHeight * devicePixelRatio;

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, drawWidth, drawHeight);

      // draw image stretched to export canvas
      ctx.drawImage(image, 0, 0, drawWidth, drawHeight);

      if (caption && caption.trim().length > 0) {
        await drawCaption(
          ctx,
          caption,
          drawWidth,
          drawHeight,
          0,
          0,
          textEffect,
          fontScale,
          captionPosition,
          { showBoundingBox: false }
        );
      }

      if (watermarkSrc) {
        const watermarkImage = new Image();
        watermarkImage.src = watermarkSrc;
        watermarkImage.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          watermarkImage.onload = () => resolve();
          watermarkImage.onerror = () => reject();
        });

        if (!cancelled) {
          drawWatermark(ctx, watermarkImage, 0, 0, drawWidth, drawHeight);
        }
      }

      if (onReadyToDownload) {
        const getDataUrl = () => {
          if (!canvasRef.current) return "";
          return canvasRef.current.toDataURL("image/png");
        };
        onReadyToDownload(getDataUrl);
      }
    };

    render().catch((err) => {
      console.error("Error rendering export canvas", err);
    });

    return () => {
      cancelled = true;
    };
  }, [
    imageUrl,
    caption,
    baseWidth,
    baseHeight,
    textEffect,
    fontScale,
    captionPosition,
    watermarkSrc,
    onReadyToDownload,
  ]);

  return <canvas ref={canvasRef} className="hidden" />;
}
