import React, { useState } from 'react';
import WelcomeScreen from '../ui-components/WelcomeScreen/WelcomeScreen';
import { Game } from '../Game/Game';

import '../../css/style.css';

const App = () => {
  const [appState, setAppState] = useState('welcome'); // play or welcome

  const startPlay = () => {
    setAppState('play');
  };

  /*Renders either Welcome Screen or Game*/
  return (
    <React.Fragment>
      {appState === 'play' ? <Game /> : <WelcomeScreen startPlay={startPlay} />}
    </React.Fragment>
  );
};

export default App;
