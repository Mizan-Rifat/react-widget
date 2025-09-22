import WidgetContentForm from './WidgetContentForm';
import { WidgetConfig } from './InteractiveWidget';

interface WidgetOverlayContentProps {
  config: WidgetConfig;
  className?: string;
  handleClose?: () => void;
}

const WidgetOverlayContent = ({
  config,
  className,
  handleClose,
}: WidgetOverlayContentProps) => {
  return (
    <div className='w-[400px]'>
      <div
        className={`rounded-2xl border border-border-default w-full max-h-[625px] overflow-scroll ${className || ''}`}
        // style={{
        //   boxShadow: `
        //     0px 48px 96px -24px rgba(37, 41, 46, 0.08),
        //     0px 24px 48px -12px rgba(37, 41, 46, 0.08),
        //     0px 4px 32px -4px rgba(37, 41, 46, 0.08),
        //     0px 8px 16px -4px rgba(37, 41, 46, 0.08),
        //     0px 0px 1px 0px rgba(209, 217, 224, 0.5)
        //   `,
        // }}
      >
        <div className='flex justify-between pl-6 pr-4 pt-6 rounded-t-2xl text-fg-default'>
          <div>
            <h2 className='text-xl leading-8 font-semibold'>
              {config.bannerMessage}
            </h2>
            <p className='text-base leading-6 text-fg-muted'>
              {config.formTitle}
            </p>
          </div>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
            aria-label='Close'
            onClick={handleClose}
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z' />
            </svg>
          </button>
        </div>

        <WidgetContentForm config={config} />

        <div className='rounded-b-2xl w-full'>
          <p
            className='text-center mb-2 -mt-1'
            style={{ fontSize: '12px', color: '#656d76', margin: '0 0 8px 0' }}
          >
            Powered by
            <img
              className='inline h-2 ml-1'
              src={
                'https://one-desk-assets-dev1.s3.eu-north-1.amazonaws.com/logo/welcome-logo.png'
              }
              alt='logo'
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default WidgetOverlayContent;

// Named export for better tree shaking
export { WidgetOverlayContent };
