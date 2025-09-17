import { hydrateRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';
import './styles/style.css';

// This script runs inside the iframe
function initializeWidgetIframe(config?: any) {
  try {
    const root = document.getElementById('widget-iframe-root');
    if (!root) {
      throw new Error('Widget iframe root element not found');
    }

    const clientKey = config?.clientKey || getClientKeyFromWindow();
    const component = <WidgetContainer clientKey={clientKey} />;

    hydrateRoot(root, component);
  } catch (error) {
    console.warn('Widget iframe initialization failed:', error);
  }
}

function getClientKeyFromWindow() {
  // Get client key from window variable set in the dynamically created HTML
  const clientKey = (window as any).widgetClientKey;

  if (!clientKey) {
    throw new Error('Missing widgetClientKey in window');
  }

  return clientKey;
}

// Make initialization function available globally
(window as any).initializeWidgetIframe = initializeWidgetIframe;

// Auto-initialize if config is already available
if ((window as any).widgetConfig) {
  initializeWidgetIframe((window as any).widgetConfig);
} else {
  // Initialize with URL params if no config from parent
  initializeWidgetIframe();
}
