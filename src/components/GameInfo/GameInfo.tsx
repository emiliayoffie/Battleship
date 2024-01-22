import React from 'react';
import Modal from '../Modal/Modal';
import { SQUARE_STATE, Hit } from '@/types/types';

/** A presentational component for displaying game information.
 * It shows instructions/tips for ship placement and gameplay.
 * Includes restart button and game-over modal */

interface GameInfoProps {
  gameState: string;
  hitsByPlayer: Hit[];
  hitsByComputer: Hit[];
  startAgain: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  totalHitsToWin: number;
}

const GameInfo = ({
  hitsByPlayer,
  hitsByComputer,
  startAgain,
  isModalOpen,
  setIsModalOpen,
  totalHitsToWin,
}: GameInfoProps) => {
  let numberOfSuccessfulHits = hitsByPlayer.filter(
    (hit: Hit) => hit.type === SQUARE_STATE.hit
  ).length;
  let successfulComputerHits = hitsByComputer.filter(
    (hit: Hit) => hit.type === SQUARE_STATE.hit
  ).length;

  const closeModalAndRestart = () => {
    setIsModalOpen(false);
    startAgain();
  };
  let gameInfoPanel = (
    <div>
      <div id="firing-info">
        <ul></ul>
        <p className="game-info">
          Click on a cell to fire. The first to sink all 4 enemy ships wins.
        </p>
        <p className="restart" onClick={startAgain}>
          Restart
        </p>
      </div>
    </div>
  );

  const winner =
    numberOfSuccessfulHits === totalHitsToWin ? 'player' : 'computer';

  return (
    <div id="game-info">
      {numberOfSuccessfulHits === totalHitsToWin ||
      successfulComputerHits === totalHitsToWin ? (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModalAndRestart}
          setIsModalOpen={setIsModalOpen}
        >
          <div>
            <h2>Game Over</h2>
            <p>{winner === 'player' ? 'You win!' : 'You lose!'}</p>
            <button onClick={closeModalAndRestart}>Play Again</button>
          </div>
        </Modal>
      ) : (
        gameInfoPanel
      )}
    </div>
  );
};

export default GameInfo;
