import { render } from 'preact';
import '../assets/css/app.css';
import InteractiveWidget from './components/InteractiveWidget';

let isInitialized = false;

const initializeWidgetIframe = () => {
  try {
    if (isInitialized) {
      console.log('Widget iframe already initialized, skipping...');
      return;
    }

    const root = document.getElementById('onedesk-widget-iframe-root');

    if (!root) {
      throw new Error('Widget iframe root element not found');
    }

    const config = (window as any).onedeskWidgetConfig;

    const component = (
      <InteractiveWidget
        config={{ ...config, bottomOffset: 0, horizontalOffset: 0 }}
      />
    );

    render(component, root);

    isInitialized = true;
    console.log('Widget iframe initialized successfully');
  } catch (error) {
    console.warn('Widget iframe initialization failed:', error);
  }
};

const onReady = () => {
  window.addEventListener('message', (event) => {
    console.log({ eventIframe: event });
    if (event.data.type === 'WIDGET_CONFIG') {
      const config = event.data.config;

      (window as any).onedeskWidgetConfig = config;

      if (config) {
        initializeWidgetIframe();
      }
    }
  });
};

const initializeWidget = () => {
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
};

initializeWidget();
