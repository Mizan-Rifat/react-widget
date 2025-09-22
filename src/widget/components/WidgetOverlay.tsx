import WidgetOverlayContent from './WidgetOverlayContent';
import { WidgetConfig } from './InteractiveWidget';
import { useEffect } from 'react';

interface WidgetOverlayProps {
  config: WidgetConfig;
  isOpen: boolean;
  handleClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  left?: number;
  right?: number;
}

const WidgetOverlay = ({
  config,
  isOpen,
  handleClose,
  buttonRef,
  left,
  right,
}: WidgetOverlayProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        const overlayElement = document.querySelector('[data-widget-overlay]');
        if (overlayElement && !overlayElement.contains(event.target as Node)) {
          handleClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose, buttonRef]);

  if (!isOpen) return null;

  return (
    <div
      data-widget-overlay
      style={{
        position: 'absolute',
        bottom: '40px',
        left: left !== undefined ? `${left}px` : undefined,
        right: right !== undefined ? `${right}px` : undefined,
        zIndex: 1001,
        boxShadow:
          '0px 8px 24px rgba(37, 41, 46, 0.12), 0px 0px 1px rgba(209, 217, 224, 0.5)',
        borderRadius: '16px',
        backgroundColor: 'white',
        border: 'none',
      }}
      className='rounded-2xl! border-none! shadow-floating-md!'
    >
      <WidgetOverlayContent config={config} handleClose={handleClose} />
    </div>
  );
};

export default WidgetOverlay;

// Named export for better tree shaking
export { WidgetOverlay };
