import { Button } from '@primer/react';
import { QuestionIcon } from '@primer/octicons-react';
import { WidgetConfig } from './InteractiveWidget';
import { forwardRef } from 'react';

interface WidgetToggleButtonProps {
  handleClick?: () => void;
  style?: React.CSSProperties;
  config: WidgetConfig;
}

const WidgetToggleButton = forwardRef<
  HTMLButtonElement,
  WidgetToggleButtonProps
>(({ handleClick, style, config }, ref) => {
  return (
    <Button
      style={style}
      aria-label={config.launcherText}
      leadingVisual={<QuestionIcon fill={config.buttonTextColor} />}
      variant='primary'
      onClick={handleClick}
      ref={ref}
      className='shadow-resting-default!'
    >
      {config.launcherText}
    </Button>
  );
});

export default WidgetToggleButton;
// 42v 412 30
