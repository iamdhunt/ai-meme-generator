"use client";

import { useEffect, useRef } from "react";

import type { TextEffect } from "./meme-preview-editor1";
import type { CaptionPosition } from "./meme-preview-editor1";

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
  onReadyToDownload?: (getDataUrl: () => string) => void;
};

export default function MemeCanvas({
  imageUrl,
  caption,
  width = 600,
  height = 600,
  textEffect,
  watermarkSrc,
  captionPosition,
  onCaptionPositionChange,
  fontScale,
  onReadyToDownload,
}: MemeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const imageMetricsRef = useRef<{
    offsetX: number;
    offsetY: number;
    drawWidth: number;
    drawHeight: number;
  } | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvasRef.current || !imageMetricsRef.current) return;

    const canvas = canvasRef.current;
    const { x, y } = getCanvasPointFromEvent(canvasRef.current, e);
    const { offsetX, offsetY, drawWidth, drawHeight } = imageMetricsRef.current;

    // current caption position
    const captionX = offsetX + captionPosition.xPercent * drawWidth;
    const captionY = offsetY + captionPosition.yPercent * drawHeight;

    const hitRadius = 300;

    const dx = x - captionX;
    const dy = y - captionY;

    if (dx * dx + dy * dy <= hitRadius * hitRadius) {
      isDraggingRef.current = true;
      dragOffsetRef.current = { dx, dy };
      canvas.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvasRef.current || !imageMetricsRef.current) return;

    const canvas = canvasRef.current;
    const metrics = imageMetricsRef.current;
    const { offsetX, offsetY, drawWidth, drawHeight } = metrics;
    const { x, y } = getCanvasPointFromEvent(canvas, e);

    // DRAGGING: move caption + keep "grabbing" cursor
    if (isDraggingRef.current) {
      canvas.style.cursor = "grabbing";

      const { dx, dy } = dragOffsetRef.current;

      const rawX = x - dx;
      const rawY = y - dy;

      const clampedX = Math.min(offsetX + drawWidth, Math.max(offsetX, rawX));

      const baseFontSize = drawHeight * 0.08;
      const fontSize = baseFontSize * fontScale;
      const maxLines = 3;
      const textBlockHeight = fontSize * maxLines;

      const minY = offsetY;
      const maxY = offsetY + drawHeight - textBlockHeight;

      const clampedY = Math.min(maxY, Math.max(minY, rawY));

      const xPercent = (clampedX - offsetX) / drawWidth;
      const yPercent = (clampedY - offsetY) / drawHeight;

      onCaptionPositionChange({
        xPercent,
        yPercent,
      });

      return;
    }

    // NOT DRAGGING: just show hover cue (`grab` over caption)
    const captionX = offsetX + captionPosition.xPercent * drawWidth;
    const captionY = offsetY + captionPosition.yPercent * drawHeight;

    const dxHover = x - captionX;
    const dyHover = y - captionY;
    const hitRadius = 300;
    const isOverCaption =
      dxHover * dxHover + dyHover * dyHover <= hitRadius * hitRadius;

    canvas.style.cursor = isOverCaption ? "grab" : "default";
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "default";
    }
  };

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    let cancelled = false;

    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      // HiDPI support
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      let watermarkImage: HTMLImageElement | null = null;

      if (watermarkSrc) {
        watermarkImage = new Image();
        watermarkImage.src = watermarkSrc;
        watermarkImage.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          watermarkImage!.onload = () => resolve();
          watermarkImage!.onerror = () => reject();
        });
      }

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageUrl;

      // Wait for image to load
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject();
      });

      if (cancelled) return;

      // Clear canvas
      context.clearRect(0, 0, width, height);

      // Draw image, scaled to fit (contain)
      const metrics = getContainSize(image.width, image.height, width, height);
      const { drawWidth, drawHeight, offsetX, offsetY } = metrics;
      imageMetricsRef.current = metrics;

      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      // Draw caption with Bebas Neue
      if (caption && caption.trim().length > 0) {
        await drawCaption(
          context,
          caption,
          width,
          height,
          drawWidth,
          drawHeight,
          offsetX,
          offsetY,
          textEffect,
          fontScale,
          captionPosition
        );
      }

      // Draw watermark in bottom-right
      if (watermarkImage && watermarkImage.complete) {
        drawWatermark(
          context,
          watermarkImage,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight
        );
      }
    };

    render().catch((err) => {
      console.error("Error rendering meme canvas", err);
    });

    // Cleanup flag in case component unmounts while async work is in-flight
    return () => {
      cancelled = true;
    };
  }, [
    imageUrl,
    caption,
    width,
    height,
    textEffect,
    watermarkSrc,
    captionPosition,
    fontScale,
  ]);

  // trigger download
  useEffect(() => {
    if (!onReadyToDownload || !canvasRef.current) return;

    const getDataUrl = () => {
      const canvas = canvasRef.current;
      if (!canvas) return "";
      return canvas.toDataURL("image/png");
    };

    onReadyToDownload(getDataUrl);
  }, [onReadyToDownload]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-neutral-700 bg-background"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}

function getContainSize(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  const drawWidth = srcWidth * ratio;
  const drawHeight = srcHeight * ratio;
  const offsetX = (maxWidth - drawWidth) / 2;
  const offsetY = (maxHeight - drawHeight) / 2;

  return { drawWidth, drawHeight, offsetX, offsetY };
}

async function drawCaption(
  context: CanvasRenderingContext2D,
  caption: string,
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
  imageOffsetX: number,
  imageOffsetY: number,
  textEffect: TextEffect,
  fontScale: number,
  captionPosition: CaptionPosition
) {
  const fontSize = Math.floor(imageHeight * 0.08 * fontScale);

  try {
    await document.fonts.load(`${fontSize}px "Bebas Neue"`);
  } catch (e) {
    console.warn(
      "Failed to load Bebas Neue font before drawing canvas text.",
      e
    );
  }

  context.font = `${fontSize}px "Bebas Neue", system-ui, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "top";

  context.lineWidth = Math.max(4, Math.floor(fontSize * 0.15));
  context.strokeStyle = "black";
  context.fillStyle = "white";

  const x = imageOffsetX + captionPosition.xPercent * imageWidth;
  const y = imageOffsetY + captionPosition.yPercent * imageHeight;

  const maxWidth = imageWidth * 0.9;

  wrapAndDrawText(context, caption, x, y, maxWidth, fontSize, textEffect);
}

function wrapAndDrawText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  textEffect: TextEffect
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const { width } = context.measureText(testLine);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length === 0) return;

  let maxLineWidth = 0;
  for (const line of lines) {
    const { width } = context.measureText(line);
    if (width > maxLineWidth) {
      maxLineWidth = width;
    }
  }

  // stack lines upward
  const totalHeight = lines.length * lineHeight;
  const paddingX = lineHeight * 0.4;
  const paddingY = lineHeight * 0.3;

  const boxWidth = maxLineWidth + paddingX * 2;
  const boxHeight = totalHeight + paddingY * 2;

  const boxX = x - boxWidth / 2;
  const boxY = y - paddingY;

  // draw dashed outline for caption box
  context.save();
  context.setLineDash([6, 4]);
  context.lineWidth = 1;
  context.strokeStyle = "rgba(255, 255, 255, 1)";
  context.strokeRect(boxX, boxY, boxWidth, boxHeight);
  context.restore();

  let currentY = y;

  for (const line of lines) {
    if (textEffect === "shadow") {
      drawShadowLayers(context, line, x, currentY);
    }

    if (textEffect === "glow") {
      drawGlowLayer(context, line, x, currentY);
    }

    if (textEffect === "stroke") {
      context.strokeText(line, x, currentY);
    }

    context.fillText(line, x, currentY);
    currentY += lineHeight;
  }
}

function drawShadowLayers(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  // save original shadow settings
  const prevShadowColor = ctx.shadowColor;
  const prevShadowBlur = ctx.shadowBlur;
  const prevShadowOffsetX = ctx.shadowOffsetX;
  const prevShadowOffsetY = ctx.shadowOffsetY;

  // 1) big soft shadow (matches your stacked CSS-style “depth”)
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 23;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 18;
  ctx.fillText(text, x, y);

  // 2) medium shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 13;
  ctx.shadowOffsetY = 8;
  ctx.fillText(text, x, y);

  // 3) closer, stronger shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 3;
  ctx.shadowOffsetY = 4;
  ctx.fillText(text, x, y);

  // restore
  ctx.shadowColor = prevShadowColor;
  ctx.shadowBlur = prevShadowBlur;
  ctx.shadowOffsetX = prevShadowOffsetX;
  ctx.shadowOffsetY = prevShadowOffsetY;
}

function drawGlowLayer(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  // save original shadow settings
  const prevShadowColor = ctx.shadowColor;
  const prevShadowBlur = ctx.shadowBlur;
  const prevShadowOffsetX = ctx.shadowOffsetX;
  const prevShadowOffsetY = ctx.shadowOffsetY;

  // your CSS glow:
  // text-shadow: 0px 0px 6px rgba(255, 255, 255, 0.7);
  ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillText(text, x, y);

  // restore
  ctx.shadowColor = prevShadowColor;
  ctx.shadowBlur = prevShadowBlur;
  ctx.shadowOffsetX = prevShadowOffsetX;
  ctx.shadowOffsetY = prevShadowOffsetY;
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  imgOffsetX: number,
  imgOffsetY: number,
  imgWidth: number,
  imgHeight: number
) {
  const padding = imgWidth * 0.03;
  const targetWidth = imgWidth * 0.15;
  const aspectRatio = img.width / img.height;
  const targetHeight = targetWidth / aspectRatio;

  const x = imgOffsetX + imgWidth - targetWidth - padding;
  const y = imgOffsetY + imgHeight - targetHeight - padding;

  ctx.globalAlpha = 0.9;

  ctx.drawImage(img, x, y, targetWidth, targetHeight);

  ctx.globalAlpha = 1;
}

function getCanvasPointFromEvent(
  canvas: HTMLCanvasElement,
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x, y };
}

function updateCursorForPosition(
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  captionPosition: CaptionPosition,
  metrics: {
    offsetX: number;
    offsetY: number;
    drawWidth: number;
    drawHeight: number;
  },
  isDragging: boolean
) {
  const { offsetX, offsetY, drawWidth, drawHeight } = metrics;

  const captionX = offsetX + captionPosition.xPercent * drawWidth;
  const captionY = offsetY + captionPosition.yPercent * drawHeight;

  const dx = mouseX - captionX;
  const dy = mouseY - captionY;

  const hitRadius = 80; // nicer than 400, but you can tweak
  const isOverCaption = dx * dx + dy * dy <= hitRadius * hitRadius;

  if (isDragging && isOverCaption) {
    canvas.style.cursor = "grabbing";
  } else if (isOverCaption) {
    canvas.style.cursor = "grab";
  } else {
    canvas.style.cursor = "default";
  }
}
