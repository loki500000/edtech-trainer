/**
 * Style Parser - Extracts visual styles (colors, borders, effects) from Figma nodes
 */

import { AppearanceStyles, EffectStyles } from '../plugin/types';

/**
 * Parse appearance styles (background, borders, opacity)
 */
export function parseStyles(node: SceneNode): AppearanceStyles {
  const styles: AppearanceStyles = {};

  // Background color
  if ('fills' in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
    const solidFill = node.fills.find(fill => fill.type === 'SOLID' && fill.visible !== false);
    if (solidFill && solidFill.type === 'SOLID') {
      styles.backgroundColor = rgbaToHex(solidFill.color, solidFill.opacity ?? 1);
    }
  }

  // Border (stroke)
  if ('strokes' in node && node.strokes !== figma.mixed && Array.isArray(node.strokes)) {
    const solidStroke = node.strokes.find(stroke => stroke.type === 'SOLID' && stroke.visible !== false);
    if (solidStroke && solidStroke.type === 'SOLID') {
      styles.borderColor = rgbaToHex(solidStroke.color, solidStroke.opacity ?? 1);
    }
  }

  // Border width
  if ('strokeWeight' in node && typeof node.strokeWeight === 'number') {
    styles.borderWidth = node.strokeWeight;
  }

  // Individual stroke weights (if different on each side)
  if ('strokeTopWeight' in node) {
    const top = (node as any).strokeTopWeight;
    const right = (node as any).strokeRightWeight;
    const bottom = (node as any).strokeBottomWeight;
    const left = (node as any).strokeLeftWeight;

    if (top !== right || top !== bottom || top !== left) {
      if (typeof top === 'number') styles.borderTopWidth = top;
      if (typeof right === 'number') styles.borderRightWidth = right;
      if (typeof bottom === 'number') styles.borderBottomWidth = bottom;
      if (typeof left === 'number') styles.borderLeftWidth = left;
      delete styles.borderWidth; // Remove uniform border width
    }
  }

  // Border radius
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    styles.borderRadius = node.cornerRadius;
  }

  // Individual corner radius (if different on each corner)
  if ('topLeftRadius' in node) {
    const topLeft = (node as any).topLeftRadius;
    const topRight = (node as any).topRightRadius;
    const bottomRight = (node as any).bottomRightRadius;
    const bottomLeft = (node as any).bottomLeftRadius;

    if (topLeft !== topRight || topLeft !== bottomRight || topLeft !== bottomLeft) {
      if (typeof topLeft === 'number') styles.borderTopLeftRadius = topLeft;
      if (typeof topRight === 'number') styles.borderTopRightRadius = topRight;
      if (typeof bottomRight === 'number') styles.borderBottomRightRadius = bottomRight;
      if (typeof bottomLeft === 'number') styles.borderBottomLeftRadius = bottomLeft;
      delete styles.borderRadius; // Remove uniform border radius
    }
  }

  // Opacity
  if ('opacity' in node && typeof node.opacity === 'number' && node.opacity < 1) {
    styles.opacity = node.opacity;
  }

  // Overflow (clipping)
  if ('clipsContent' in node && node.clipsContent) {
    styles.overflow = 'hidden';
  }

  return styles;
}

/**
 * Parse effects (shadows, blurs)
 */
export function parseEffects(node: SceneNode): EffectStyles | undefined {
  if (!('effects' in node) || !Array.isArray(node.effects) || node.effects.length === 0) {
    return undefined;
  }

  const styles: EffectStyles = {};

  // Find drop shadow effect
  const dropShadow = node.effects.find(
    effect => effect.type === 'DROP_SHADOW' && effect.visible !== false
  );

  if (dropShadow && dropShadow.type === 'DROP_SHADOW') {
    styles.shadowColor = rgbaToHex(dropShadow.color, 1);
    styles.shadowOffset = {
      width: dropShadow.offset.x,
      height: dropShadow.offset.y,
    };
    styles.shadowOpacity = dropShadow.color.a ?? 0.5;
    styles.shadowRadius = dropShadow.radius;

    // Android elevation approximation
    styles.elevation = Math.max(dropShadow.radius / 2, 1);
  }

  return Object.keys(styles).length > 0 ? styles : undefined;
}

/**
 * Convert RGB color to hex format
 */
function rgbaToHex(color: RGB, alpha: number = 1): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);

  if (alpha < 1) {
    const a = Math.round(alpha * 255);
    return `#${[r, g, b, a].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Check if color is transparent
 */
function isTransparent(color: RGB, alpha: number): boolean {
  return alpha === 0;
}

/**
 * Get color brightness (for contrast calculations)
 */
function getColorBrightness(color: RGB): number {
  // Using relative luminance formula
  return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
}
