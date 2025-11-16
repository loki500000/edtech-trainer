/**
 * Node Parser - Traverses Figma node tree and extracts relevant information
 */

import { ParsedNode, FigmaNodeType } from '../plugin/types';
import { parseLayout } from './layoutParser';
import { parseStyles } from './styleParser';

/**
 * Main entry point for parsing a Figma node and its children
 */
export function parseNode(node: SceneNode): ParsedNode | null {
  // Skip invisible nodes
  if ('visible' in node && !node.visible) {
    return null;
  }

  const parsedNode: ParsedNode = {
    type: mapFigmaNodeToRNComponent(node.type as FigmaNodeType),
    name: node.name,
    styles: {},
  };

  // Parse layout properties (Auto Layout, position, size)
  if (isLayoutNode(node)) {
    parsedNode.styles.layout = parseLayout(node);
  }

  // Parse visual styles (colors, borders, effects)
  parsedNode.styles.appearance = parseStyles(node);

  // Handle text nodes
  if (node.type === 'TEXT') {
    parsedNode.content = (node as TextNode).characters;
    parsedNode.styles.typography = parseTextStyles(node as TextNode);
  }

  // Handle nodes with children
  if ('children' in node) {
    const children = node.children
      .map(child => parseNode(child))
      .filter((child): child is ParsedNode => child !== null);

    if (children.length > 0) {
      parsedNode.children = children;
    }
  }

  return parsedNode;
}

/**
 * Maps Figma node types to React Native component types
 */
function mapFigmaNodeToRNComponent(nodeType: FigmaNodeType): string {
  const mapping: Record<FigmaNodeType, string> = {
    FRAME: 'View',
    GROUP: 'View',
    RECTANGLE: 'View',
    TEXT: 'Text',
    ELLIPSE: 'View',
    POLYGON: 'View',
    STAR: 'View',
    VECTOR: 'View',
    IMAGE: 'Image',
    INSTANCE: 'View',
    COMPONENT: 'View',
  };

  return mapping[nodeType] || 'View';
}

/**
 * Check if node has layout properties
 */
function isLayoutNode(node: SceneNode): node is FrameNode | GroupNode | ComponentNode | InstanceNode {
  return (
    node.type === 'FRAME' ||
    node.type === 'GROUP' ||
    node.type === 'COMPONENT' ||
    node.type === 'INSTANCE'
  );
}

/**
 * Parse text-specific styles
 */
function parseTextStyles(node: TextNode) {
  const styles: any = {};

  // Font size
  if (typeof node.fontSize === 'number') {
    styles.fontSize = node.fontSize;
  }

  // Font weight
  if (typeof node.fontWeight === 'number') {
    styles.fontWeight = String(node.fontWeight) as any;
  }

  // Font family
  if (node.fontName !== figma.mixed && typeof node.fontName === 'object') {
    styles.fontFamily = node.fontName.family;
  }

  // Text alignment
  if (node.textAlignHorizontal) {
    const alignmentMap: Record<string, string> = {
      'LEFT': 'left',
      'CENTER': 'center',
      'RIGHT': 'right',
      'JUSTIFIED': 'justify',
    };
    styles.textAlign = alignmentMap[node.textAlignHorizontal] || 'left';
  }

  // Line height
  if (typeof node.lineHeight === 'object' && 'value' in node.lineHeight) {
    styles.lineHeight = node.lineHeight.value;
  }

  // Letter spacing
  if (typeof node.letterSpacing === 'object' && 'value' in node.letterSpacing) {
    styles.letterSpacing = node.letterSpacing.value;
  }

  // Text color
  if (node.fills !== figma.mixed && Array.isArray(node.fills) && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID' && fill.visible !== false) {
      styles.color = rgbaToHex(fill.color, fill.opacity ?? 1);
    }
  }

  // Text decoration
  if (node.textDecoration) {
    const decorationMap: Record<string, string> = {
      'UNDERLINE': 'underline',
      'STRIKETHROUGH': 'line-through',
    };
    styles.textDecorationLine = decorationMap[node.textDecoration] || 'none';
  }

  // Text transform
  if (node.textCase) {
    const transformMap: Record<string, string> = {
      'UPPER': 'uppercase',
      'LOWER': 'lowercase',
      'TITLE': 'capitalize',
    };
    styles.textTransform = transformMap[node.textCase] || 'none';
  }

  return styles;
}

/**
 * Convert RGBA color to hex format
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
