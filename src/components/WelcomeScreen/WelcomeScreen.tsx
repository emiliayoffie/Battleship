import React from 'react';

interface WelcomeScreenProps {
  startPlay: () => void;
}

const WelcomeScreen = ({ startPlay }: WelcomeScreenProps) => {
  return (
    <main>
      <h2 className="game-info-box-title">Objective of the Game</h2>
      <p className="game-info">
        You and your opponent are captains in an epic sea battle. Your fleets
        cannot see each other and you're taking turns launching firing at
        each other. The player who sinks their opponent's four ships first, wins
        the game!
      </p>
      <button onClick={startPlay}>PLAY</button>
    </main>
  );
};

export default WelcomeScreen;
