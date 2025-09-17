import { useContext } from 'react';
import { WidgetContext } from '../lib/context';

export function Widget() {
  const { isOpen, setIsOpen } = useContext(WidgetContext);

  const isInIframe = window.self !== window.top;

  const handleClose = () => {
    setIsOpen(false);

    // If running in iframe, notify parent window
    if (isInIframe && window.parent) {
      window.parent.postMessage({ type: 'WIDGET_CLOSE' }, '*');
    }
  };

  if (!isOpen) {
    return (
      <button className='widget-button' onClick={() => setIsOpen(true)}>
        Open Widget
      </button>
    );
  }

  return (
    <div className='widget-container'>
      <div className='widget-header'>
        <h3>Widget Title</h3>
        <button onClick={handleClose}>Close</button>
      </div>

      <div className='widget-content'>
        <p>This is the widget content running in an iframe!</p>
        <p>Client Key: {useContext(WidgetContext).clientKey}</p>
        {/* Your widget content goes here */}
      </div>
    </div>
  );
}
