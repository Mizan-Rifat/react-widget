import WidgetToggleButton from './WidgetToggleButton';
import WidgetOverlay from './WidgetOverlay';
import { useRef, useState } from 'preact/hooks';

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
  config: WidgetConfig;
}

const InteractiveWidget = ({ config }: InteractiveWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isInIframe = window.self !== window.top;

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

  const exampleBoxRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: config.bottomOffset,
        left:
          config.widgetPosition === 'bottomLeft'
            ? config.horizontalOffset
            : 'auto',
        right:
          config.widgetPosition === 'bottomRight'
            ? config.horizontalOffset
            : 'auto',
        zIndex: 1000,
      }}
    >
      <div className='flex flex-col' ref={exampleBoxRef}>
        <WidgetOverlay
          isOpen={isOpen}
          handleClose={() => setIsOpen(false)}
          buttonRef={buttonRef}
          left={config.widgetPosition === 'bottomLeft' ? 0 : undefined}
          right={config.widgetPosition === 'bottomRight' ? 0 : undefined}
          config={config}
        />

        <WidgetToggleButton
          handleClick={toggleWidget}
          style={{
            background: config.buttonColor,
            color: config.buttonTextColor,
            borderRadius:
              config.buttonShape === 'rounded'
                ? '8px'
                : config.buttonShape === 'pill'
                  ? '9999px'
                  : '0px',
            boxShadow:
              '0px 4px 16px rgba(37, 41, 46, 0.12), 0px 0px 1px 0px rgba(209, 217, 224, 0.5)',
            // display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
            alignSelf:
              config.widgetPosition === 'bottomLeft'
                ? 'flex-start'
                : 'flex-end',
          }}
          ref={buttonRef}
          config={config}
        />
      </div>
    </div>
  );
};

export default InteractiveWidget;

// Named export for better tree shaking
export { InteractiveWidget };
