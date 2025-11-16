/**
 * Layout Parser - Converts Figma Auto Layout to React Native Flexbox
 */

import { LayoutStyles } from '../plugin/types';

/**
 * Parse layout properties from a Figma node
 */
export function parseLayout(
  node: FrameNode | GroupNode | ComponentNode | InstanceNode
): LayoutStyles {
  const styles: LayoutStyles = {};

  // Auto Layout properties
  if ('layoutMode' in node && node.layoutMode !== 'NONE') {
    styles.display = 'flex';

    // Flex direction
    if (node.layoutMode === 'HORIZONTAL') {
      styles.flexDirection = 'row';
    } else if (node.layoutMode === 'VERTICAL') {
      styles.flexDirection = 'column';
    }

    // Primary axis alignment (justifyContent)
    if (node.primaryAxisAlignItems) {
      const justifyMap: Record<string, any> = {
        'MIN': 'flex-start',
        'CENTER': 'center',
        'MAX': 'flex-end',
        'SPACE_BETWEEN': 'space-between',
      };
      styles.justifyContent = justifyMap[node.primaryAxisAlignItems] || 'flex-start';
    }

    // Counter axis alignment (alignItems)
    if (node.counterAxisAlignItems) {
      const alignMap: Record<string, any> = {
        'MIN': 'flex-start',
        'CENTER': 'center',
        'MAX': 'flex-end',
        'BASELINE': 'baseline',
      };
      styles.alignItems = alignMap[node.counterAxisAlignItems] || 'flex-start';
    }

    // Gap (spacing between items)
    if (typeof node.itemSpacing === 'number') {
      styles.gap = node.itemSpacing;
    }

    // Padding
    if (typeof node.paddingLeft === 'number') styles.paddingLeft = node.paddingLeft;
    if (typeof node.paddingRight === 'number') styles.paddingRight = node.paddingRight;
    if (typeof node.paddingTop === 'number') styles.paddingTop = node.paddingTop;
    if (typeof node.paddingBottom === 'number') styles.paddingBottom = node.paddingBottom;

    // Optimize padding to use shortcuts
    optimizePadding(styles);
  }

  // Size properties
  if ('width' in node) {
    if (typeof node.width === 'number') {
      styles.width = node.width;
    }
  }

  if ('height' in node) {
    if (typeof node.height === 'number') {
      styles.height = node.height;
    }
  }

  // Layout constraints (for sizing behavior)
  if ('layoutGrow' in node && node.layoutGrow === 1) {
    styles.flex = 1;
  }

  // Layout align (alignSelf)
  if ('layoutAlign' in node) {
    const alignSelfMap: Record<string, any> = {
      'MIN': 'flex-start',
      'CENTER': 'center',
      'MAX': 'flex-end',
      'STRETCH': 'stretch',
    };
    if (node.layoutAlign !== 'INHERIT') {
      styles.alignSelf = alignSelfMap[node.layoutAlign];
    }
  }

  // Position (absolute positioning)
  if ('constraints' in node) {
    const parent = node.parent;
    if (parent && 'layoutMode' in parent && parent.layoutMode === 'NONE') {
      // Absolute positioning when parent doesn't use Auto Layout
      styles.position = 'absolute';
      styles.left = node.x;
      styles.top = node.y;
    }
  }

  // Min/Max size constraints
  if ('constraints' in node) {
    if ('minWidth' in node && typeof node.minWidth === 'number') {
      styles.minWidth = node.minWidth;
    }
    if ('minHeight' in node && typeof node.minHeight === 'number') {
      styles.minHeight = node.minHeight;
    }
    if ('maxWidth' in node && typeof node.maxWidth === 'number') {
      styles.maxWidth = node.maxWidth;
    }
    if ('maxHeight' in node && typeof node.maxHeight === 'number') {
      styles.maxHeight = node.maxHeight;
    }
  }

  return styles;
}

/**
 * Optimize padding properties to use shorthand notation
 */
function optimizePadding(styles: LayoutStyles): void {
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = styles;

  // All sides equal
  if (
    paddingTop !== undefined &&
    paddingTop === paddingRight &&
    paddingTop === paddingBottom &&
    paddingTop === paddingLeft
  ) {
    styles.padding = paddingTop;
    delete styles.paddingTop;
    delete styles.paddingRight;
    delete styles.paddingBottom;
    delete styles.paddingLeft;
    return;
  }

  // Vertical and horizontal
  if (
    paddingTop !== undefined &&
    paddingTop === paddingBottom &&
    paddingLeft !== undefined &&
    paddingLeft === paddingRight
  ) {
    styles.paddingVertical = paddingTop;
    styles.paddingHorizontal = paddingLeft;
    delete styles.paddingTop;
    delete styles.paddingRight;
    delete styles.paddingBottom;
    delete styles.paddingLeft;
    return;
  }
}

/**
 * Parse margin properties (if node has layout positioning)
 */
export function parseMargin(node: SceneNode): Partial<LayoutStyles> {
  const styles: Partial<LayoutStyles> = {};

  // Figma doesn't have explicit margin, but we can infer from positioning
  // in Auto Layout contexts through itemSpacing at the parent level
  // This is handled by the gap property in the parent's layout

  return styles;
}
