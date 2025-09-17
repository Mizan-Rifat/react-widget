import './App.css';
import './widget/styles/style.css';

import { WidgetContainer } from './widget/components/widget-container.tsx';
import Widget from './widget/components/Widget.tsx';

function App() {
  return (
    <>
      <Widget />
      {/* <WidgetContainer clientKey={'test-key'} /> */}
    </>
  );
}

export default App;
