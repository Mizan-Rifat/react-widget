import React from 'react';

const WidgetButton = () => {
  return (
    <button className='widget-button' onClick={() => setIsOpen(true)}>
      Open Widget
    </button>
  );
};

export default WidgetButton;
