import { WidgetConfig } from './InteractiveWidget';
import { forwardRef } from 'preact/compat';

interface WidgetToggleButtonProps {
  handleClick?: () => void;
  style?: preact.JSX.CSSProperties;
  config: WidgetConfig;
}

const WidgetToggleButton = forwardRef<
  HTMLButtonElement,
  WidgetToggleButtonProps
>(({ handleClick, style, config }, ref) => {
  return (
    <button
      style={{
        ...style,
        border: 'none',
        padding: '12px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        outline: 'none',
      }}
      aria-label={config.launcherText}
      onClick={handleClick}
      ref={ref}
      className='shadow-resting-default!'
    >
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill={config.buttonTextColor}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.92 6.085c.081-.16.19-.299.327-.416a1.72 1.72 0 0 1 .477-.28c.181-.073.38-.107.596-.107.233 0 .44.04.626.12.187.08.348.193.48.34.134.147.239.323.315.53.077.206.115.437.115.692 0 .174-.016.334-.048.48-.032.146-.083.281-.154.405-.07.124-.162.24-.275.346-.113.107-.248.218-.405.334-.22.163-.37.3-.448.412-.078.112-.118.25-.118.414v.5a.75.75 0 0 1-1.5 0v-.5c0-.375.13-.706.388-.994.26-.287.606-.555 1.038-.806.216-.125.364-.24.443-.344.08-.104.12-.22.12-.35 0-.14-.04-.255-.118-.346-.078-.09-.19-.135-.334-.135-.14 0-.25.05-.328.15-.078.1-.117.224-.117.372a.75.75 0 1 1-1.5 0c0-.334.073-.626.22-.876ZM8 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z' />
      </svg>
      {config.launcherText}
    </button>
  );
});

export default WidgetToggleButton;

// Named export for better tree shaking
export { WidgetToggleButton };
// 42v 412 30
