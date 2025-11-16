/**
 * Main Plugin Code - Figma plugin backend
 * This runs in the Figma plugin sandbox
 */

import { parseNode } from '../parsers/nodeParser';
import { generateComponent, generateOptimizedComponent } from '../generators/componentGenerator';
import { GeneratorOptions } from './types';

// Show the UI
figma.showUI(__html__, { width: 500, height: 700 });

// Storage keys
const STORAGE_KEYS = {
  STYLE_TYPE: 'styleType',
  USE_TYPESCRIPT: 'useTypeScript',
  OPTIMIZE: 'optimize',
};

// Initialize plugin
async function init() {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'no-selection',
      message: 'Please select a frame or component to generate code',
    });
    return;
  }

  if (selection.length > 1) {
    figma.notify('Please select only one frame or component');
    return;
  }

  // Load saved settings
  const settings = await loadSettings();

  // Send settings to UI
  figma.ui.postMessage({
    type: 'settings-loaded',
    settings,
  });

  // Generate code for selected node
  await generateCode(selection[0], settings);
}

/**
 * Load settings from client storage
 */
async function loadSettings(): Promise<GeneratorOptions> {
  const styleType = (await figma.clientStorage.getAsync(STORAGE_KEYS.STYLE_TYPE)) || 'StyleSheet';
  const useTypeScript = (await figma.clientStorage.getAsync(STORAGE_KEYS.USE_TYPESCRIPT)) !== false;
  const optimize = (await figma.clientStorage.getAsync(STORAGE_KEYS.OPTIMIZE)) !== false;

  return {
    styleType,
    useTypeScript,
    exportAssets: false,
  };
}

/**
 * Save settings to client storage
 */
async function saveSettings(settings: GeneratorOptions) {
  await figma.clientStorage.setAsync(STORAGE_KEYS.STYLE_TYPE, settings.styleType);
  await figma.clientStorage.setAsync(STORAGE_KEYS.USE_TYPESCRIPT, settings.useTypeScript);
}

/**
 * Generate React Native code from a Figma node
 */
async function generateCode(node: SceneNode, options: GeneratorOptions) {
  try {
    // Parse the Figma node
    const parsedNode = parseNode(node);

    if (!parsedNode) {
      figma.ui.postMessage({
        type: 'error',
        message: 'Could not parse the selected node',
      });
      return;
    }

    // Generate component code
    const generated = generateOptimizedComponent(parsedNode, options);

    // Combine component and styles
    let fullCode = generated.component;

    if (generated.styles) {
      fullCode += '\n' + generated.styles;
    }

    // Send generated code to UI
    figma.ui.postMessage({
      type: 'code-generated',
      code: fullCode,
      componentName: options.componentName || parsedNode.name,
    });

    figma.notify('Code generated successfully!');
  } catch (error) {
    console.error('Code generation error:', error);
    figma.ui.postMessage({
      type: 'error',
      message: `Error generating code: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle messages from UI
 */
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'generate':
      {
        const selection = figma.currentPage.selection;
        if (selection.length > 0) {
          await generateCode(selection[0], msg.options);
          await saveSettings(msg.options);
        }
      }
      break;

    case 'copy-success':
      figma.notify('Code copied to clipboard!');
      break;

    case 'settings-changed':
      await saveSettings(msg.options);
      // Regenerate code with new settings
      const selection = figma.currentPage.selection;
      if (selection.length > 0) {
        await generateCode(selection[0], msg.options);
      }
      break;

    case 'close':
      figma.closePlugin();
      break;

    case 'resize':
      figma.ui.resize(msg.width, msg.height);
      break;

    default:
      console.warn('Unknown message type:', msg.type);
  }
};

/**
 * Handle selection changes
 */
figma.on('selectionchange', async () => {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'no-selection',
      message: 'Please select a frame or component to generate code',
    });
    return;
  }

  if (selection.length > 1) {
    figma.ui.postMessage({
      type: 'multiple-selection',
      message: 'Please select only one frame or component',
    });
    return;
  }

  // Generate code for newly selected node
  const settings = await loadSettings();
  await generateCode(selection[0], settings);
});

// Initialize the plugin
init();
