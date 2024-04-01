import { useState } from 'react';
import Cron from './lib';

interface State {
  value?: string;
}

function App() {
  const [state, setState] = useState<State>({});

  return (
    <div>
      <Cron
        onChange={(e, text) => {
          setState({ value: e });
        }}
        value={state.value}
        showResultText
        showResultCron
      />
    </div>
  );
}

export default App;
