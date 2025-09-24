import { WidgetConfig } from './InteractiveWidget';
import { useEffect } from 'preact/hooks';
import WidgetContentForm from './WidgetContentForm';
import { Scrollbar } from 'smooth-scrollbar-react';

interface WidgetOverlayProps {
  config: WidgetConfig;
  isOpen: boolean;
  handleClose: () => void;
  left?: number;
  right?: number;
}

const WidgetOverlay = ({
  config,
  isOpen,
  handleClose,
  left,
  right,
}: WidgetOverlayProps) => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      handleClose();
    }
  };

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (
  //     isOpen &&
  //     buttonRef.current &&
  //     !buttonRef.current.contains(event.target as Node)
  //   ) {
  //     const overlayElement = document.querySelector('[data-widget-overlay]');
  //     if (overlayElement && !overlayElement.contains(event.target as Node)) {
  //       handleClose();
  //     }
  //   }
  // };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: config.bottomOffset,
        left: left,
        right: right,
        zIndex: 1001,
      }}
      className='bg-bg-overlay widget-overlay-enter'
    >
      <div className={`w-[400px] max-h-[625px] flex widget-content`}>
        <Scrollbar
          plugins={{
            overscroll: {
              effect: 'bounce',
            } as const,
          }}
          alwaysShowTracks={true}
        >
          <div className='flex justify-between items-start pl-6 pr-4 pt-6 rounded-t-2xl text-fg-default'>
            <div>
              <h2 className='text-xl leading-8 font-semibold'>
                {config.bannerMessage}
              </h2>
              <p className='text-base leading-6 text-fg-muted'>
                {config.formTitle}
              </p>
            </div>
            <button
              aria-label='Close'
              onClick={handleClose}
              className='text-fg-muted p-2 hover:bg-border-disabled rounded-md flex items-center justify-center cursor-pointer'
            >
              <svg
                aria-hidden='true'
                focusable='false'
                class='octicon octicon-x'
                viewBox='0 0 16 16'
                width='16'
                height='16'
                fill='currentColor'
                display='inline-block'
                overflow='visible'
                style='vertical-align: text-bottom;'
              >
                <path d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z'></path>
              </svg>
            </button>
          </div>

          <WidgetContentForm config={config} />

          <div className='rounded-b-2xl w-full bg-bg-muted py-2'>
            <p className='text-center text-xs leading-5 text-fg-muted'>
              Powered by{' '}
              <img
                className='inline h-2 ml-1'
                src={
                  'https://one-desk-assets-dev1.s3.eu-north-1.amazonaws.com/logo/welcome-logo.png'
                }
                alt='logo'
              />
            </p>
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

export default WidgetOverlay;

// Named export for better tree shaking
export { WidgetOverlay };
