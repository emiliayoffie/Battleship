import React, { useState } from 'react';
import { render } from 'react-dom';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';
import { Game } from '../Game/Game';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';


import '../../css/style.css';

const App = () => {
  const [appState, setAppState] = useState('welcome'); // play or welcome

  const startPlay = () => {
    setAppState('play');
  };

  // Renders either Welcome Screen or Game
  return (
    <React.Fragment>
      <Header />
      {appState === 'play' ? <Game /> : <WelcomeScreen startPlay={startPlay} />}
      <Footer />
    </React.Fragment>
  );
};

export default App;
