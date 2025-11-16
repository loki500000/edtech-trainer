/**
 * Generator Utilities - Helper functions for code generation
 */

/**
 * Sanitize a name to be a valid React component name
 */
export function sanitizeComponentName(name: string): string {
  // Remove special characters and spaces
  let sanitized = name.replace(/[^a-zA-Z0-9]/g, '');

  // Ensure it starts with a capital letter
  if (sanitized.length > 0) {
    sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
  } else {
    sanitized = 'Component';
  }

  // If it starts with a number, prepend 'Component'
  if (/^[0-9]/.test(sanitized)) {
    sanitized = 'Component' + sanitized;
  }

  return sanitized;
}

/**
 * Generate indentation string
 */
export function indent(level: number, spaces: number = 2): string {
  return ' '.repeat(level * spaces);
}

/**
 * Capitalize first letter of a string
 */
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '');
}

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, letter => letter.toUpperCase())
    .replace(/\s+/g, '');
}

/**
 * Check if a string is a valid identifier
 */
export function isValidIdentifier(str: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str);
}

/**
 * Escape string for use in code
 */
export function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Format a number to a fixed decimal places
 */
export function formatNumber(num: number, decimals: number = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Check if two colors are similar (for optimization)
 */
export function areColorsSimilar(color1: string, color2: string, threshold: number = 10): boolean {
  // Simple hex color comparison
  if (color1 === color2) return true;

  // Extract RGB values
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return false;

  // Calculate color distance
  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );

  return distance < threshold;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Generate a unique ID for a node
 */
export function generateNodeId(name: string, index: number): string {
  return `${sanitizeComponentName(name)}_${index}`;
}

/**
 * Pretty print JSON
 */
export function prettyPrintJSON(obj: any, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}

/**
 * Remove undefined and null values from an object
 */
export function removeEmpty(obj: any): any {
  const cleaned: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedNested = removeEmpty(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
}

/**
 * Deep merge two objects
 */
export function deepMerge(target: any, source: any): any {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

/**
 * Check if value is an object
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Generate a hash from a string (simple)
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as any;
  };
}
