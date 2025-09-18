import { useState } from 'react';

interface WidgetConfig {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  bannerMessage: string;
  launcherText: string;
  formWithTicketFields: boolean;
  formTitle: string;
  submitButtonText: string;
  confirmationMessage: string;
  allowFileAttachments: boolean;
  enableCaptcha: boolean;
  widgetPosition: string;
  bottomOffset: number;
  horizontalOffset: number;
  buttonColor: string;
  buttonTextColor: string;
  buttonShape: string;
  embeddedCode: string;
  createdAt: string;
  updatedAt: string;
}

const Widget = ({ config }: { config: WidgetConfig }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isInIframe = window.self !== window.top;

  const handleClose = () => {
    setIsOpen(false);

    // If running in iframe, notify parent window
    if (isInIframe && window.parent) {
      window.parent.postMessage({ type: 'WIDGET_CLOSE' }, '*');
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (isInIframe && window.parent) {
      console.log('Sending message to parent');
      window.parent.postMessage(
        { type: isOpen ? 'WIDGET_CLOSE' : 'WIDGET_OPEN' },
        '*',
      );
    }
  };

  console.log({ configInWidget: config });

  return (
    <>
      {isOpen && (
        <>
          <div className='widget-container'>
            <div className='widget-header'>
              <h3>Widget Title</h3>
              <button onClick={handleClose}>Close</button>
            </div>

            <div className='widget-content'>
              <p>This is the widget content running in an iframe!</p>
              {/* Your widget content goes here */}
            </div>
          </div>
        </>
      )}
      <button className='widget-button' onClick={toggleWidget}>
        Open Widget
      </button>
    </>
  );
};

export default Widget;
