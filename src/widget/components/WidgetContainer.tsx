import { useState, useEffect } from 'react';
import { WidgetContext } from '../lib/context';
import { ThemeProvider } from '@primer/react';
import customTheme from '../../theme/theme';
import { BaseStyles } from '@primer/react';
import '../../assets/css/app.css';
import InteractiveWidget from './InteractiveWidget';
import { WidgetConfig } from './InteractiveWidget';

interface WidgetContainerProps {
  clientKey: string;
}

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

const WidgetContainer = ({ clientKey }: WidgetContainerProps) => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider theme={customTheme}>
      <BaseStyles>
        <WidgetContext.Provider value={{ isOpen, setIsOpen, clientKey }}>
          <div className='p-8'>
            <InteractiveWidget config={defaultConfig} />
          </div>
        </WidgetContext.Provider>
      </BaseStyles>
    </ThemeProvider>
  );
};

export default WidgetContainer;
