import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

interface WelcomeScreenProps {
  startPlay: () => void;
}

const WelcomeScreen = ({ startPlay }: WelcomeScreenProps) => {
  return (
    <>
      <main>
        <div id="welcome-screen-container">
          <Header />
          <h2 className="game-info-box-title">Objective of the Game</h2>
          <p className="game-info">
            You and your opponent are captains in an epic sea battle. Your
            fleets cannot see each other and you&apos;re taking turns firing at
            each other. The player who sinks their opponent&apos;s four ships
            first, wins the game!
          </p>
          <button onClick={startPlay}>PLAY</button>
          <Footer />
        </div>
      </main>
    </>
  );
};

export default WelcomeScreen;
