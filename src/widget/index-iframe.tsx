import { render } from 'preact';
import '../assets/css/app.css';
import InteractiveWidget from './components/InteractiveWidget';

// Global variable to track if widget has been initialized
let isInitialized = false;

// This script runs inside the iframe

function initializeWidgetIframe() {
  try {
    // Prevent multiple initialization
    if (isInitialized) {
      console.log('Widget iframe already initialized, skipping...');
      return;
    }

    const root = document.getElementById('widget-iframe-root');

    if (!root) {
      throw new Error('Widget iframe root element not found');
    }

    const config = (window as any).onedeskWidgetConfig;

    const component = (
      <InteractiveWidget
        config={{ ...config, bottomOffset: 0, horizontalOffset: 0 }}
      />
    );

    // Render component with Preact
    render(component, root);

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
  window.addEventListener('message', (event) => {
    if (event.data.type === 'WIDGET_CONFIG') {
      const config = event.data.config;

      (window as any).onedeskWidgetConfig = config;

      if (config) {
        initializeWidgetIframe();
      }
    }
  });
}
// initializeWidgetIframe();
