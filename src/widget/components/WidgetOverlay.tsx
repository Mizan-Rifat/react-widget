import WidgetOverlayContent from './WidgetOverlayContent';
import { WidgetConfig } from './InteractiveWidget';
import { Overlay } from '@primer/react';

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
  if (!isOpen) return null;

  return (
    <Overlay
      initialFocusRef={buttonRef}
      returnFocusRef={buttonRef}
      ignoreClickRefs={[buttonRef]}
      onEscape={handleClose}
      onClickOutside={handleClose}
      anchorSide='outside-top'
      bottom={40}
      left={left}
      right={right}
      width='medium'
      portalContainerName='onedesk-widget-overlay'
      className='rounded-2xl! border-none! shadow-floating-md!'
    >
      <WidgetOverlayContent config={config} handleClose={handleClose} />
    </Overlay>
  );
};

export default WidgetOverlay;
