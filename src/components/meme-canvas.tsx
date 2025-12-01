"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { TextEffect, CaptionPosition } from "./meme-preview-editor1";
import { getContainSize, drawCaption, drawWatermark } from "@/lib/meme-render";

type MemeCanvasProps = {
  imageUrl: string | null;
  caption: string | null;
  width?: number;
  height?: number;
  textEffect: TextEffect;
  watermarkSrc?: string;
  captionPosition: CaptionPosition;
  onCaptionPositionChange: (position: CaptionPosition) => void;
  fontScale: number;
};

const CAPTION_HIT_RADIUS = 300;
const MAX_LINES_ESTIMATE = 3;

export default function MemeCanvas({
  imageUrl,
  caption,
  width = 700,
  height = 700,
  textEffect,
  watermarkSrc,
  captionPosition,
  onCaptionPositionChange,
  fontScale,
}: MemeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width, height });

  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const watermarkRef = useRef<HTMLImageElement | null>(null);
  const imageMetricsRef = useRef<{
    offsetX: number;
    offsetY: number;
    drawWidth: number;
    drawHeight: number;
  } | null>(null);

  /* ---------- responsive sizing ---------- */

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const containerWidth = container.offsetWidth;
      const aspectRatio = height / width;
      const newWidth = containerWidth;
      const newHeight = containerWidth * aspectRatio;
      setCanvasSize({ width: newWidth, height: newHeight });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, [width, height]);

  /* ---------- core render function (no image loading here) ---------- */

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const metrics = imageMetricsRef.current;

    if (!canvas || !image || !metrics) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width: currentWidth, height: currentHeight } = canvasSize;
    const { offsetX, offsetY, drawWidth, drawHeight } = metrics;

    // clear full logical canvas area
    ctx.clearRect(0, 0, currentWidth, currentHeight);

    // draw image in its contained area
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    // draw caption (with draggable box in preview)
    if (caption && caption.trim().length > 0) {
      await drawCaption(
        ctx,
        caption,
        drawWidth,
        drawHeight,
        offsetX,
        offsetY,
        textEffect,
        fontScale,
        captionPosition,
        { showBoundingBox: true }
      );
    }

    // watermark
    if (watermarkRef.current) {
      drawWatermark(
        ctx,
        watermarkRef.current,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight
      );
    }
  }, [caption, captionPosition, fontScale, textEffect, canvasSize]);

  /* ---------- mouse handlers (same behavior, but use metrics from ref) ---------- */

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageMetricsRef.current) return;

    const canvas = canvasRef.current;
    const { x, y } = getCanvasPointFromEvent(canvas, e);
    const { offsetX, offsetY, drawWidth, drawHeight } = imageMetricsRef.current;

    const captionX = offsetX + captionPosition.xPercent * drawWidth;
    const captionY = offsetY + captionPosition.yPercent * drawHeight;

    // estimate text block height so we can center hit area
    const baseFontSize = drawHeight * 0.08;
    const fontSize = baseFontSize * fontScale;
    const textBlockHeight = fontSize * MAX_LINES_ESTIMATE;
    const centerY = captionY + textBlockHeight / 2;

    const dxHit = x - captionX;
    const dyHit = y - centerY;

    if (
      dxHit * dxHit + dyHit * dyHit <=
      CAPTION_HIT_RADIUS * CAPTION_HIT_RADIUS
    ) {
      isDraggingRef.current = true;
      canvas.setPointerCapture(e.pointerId);

      // drag anchor still at top of text block
      const dx = x - captionX;
      const dy = y - captionY;
      dragOffsetRef.current = { dx, dy };

      canvas.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageMetricsRef.current) return;

    const canvas = canvasRef.current;
    const metrics = imageMetricsRef.current;
    const { offsetX, offsetY, drawWidth, drawHeight } = metrics;
    const { x, y } = getCanvasPointFromEvent(canvas, e);

    if (isDraggingRef.current) {
      canvas.style.cursor = "grabbing";

      const { dx, dy } = dragOffsetRef.current;
      const rawX = x - dx;
      const rawY = y - dy;

      const clampedX = Math.min(offsetX + drawWidth, Math.max(offsetX, rawX));

      const baseFontSize = drawHeight * 0.08;
      const fontSize = baseFontSize * fontScale;
      const textBlockHeight = fontSize * MAX_LINES_ESTIMATE;

      const minY = offsetY;
      const maxY = offsetY + drawHeight - textBlockHeight;
      const clampedY = Math.min(maxY, Math.max(minY, rawY));

      const xPercent = (clampedX - offsetX) / drawWidth;
      const yPercent = (clampedY - offsetY) / drawHeight;

      onCaptionPositionChange({ xPercent, yPercent });
      return;
    }

    // hover cue
    const captionX = offsetX + captionPosition.xPercent * drawWidth;
    const captionY = offsetY + captionPosition.yPercent * drawHeight;

    const baseFontSize = drawHeight * 0.08;
    const fontSize = baseFontSize * fontScale;
    const textBlockHeight = fontSize * MAX_LINES_ESTIMATE;
    const centerY = captionY + textBlockHeight / 2;

    const dxHover = x - captionX;
    const dyHover = y - centerY;

    const isOverCaption =
      dxHover * dxHover + dyHover * dyHover <=
      CAPTION_HIT_RADIUS * CAPTION_HIT_RADIUS;

    canvas.style.cursor = isOverCaption ? "grab" : "default";
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "default";
      canvasRef.current.releasePointerCapture(e.pointerId);
    }
  };

  /* ---------- effect 1: load images + set up canvas once per URL/size ---------- */

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    let cancelled = false;

    const load = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width: currentWidth, height: currentHeight } = canvasSize;

      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = currentWidth * devicePixelRatio;
      canvas.height = currentHeight * devicePixelRatio;
      canvas.style.width = `${currentWidth}px`;
      canvas.style.height = `${currentHeight}px`;

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      // main image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
      });

      if (cancelled) return;

      imageRef.current = img;

      const metrics = getContainSize(
        img.width,
        img.height,
        currentWidth,
        currentHeight
      );
      imageMetricsRef.current = metrics;

      // watermark (optional)
      if (watermarkSrc) {
        const wm = new Image();
        wm.src = watermarkSrc;
        wm.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          wm.onload = () => resolve();
          wm.onerror = () => reject();
        });

        if (!cancelled) {
          watermarkRef.current = wm;
        }
      } else {
        watermarkRef.current = null;
      }

      // initial draw
      await renderCanvas();
    };

    load().catch((err) => {
      console.error("Error loading images for meme canvas", err);
    });

    return () => {
      cancelled = true;
    };
  }, [imageUrl, canvasSize, watermarkSrc, renderCanvas]);

  /* ---------- effect 2: redraw when text/effect/position/size change ---------- */

  useEffect(() => {
    // only redraw if image + metrics are ready
    if (!imageRef.current || !imageMetricsRef.current) return;
    renderCanvas();
  }, [caption, captionPosition, textEffect, fontScale, renderCanvas]);

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center bg-background"
    >
      <canvas
        ref={canvasRef}
        className="border border-neutral-700 bg-background"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
}

/* ---------- local helper ---------- */

function getCanvasPointFromEvent(
  canvas: HTMLCanvasElement,
  e: React.PointerEvent<HTMLCanvasElement>
) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x, y };
}
