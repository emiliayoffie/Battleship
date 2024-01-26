import React from 'react';

import PlayerFleet from '../PlayerFleet/PlayerFleet';
import PlayerBoard from '../PlayerBoard/PlayerBoard';
import ComputerBoard from '../ComputerBoard/ComputerBoard';
import GameInfo from '../GameInfo/GameInfo';
import { Hit, Vessel } from '@/types/types';
import Header from '../ui-components/Header/Header';
import Footer from '../ui-components/Footer/Footer';

interface GameViewProps {
  availableShips: Vessel[];
  chooseShip: (shipName: string) => void;
  currentlyPlacing: Vessel | undefined;
  setCurrentlyPlacing: React.Dispatch<React.SetStateAction<Vessel | undefined>>;
  rotateShip: React.MouseEventHandler<HTMLDivElement>;
  placeShip: (ship: Vessel) => void;
  placedShips: Vessel[];
  startTurn: () => void;
  computerShips: Vessel[];
  gameState: string;
  changeTurn: () => void;
  setHitsByComputer: React.Dispatch<React.SetStateAction<Hit[]>>;
  hitsByPlayer: Hit[];
  setHitsByPlayer: React.Dispatch<React.SetStateAction<Hit[]>>;
  hitsByComputer: Hit[];
  handleComputerTurn: () => void;
  winner: string | null;
  startAgain: () => void;
  setComputerShips: React.Dispatch<React.SetStateAction<Vessel[]>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalHitsToWin: number;
}

const GameView = ({
  availableShips,
  chooseShip,
  currentlyPlacing,
  setCurrentlyPlacing,
  rotateShip,
  placeShip,
  placedShips,
  startTurn,
  computerShips,
  gameState,
  hitsByPlayer,
  setHitsByPlayer,
  hitsByComputer,
  handleComputerTurn,
  startAgain,
  setComputerShips,
  isModalOpen,
  setIsModalOpen,
  totalHitsToWin,
}: GameViewProps) => {
  return (
    <div id="game-view-container">
      <Header />
      <section
        id={gameState === 'placement' ? 'ship-placement' : 'game-start'}
        className="game-screen"
      >
        {/* When not in the placement phase, show game info and computer board */}
        <PlayerBoard
          currentlyPlacing={currentlyPlacing}
          setCurrentlyPlacing={setCurrentlyPlacing}
          rotateShip={rotateShip}
          placeShip={placeShip}
          placedShips={placedShips}
          hitsByComputer={hitsByComputer}
        />

        {gameState !== 'placement' ? (
          <>
            <div id="game-info-placement">
              <GameInfo
                gameState={gameState}
                hitsByPlayer={hitsByPlayer}
                hitsByComputer={hitsByComputer}
                startAgain={startAgain}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                totalHitsToWin={totalHitsToWin}
              />
            </div>
            <ComputerBoard
              computerShips={computerShips}
              gameState={gameState}
              hitsByPlayer={hitsByPlayer}
              setHitsByPlayer={setHitsByPlayer}
              handleComputerTurn={handleComputerTurn}
              setComputerShips={setComputerShips}
            />
          </>
        ) : (
          <>
            {/* During the placement phase, show the player fleet */}
            <PlayerFleet
              availableShips={availableShips}
              chooseShip={chooseShip}
              currentlyPlacing={currentlyPlacing}
              startTurn={startTurn}
              startAgain={startAgain}
            />
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default GameView;
