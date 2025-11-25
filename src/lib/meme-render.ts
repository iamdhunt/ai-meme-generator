// meme-render.ts
import type {
  TextEffect,
  CaptionPosition,
} from "@/components/meme-preview-editor1";

export type ContainMetrics = {
  drawWidth: number;
  drawHeight: number;
  offsetX: number;
  offsetY: number;
};

export function getContainSize(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): ContainMetrics {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  const drawWidth = srcWidth * ratio;
  const drawHeight = srcHeight * ratio;
  const offsetX = (maxWidth - drawWidth) / 2;
  const offsetY = (maxHeight - drawHeight) / 2;

  return { drawWidth, drawHeight, offsetX, offsetY };
}

let bebasLoaded = false;

export async function drawCaption(
  ctx: CanvasRenderingContext2D,
  caption: string,
  imageWidth: number,
  imageHeight: number,
  imageOffsetX: number,
  imageOffsetY: number,
  textEffect: TextEffect,
  fontScale: number,
  captionPosition: CaptionPosition,
  options?: { showBoundingBox?: boolean }
) {
  const showBoundingBox = options?.showBoundingBox ?? false;
  const fontSize = Math.floor(imageHeight * 0.08 * fontScale);

  // Try to ensure Bebas is loaded before measuring/drawing
  if (!bebasLoaded && (document as any).fonts?.load) {
    try {
      await (document as any).fonts.load(`${fontSize}px "Bebas Neue"`);
      bebasLoaded = true;
    } catch (e) {
      console.warn("Failed to load Bebas Neue", e);
    }
  }

  ctx.font = `${fontSize}px "Bebas Neue", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.lineWidth = Math.max(4, Math.floor(fontSize * 0.15));
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";

  const x = imageOffsetX + captionPosition.xPercent * imageWidth;
  const y = imageOffsetY + captionPosition.yPercent * imageHeight;
  const maxWidth = imageWidth * 0.9;

  wrapAndDrawText(
    ctx,
    caption,
    x,
    y,
    maxWidth,
    fontSize,
    textEffect,
    showBoundingBox
  );
}

export function wrapAndDrawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  textEffect: TextEffect,
  showBoundingBox: boolean
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  if (lines.length === 0) return;

  // compute bounding box size
  let maxLineWidth = 0;
  for (const line of lines) {
    const { width } = ctx.measureText(line);
    if (width > maxLineWidth) {
      maxLineWidth = width;
    }
  }

  const totalHeight = lines.length * lineHeight;
  const paddingX = lineHeight * 0.4;
  const paddingY = lineHeight * 0.3;

  const boxWidth = maxLineWidth + paddingX * 2;
  const boxHeight = totalHeight + paddingY * 2;

  const boxX = x - boxWidth / 2;
  const boxY = y - paddingY;

  if (showBoundingBox) {
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    ctx.restore();
  }

  let currentY = y;

  for (const line of lines) {
    if (textEffect === "shadow") {
      drawShadowLayers(ctx, line, x, currentY);
    }

    if (textEffect === "glow") {
      drawGlowLayer(ctx, line, x, currentY);
    }

    if (textEffect === "stroke") {
      ctx.strokeText(line, x, currentY);
    }

    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
}

export function drawShadowLayers(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  const prevShadowColor = ctx.shadowColor;
  const prevShadowBlur = ctx.shadowBlur;
  const prevShadowOffsetX = ctx.shadowOffsetX;
  const prevShadowOffsetY = ctx.shadowOffsetY;

  // 1) big soft shadow
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

  ctx.shadowColor = prevShadowColor;
  ctx.shadowBlur = prevShadowBlur;
  ctx.shadowOffsetX = prevShadowOffsetX;
  ctx.shadowOffsetY = prevShadowOffsetY;
}

export function drawGlowLayer(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  const prevShadowColor = ctx.shadowColor;
  const prevShadowBlur = ctx.shadowBlur;
  const prevShadowOffsetX = ctx.shadowOffsetX;
  const prevShadowOffsetY = ctx.shadowOffsetY;

  // matches: text-shadow: 0px 0px 6px rgba(255,255,255,0.7)
  ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillText(text, x, y);

  ctx.shadowColor = prevShadowColor;
  ctx.shadowBlur = prevShadowBlur;
  ctx.shadowOffsetX = prevShadowOffsetX;
  ctx.shadowOffsetY = prevShadowOffsetY;
}

export function drawWatermark(
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
