import { Heading, IconButton, Text } from '@primer/react';
import { XIcon } from '@primer/octicons-react';
import WidgetContentForm from './WidgetContentForm';
import { WidgetConfig } from './InteractiveWidget';
import classNames from 'classnames';

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
    <div className='max-w-[375px] w-full '>
      <div
        className={classNames(
          'rounded-2xl border-border-default w-full max-h-[625px] overflow-scroll',
          className,
        )}
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
        <div className='flex justify-between pl-6 pr-4 pt-6 rounded-t-2xl'>
          <div>
            <Heading variant='medium'>{config.bannerMessage}</Heading>
            <Text variant='medium' color='fg.muted'>
              {config.formTitle}
            </Text>
          </div>
          <IconButton
            variant='invisible'
            aria-label='Close'
            icon={XIcon}
            onClick={handleClose}
          />
        </div>

        <WidgetContentForm config={config} />

        <div className='rounded-b-2xl w-full'>
          <Text
            className='text-center mb-2 -mt-1'
            size='small'
            as='p'
            color='fg.muted'
          >
            Powered by
            <img
              className='inline h-2 ml-1'
              src={
                'https://one-desk-assets-dev1.s3.eu-north-1.amazonaws.com/logo/welcome-logo.png'
              }
              alt='logo'
            />
          </Text>
        </div>
      </div>
    </div>
  );
};

export default WidgetOverlayContent;
