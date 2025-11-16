/**
 * Plugin UI Logic - Handles user interactions and communication with plugin code
 */

import { GeneratorOptions } from '../plugin/types';

// UI Elements
const statusEl = document.getElementById('status') as HTMLParagraphElement;
const errorContainer = document.getElementById('error-container') as HTMLDivElement;
const styleTypeSelect = document.getElementById('styleType') as HTMLSelectElement;
const componentNameInput = document.getElementById('componentName') as HTMLInputElement;
const useTypeScriptCheckbox = document.getElementById('useTypeScript') as HTMLInputElement;
const exportAssetsCheckbox = document.getElementById('exportAssets') as HTMLInputElement;
const codeOutput = document.getElementById('codeOutput') as HTMLTextAreaElement;
const copyButton = document.getElementById('copyButton') as HTMLButtonElement;
const regenerateButton = document.getElementById('regenerateButton') as HTMLButtonElement;

// State
let currentCode = '';
let currentSettings: GeneratorOptions | null = null;

/**
 * Initialize UI event listeners
 */
function init() {
  // Copy button
  copyButton.addEventListener('click', copyToClipboard);

  // Regenerate button
  regenerateButton.addEventListener('click', regenerateCode);

  // Settings change listeners
  styleTypeSelect.addEventListener('change', onSettingsChange);
  useTypeScriptCheckbox.addEventListener('change', onSettingsChange);
  exportAssetsCheckbox.addEventListener('change', onSettingsChange);

  // Listen for messages from plugin code
  window.onmessage = handlePluginMessage;

  // Notify plugin that UI is ready
  parent.postMessage({ pluginMessage: { type: 'ui-ready' } }, '*');
}

/**
 * Handle messages from the plugin backend
 */
function handlePluginMessage(event: MessageEvent) {
  const msg = event.data.pluginMessage;

  switch (msg.type) {
    case 'settings-loaded':
      loadSettings(msg.settings);
      break;

    case 'code-generated':
      displayGeneratedCode(msg.code, msg.componentName);
      break;

    case 'no-selection':
      showEmptyState(msg.message);
      break;

    case 'multiple-selection':
      showError(msg.message);
      break;

    case 'error':
      showError(msg.message);
      break;

    default:
      console.warn('Unknown message type:', msg.type);
  }
}

/**
 * Load settings into UI
 */
function loadSettings(settings: GeneratorOptions) {
  currentSettings = settings;

  styleTypeSelect.value = settings.styleType;
  useTypeScriptCheckbox.checked = settings.useTypeScript !== false;
  exportAssetsCheckbox.checked = settings.exportAssets === true;
}

/**
 * Display generated code in the UI
 */
function displayGeneratedCode(code: string, componentName: string) {
  currentCode = code;
  codeOutput.value = code;
  copyButton.disabled = false;
  regenerateButton.disabled = false;

  statusEl.textContent = `Generated: ${componentName}`;
  clearError();
}

/**
 * Show empty state when no selection
 */
function showEmptyState(message: string) {
  statusEl.textContent = message;
  codeOutput.value = '';
  copyButton.disabled = true;
  regenerateButton.disabled = true;
  clearError();
}

/**
 * Show error message
 */
function showError(message: string) {
  errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

/**
 * Clear error message
 */
function clearError() {
  errorContainer.innerHTML = '';
}

/**
 * Copy code to clipboard
 */
async function copyToClipboard() {
  if (!currentCode) return;

  try {
    // Try modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(currentCode);
      showSuccess('Code copied to clipboard!');

      // Notify plugin
      parent.postMessage(
        { pluginMessage: { type: 'copy-success' } },
        '*'
      );
    } else {
      // Fallback: select and copy
      codeOutput.select();
      document.execCommand('copy');
      showSuccess('Code copied to clipboard!');

      parent.postMessage(
        { pluginMessage: { type: 'copy-success' } },
        '*'
      );
    }
  } catch (error) {
    console.error('Copy failed:', error);
    showError('Failed to copy code. Please copy manually.');
  }
}

/**
 * Show success message
 */
function showSuccess(message: string) {
  errorContainer.innerHTML = `<div class="success-message">${message}</div>`;

  // Auto-hide after 3 seconds
  setTimeout(() => {
    clearError();
  }, 3000);
}

/**
 * Regenerate code with current settings
 */
function regenerateCode() {
  const options = getOptionsFromUI();

  parent.postMessage(
    {
      pluginMessage: {
        type: 'generate',
        options,
      },
    },
    '*'
  );
}

/**
 * Handle settings change
 */
function onSettingsChange() {
  const options = getOptionsFromUI();

  parent.postMessage(
    {
      pluginMessage: {
        type: 'settings-changed',
        options,
      },
    },
    '*'
  );
}

/**
 * Get generator options from UI inputs
 */
function getOptionsFromUI(): GeneratorOptions {
  return {
    styleType: styleTypeSelect.value as 'StyleSheet' | 'styled-components',
    componentName: componentNameInput.value.trim() || undefined,
    useTypeScript: useTypeScriptCheckbox.checked,
    exportAssets: exportAssetsCheckbox.checked,
  };
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
