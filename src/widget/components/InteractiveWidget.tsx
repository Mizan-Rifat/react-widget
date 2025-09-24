import '../../assets/css/app.css';
import WidgetToggleButton from './WidgetToggleButton';
import WidgetOverlay from './WidgetOverlay';
import { useEffect, useState } from 'preact/hooks';

const defaultConfig: WidgetConfig = {
  id: '01995b18-9605-7e42-8221-997b89416bc7',
  organizationId: '70cee37c-c4b0-4159-ad3a-18b7224a5045',
  name: 'HELLO',
  description: 'ASASA',
  bannerMessage: 'Welcome to example support',
  launcherText: 'Help',
  formWithTicketFields: true,
  formTitle: 'Feel free to ask anything',
  submitButtonText: 'Send',
  confirmationMessage: 'Your message has been sent',
  allowFileAttachments: true,
  enableCaptcha: false,
  widgetPosition: 'bottomRight',
  bottomOffset: 32,
  horizontalOffset: 32,
  buttonColor: '#1A7F37',
  buttonTextColor: '#FFFFFF',
  buttonShape: 'rounded',
  embeddedCode: 'd',
};

export interface WidgetConfig {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  bannerMessage: string;
  launcherText: string;
  formWithTicketFields?: boolean;
  formTitle: string;
  submitButtonText: string;
  confirmationMessage: string;
  allowFileAttachments?: boolean;
  enableCaptcha?: boolean;
  widgetPosition: 'bottomLeft' | 'bottomRight';
  bottomOffset: number;
  horizontalOffset: number;
  buttonColor: string;
  buttonTextColor: string;
  buttonShape: 'rounded' | 'square' | 'pill';
  embeddedCode: string;
}

interface InteractiveWidgetProps {
  config?: WidgetConfig;
}

const InteractiveWidget = ({
  config = defaultConfig,
}: InteractiveWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isInIframe = window.self !== window.top;

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (isInIframe && window.parent) {
      window.parent.postMessage(
        { type: isOpen ? 'WIDGET_CLOSE' : 'WIDGET_OPEN' },
        '*',
      );
    }
  };

  useEffect(() => {
    window.addEventListener('message', (event) => {
      console.log({ event });
    });
  }, []);

  return (
    <>
      <WidgetOverlay
        isOpen={isOpen}
        handleClose={toggleWidget}
        left={config.widgetPosition === 'bottomLeft' ? 0 : undefined}
        right={config.widgetPosition === 'bottomRight' ? 0 : undefined}
        config={config}
      />

      <WidgetToggleButton
        handleClick={toggleWidget}
        style={{
          background: isOpen ? 'white' : config.buttonColor,
          color: config.buttonTextColor,
          borderRadius:
            config.buttonShape === 'rounded'
              ? '8px'
              : config.buttonShape === 'pill'
                ? '9999px'
                : '0px',
          boxShadow:
            '0px 4px 16px rgba(37, 41, 46, 0.12), 0px 0px 1px 0px rgba(209, 217, 224, 0.5)',
          alignSelf:
            config.widgetPosition === 'bottomLeft' ? 'flex-start' : 'flex-end',
        }}
        config={config}
      />
    </>
  );
};

export default InteractiveWidget;

// Named export for better tree shaking
export { InteractiveWidget };
