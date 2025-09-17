import './styles/style.css';

function initializeWidget() {
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
}

function onReady() {
  try {
    const container = createContainer();
    const iframe = createWidgetIframe();

    container.appendChild(iframe);
    document.body.appendChild(container);
    const wigetFrameContainer = container.querySelector('.widget-iframe-root');

    window.addEventListener('message', function (event) {
      if (event.data.type === 'WIDGET_CLOSE') {
        document.documentElement.classList.remove('onedesk-widget-open');
        container.style.display = 'none';
      }
      if (event.data.type === 'WIDGET_OPEN') {
        document.documentElement.classList.add('onedesk-widget-open');
        container.style.display = 'block';
      }

      console.log('Message received:', event.data);
    });
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

const createContainer = () => {
  const container = document.createElement('div');
  container.id = 'onedesk-widget-container';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 500px;
    border: none;
    z-index: 9999;
  `;

  return container;
};

function createWidgetIframe(): HTMLIFrameElement {
  const iframe = document.createElement('iframe');

  iframe.id = 'widget-iframe';
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
  `;

  // Create iframe content using srcdoc
  const iframeContent = createIframeHTML();
  iframe.srcdoc = iframeContent;

  // Initially show just a button

  return iframe;
}

function createIframeHTML(): string {
  const baseUrl = process.env.WIDGET_IFRAME_URL || getBaseUrl();
  const cssUrl = `${baseUrl}/widget-iframe.css`;
  const jsUrl = `${baseUrl}/widget-iframe.js`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Widget Iframe</title>
      <link rel="stylesheet" href="${cssUrl}">
    </head>
    <body>
      <div id="widget-iframe-root"></div>

      <script src="${jsUrl}"></script>
    </body>
    </html>
  `;
}

function getBaseUrl(): string {
  const script = document.currentScript as HTMLScriptElement;
  if (script && script.src) {
    const url = new URL(script.src);
    return `${url.protocol}//${url.host}`;
  }
  return window.location.origin;
}

function getClientKey() {
  const script = document.currentScript as HTMLScriptElement;
  const clientKey = script?.getAttribute('data-client-key');

  if (!clientKey) {
    throw new Error('Missing data-client-key attribute');
  }

  return clientKey;
}

initializeWidget();
