/**
 * Style Generator - Generates StyleSheet or styled-components code from parsed nodes
 */

import { ParsedNode, LayoutStyles, AppearanceStyles, TypographyStyles, EffectStyles } from '../plugin/types';
import { sanitizeComponentName, indent } from './utils';

/**
 * Generate React Native StyleSheet code
 */
export function generateStyleSheet(node: ParsedNode, componentName: string): string {
  const styles: Record<string, any> = {};

  // Collect all styles from the node tree
  collectStyles(node, styles);

  // Build StyleSheet code
  let code = `\nconst styles = StyleSheet.create({\n`;

  for (const [styleName, styleObj] of Object.entries(styles)) {
    code += `  ${styleName}: {\n`;

    for (const [key, value] of Object.entries(styleObj)) {
      const formattedValue = formatStyleValue(key, value);
      code += `    ${key}: ${formattedValue},\n`;
    }

    code += `  },\n`;
  }

  code += `});\n`;

  return code;
}

/**
 * Generate styled-components code
 */
export function generateStyledComponent(node: ParsedNode): string {
  let code = '';

  // Generate styled components for each node
  collectStyledComponents(node, code);

  return code;
}

/**
 * Recursively collect styles from node tree
 */
function collectStyles(node: ParsedNode, styles: Record<string, any>): void {
  const styleName = sanitizeComponentName(node.name);
  const styleObj: any = {};

  // Merge all style categories
  if (node.styles.layout) {
    Object.assign(styleObj, node.styles.layout);
  }

  if (node.styles.appearance) {
    Object.assign(styleObj, node.styles.appearance);
  }

  if (node.styles.typography) {
    Object.assign(styleObj, node.styles.typography);
  }

  if (node.styles.effects) {
    Object.assign(styleObj, node.styles.effects);
  }

  // Only add if there are styles
  if (Object.keys(styleObj).length > 0) {
    styles[styleName] = styleObj;
  }

  // Recursively collect from children
  if (node.children) {
    for (const child of node.children) {
      collectStyles(child, styles);
    }
  }
}

/**
 * Collect styled-components from node tree
 */
function collectStyledComponents(node: ParsedNode, code: string): string {
  const componentName = sanitizeComponentName(node.name);
  const baseComponent = node.type;

  // Build styled component
  code += `const ${componentName} = styled.${baseComponent}\``;

  // Add styles
  const allStyles = {
    ...node.styles.layout,
    ...node.styles.appearance,
    ...node.styles.typography,
    ...node.styles.effects,
  };

  for (const [key, value] of Object.entries(allStyles)) {
    const cssKey = camelToKebab(key);
    const cssValue = formatCSSValue(key, value);
    code += `\n  ${cssKey}: ${cssValue};`;
  }

  code += `\n\`;\n\n`;

  // Recursively generate for children
  if (node.children) {
    for (const child of node.children) {
      code = collectStyledComponents(child, code);
    }
  }

  return code;
}

/**
 * Format style value for StyleSheet
 */
function formatStyleValue(key: string, value: any): string {
  // String values (colors, font families, etc.)
  if (typeof value === 'string') {
    // Check if it's a numeric string that should be a number
    if (key.includes('weight') || key.includes('Width')) {
      return `'${value}'`;
    }
    return `'${value}'`;
  }

  // Number values
  if (typeof value === 'number') {
    return String(value);
  }

  // Object values (e.g., shadowOffset)
  if (typeof value === 'object' && value !== null) {
    const props = Object.entries(value)
      .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`)
      .join(', ');
    return `{${props}}`;
  }

  return String(value);
}

/**
 * Format value for CSS (styled-components)
 */
function formatCSSValue(key: string, value: any): string {
  // Add px suffix for numeric values that need units
  if (typeof value === 'number') {
    const needsUnit = !['opacity', 'flex', 'flexGrow', 'flexShrink', 'zIndex', 'elevation'].includes(key);
    return needsUnit ? `${value}px` : String(value);
  }

  if (typeof value === 'string') {
    return value;
  }

  return String(value);
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

/**
 * Optimize styles by removing redundant or default values
 */
export function optimizeStyles(styles: any): any {
  const optimized = { ...styles };

  // Remove default flexDirection if it's 'column'
  if (optimized.flexDirection === 'column') {
    delete optimized.flexDirection;
  }

  // Remove default alignItems if it's 'stretch'
  if (optimized.alignItems === 'stretch') {
    delete optimized.alignItems;
  }

  // Remove zero values
  for (const [key, value] of Object.entries(optimized)) {
    if (value === 0 && key.startsWith('margin') || key.startsWith('padding')) {
      delete optimized[key];
    }
  }

  return optimized;
}

/**
 * Merge multiple style objects intelligently
 */
export function mergeStyles(...styleObjects: any[]): any {
  const merged: any = {};

  for (const styles of styleObjects) {
    if (!styles) continue;

    for (const [key, value] of Object.entries(styles)) {
      // Arrays of values (like transform) should be concatenated
      if (Array.isArray(value) && Array.isArray(merged[key])) {
        merged[key] = [...merged[key], ...value];
      } else {
        merged[key] = value;
      }
    }
  }

  return merged;
}
