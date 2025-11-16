/**
 * Component Generator - Generates React Native component code from parsed nodes
 */

import { ParsedNode, GeneratedCode, GeneratorOptions } from '../plugin/types';
import { generateStyleSheet, generateStyledComponent } from './styleGenerator';
import { sanitizeComponentName, indent } from './utils';

/**
 * Main entry point for generating React Native component
 */
export function generateComponent(
  node: ParsedNode,
  options: GeneratorOptions
): GeneratedCode {
  const componentName = options.componentName || sanitizeComponentName(node.name);
  const imports = new Set<string>();

  // Always need React
  imports.add("import React from 'react';");

  // Generate component JSX
  const jsx = generateJSX(node, 0, imports, options);

  // Generate styles based on style type
  let styles = '';
  if (options.styleType === 'StyleSheet') {
    imports.add("import {View, Text, Image, StyleSheet} from 'react-native';");
    styles = generateStyleSheet(node, componentName);
  } else if (options.styleType === 'styled-components') {
    imports.add("import styled from 'styled-components/native';");
    styles = generateStyledComponent(node);
  }

  // Build the component
  const componentCode = buildComponentCode(componentName, jsx, imports, options);

  return {
    component: componentCode,
    styles: options.styleType === 'StyleSheet' ? styles : undefined,
    imports: Array.from(imports),
  };
}

/**
 * Generate JSX for a node and its children
 */
function generateJSX(
  node: ParsedNode,
  level: number,
  imports: Set<string>,
  options: GeneratorOptions
): string {
  const indentStr = indent(level);
  const componentType = node.type;
  const hasChildren = node.children && node.children.length > 0;
  const hasContent = node.content && node.content.trim().length > 0;

  // Generate style prop
  const styleProp = generateStyleProp(node, options);

  // Build opening tag
  let jsx = `${indentStr}<${componentType}${styleProp}`;

  // Handle image source
  if (componentType === 'Image') {
    jsx += ` source={{uri: '${node.props?.imageUrl || 'placeholder.png'}'}}`;
    jsx += ` resizeMode="cover"`;
  }

  // Self-closing tag if no children or content
  if (!hasChildren && !hasContent) {
    jsx += ' />';
    return jsx;
  }

  jsx += '>';

  // Add text content
  if (hasContent) {
    jsx += `\n${indent(level + 1)}${node.content}\n${indentStr}`;
  }

  // Add children
  if (hasChildren) {
    jsx += '\n';
    for (const child of node.children!) {
      jsx += generateJSX(child, level + 1, imports, options) + '\n';
    }
    jsx += indentStr;
  }

  // Closing tag
  jsx += `</${componentType}>`;

  return jsx;
}

/**
 * Generate style prop for a node
 */
function generateStyleProp(node: ParsedNode, options: GeneratorOptions): string {
  if (options.styleType === 'StyleSheet') {
    const styleName = sanitizeComponentName(node.name);
    return ` style={styles.${styleName}}`;
  } else if (options.styleType === 'styled-components') {
    // styled-components don't need inline style props
    return '';
  }
  return '';
}

/**
 * Build the complete component code
 */
function buildComponentCode(
  componentName: string,
  jsx: string,
  imports: Set<string>,
  options: GeneratorOptions
): string {
  const isTypeScript = options.useTypeScript !== false;
  const propsType = isTypeScript ? ': React.FC' : '';

  let code = '';

  // Imports
  code += Array.from(imports).join('\n');
  code += '\n\n';

  // Component declaration
  code += `const ${componentName}${propsType} = () => {\n`;
  code += `  return (\n`;

  // JSX (indented)
  const indentedJSX = jsx
    .split('\n')
    .map(line => line ? `    ${line}` : '')
    .join('\n');
  code += indentedJSX;

  code += `\n  );\n`;
  code += `};\n\n`;

  // Export
  code += `export default ${componentName};\n`;

  return code;
}

/**
 * Generate an optimized component with minimal nesting
 */
export function generateOptimizedComponent(
  node: ParsedNode,
  options: GeneratorOptions
): GeneratedCode {
  // Flatten unnecessary View wrappers
  const optimizedNode = optimizeNodeTree(node);
  return generateComponent(optimizedNode, options);
}

/**
 * Optimize node tree by flattening unnecessary nesting
 */
function optimizeNodeTree(node: ParsedNode): ParsedNode {
  // If this is a View with only one child and no meaningful styles, flatten it
  if (
    node.type === 'View' &&
    node.children &&
    node.children.length === 1 &&
    !hasSignificantStyles(node)
  ) {
    return optimizeNodeTree(node.children[0]);
  }

  // Recursively optimize children
  if (node.children) {
    node.children = node.children.map(child => optimizeNodeTree(child));
  }

  return node;
}

/**
 * Check if a node has significant styles that warrant keeping it
 */
function hasSignificantStyles(node: ParsedNode): boolean {
  const styles = node.styles;

  // Check for layout styles
  if (styles.layout) {
    const layoutKeys = Object.keys(styles.layout);
    if (layoutKeys.length > 0) return true;
  }

  // Check for appearance styles
  if (styles.appearance) {
    const appearanceKeys = Object.keys(styles.appearance);
    if (appearanceKeys.length > 0) return true;
  }

  // Check for effects
  if (styles.effects) {
    return true;
  }

  return false;
}
