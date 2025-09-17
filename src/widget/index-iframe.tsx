import { createRoot, type Root } from 'react-dom/client';
import './styles/style.css';
import Widget from './components/Widget';

// Global variable to track if widget has been initialized
let isInitialized = false;
let reactRoot: Root | null = null;

// This script runs inside the iframe
function initializeWidgetIframe() {
  try {
    // Prevent multiple initialization
    if (isInitialized) {
      console.log('Widget iframe already initialized, skipping...');
      return;
    }

    const root = document.getElementById('widget-iframe-root');

    console.log({ root });
    if (!root) {
      throw new Error('Widget iframe root element not found');
    }

    const component = <Widget />;

    // Create root only once and store reference
    reactRoot = createRoot(root);
    reactRoot.render(component);

    isInitialized = true;
    console.log('Widget iframe initialized successfully');
  } catch (error) {
    console.warn('Widget iframe initialization failed:', error);
  }
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    initializeWidgetIframe: () => void;
  }
}

window.initializeWidgetIframe = initializeWidgetIframe;

// Only initialize immediately if DOM is ready, otherwise let the load event handle it
if (document.readyState === 'complete') {
  initializeWidgetIframe();
}
initializeWidgetIframe();
