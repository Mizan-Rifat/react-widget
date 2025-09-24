import './styles/style.css';

const BASE_URL = getBaseUrl();

function initializeWidget() {
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
}

async function onReady() {
  try {
    const res = await fetch(`${BASE_URL}/widget.json`);
    const config = await res.json();

    // (window as any).onedeskWidgetConfig = config;
    // (window as any).test = 'test';

    const container = createContainer(config);
    document.body.appendChild(container);

    addCss();

    const iframe = createWidgetIframe(container, config);

    const OneDeskWidget = {
      hideLauncher: () => {
        iframe.contentWindow?.postMessage(
          { type: 'WIDGET_LAUNCHER', hide: true },
          '*',
        );
      },
      showLauncher: () => {
        iframe.contentWindow?.postMessage(
          { type: 'WIDGET_LAUNCHER', hide: false },
          '*',
        );
      },
      open: () => {
        iframe.contentWindow?.postMessage(
          { type: 'WIDGET_OVERLAY', open: true },
          '*',
        );
      },
      close: () => {
        iframe.contentWindow?.postMessage(
          { type: 'WIDGET_OVERLAY', open: false },
          '*',
        );
      },
      // Helper method to access test variable
      getTestVariable: () => {
        return (window as any).test;
      },
    };

    (window as any).OneDeskWidget = OneDeskWidget;

    window.addEventListener('message', function (event) {
      console.log({ event });

      if (event.data.type === 'WIDGET_CLOSE') {
        document.documentElement.classList.remove('onedesk-widget-open');
        container.classList.remove('expanded');
      }
      if (event.data.type === 'WIDGET_OPEN') {
        document.documentElement.classList.add('onedesk-widget-open');
        container.classList.add('expanded');
      }

      console.log('Message received:', event.data);
    });
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

const addCss = () => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = `${BASE_URL}/widget.css`;
  document.head.appendChild(css);
};

const createContainer = (config: any) => {
  const container = document.createElement('div');
  container.id = 'onedesk-widget-container';
  container.style.cssText = `
    left: ${config.widgetPosition === 'bottomLeft' ? config.horizontalOffset + 'px' : 'auto'};
    right: ${config.widgetPosition === 'bottomRight' ? config.horizontalOffset + 'px' : 'auto'};
    bottom: ${config.bottomOffset}px;
  `;

  return container;
};

function createWidgetIframe(
  container: HTMLDivElement,
  config: any,
): HTMLIFrameElement {
  const baseUrl = process.env.WIDGET_IFRAME_URL || BASE_URL;
  const cssUrl = `${baseUrl}/widget-iframe.css`;
  const jsUrl = `${baseUrl}/widget-iframe.js`;

  const iframe = document.createElement('iframe');

  iframe.id = 'widget-iframe';
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
  `;

  container.appendChild(iframe);

  console.log({ configInIframe: (window as any).onedeskWidgetConfig });

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

  if (!iframeDoc) {
    throw new Error('Iframe document not found');
  }

  const iframeRootDiv = iframeDoc.createElement('div');
  iframeRootDiv.id = 'widget-iframe-root';
  iframeDoc.body.appendChild(iframeRootDiv);

  const link = iframeDoc.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  iframeDoc.head.appendChild(link);

  // Add external JS
  const externalScript = iframeDoc.createElement('script');
  externalScript.src = jsUrl;
  externalScript.onload = () => {
    // Pass config to iframe after script loads
    iframe.contentWindow?.postMessage({ type: 'WIDGET_CONFIG', config }, '*');
  };
  iframeDoc.body.appendChild(externalScript);

  return iframe;
}

function getBaseUrl(): string {
  const script = document.currentScript as HTMLScriptElement;
  if (script && script.src) {
    const url = new URL(script.src);
    return `${url.protocol}//${url.host}`;
  }
  return window.location.origin;
}

initializeWidget();
