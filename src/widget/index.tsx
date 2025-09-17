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
    const clientKey = getClientKey();
    const iframe = createWidgetIframe(clientKey);

    document.body.appendChild(iframe);

    // Listen for iframe ready message
    window.addEventListener('message', handleIframeMessage);
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

function createWidgetIframe(clientKey: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe');

  iframe.id = 'widget-iframe';
  iframe.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 400px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    background: white;
    display: none;
  `;

  // Create iframe content using srcdoc
  const iframeContent = createIframeHTML(clientKey);
  iframe.srcdoc = iframeContent;

  // Initially show just a button
  createWidgetButton(iframe, clientKey);

  return iframe;
}

function createIframeHTML(clientKey: string): string {
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
      <style>
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: white;
          overflow: hidden;
        }
        
        #widget-iframe-root {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        /* Override widget positioning for iframe context */
        .widget-container {
          position: relative !important;
          bottom: auto !important;
          right: auto !important;
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          z-index: auto !important;
        }
        
        .widget-button {
          position: relative !important;
          bottom: auto !important;
          right: auto !important;
          margin: 20px;
          z-index: auto !important;
        }
      </style>
    </head>
    <body>
      <div id="widget-iframe-root"></div>
      <script>
        // Store client key for widget initialization
        window.widgetClientKey = '${clientKey}';
        
        // Listen for messages from parent window
        window.addEventListener('message', function(event) {
          if (event.data.type === 'WIDGET_CONFIG') {
            window.widgetConfig = event.data.config;
            
            if (window.initializeWidgetIframe) {
              window.initializeWidgetIframe(event.data.config);
            }
          }
        });
        
        // Notify parent that iframe is ready
        window.addEventListener('load', function() {
          window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
        });
        
        window.sendMessageToParent = function(message) {
          window.parent.postMessage(message, '*');
        };
      </script>
      <script src="${jsUrl}"></script>
    </body>
    </html>
  `;
}

function createWidgetButton(iframe: HTMLIFrameElement, clientKey: string) {
  const button = document.createElement('button');
  button.textContent = 'Open Widget';
  button.id = 'widget-toggle-button';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    transition: all 0.2s ease;
  `;

  button.addEventListener('click', () => {
    iframe.style.display = 'block';
    button.style.display = 'none';

    // Send config to iframe
    iframe.onload = () => {
      iframe.contentWindow?.postMessage(
        {
          type: 'WIDGET_CONFIG',
          config: { clientKey, isOpen: true },
        },
        '*',
      );
    };
  });

  document.body.appendChild(button);
}

function handleIframeMessage(event: MessageEvent) {
  // Add origin validation for security in production
  // if (event.origin !== 'https://yourdomain.com') return;

  if (event.data.type === 'IFRAME_READY') {
    console.log('Widget iframe is ready');
  } else if (event.data.type === 'WIDGET_CLOSE') {
    const iframe = document.getElementById(
      'widget-iframe',
    ) as HTMLIFrameElement;
    const button = document.getElementById(
      'widget-toggle-button',
    ) as HTMLButtonElement;

    if (iframe) iframe.style.display = 'none';
    if (button) button.style.display = 'block';
  }
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
