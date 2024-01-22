import React, { useState, useEffect, useContext } from 'react';
import { GameView } from '../GameView/GameView';
import { ModalContext } from '../Modal/ModalContext';
import Modal from '../Modal/Modal';

import {
  placeAllComputerShips,
  indexToCoords,
  putVesselInLayout,
  generateEmptyBoard,
  generateRandomIndex,
  getNeighbors,
  updateSunkShips,
  coordsToIndex,
} from '@/utils/utils';

import { SQUARE_STATE, Vessel, Hit, Ship } from '@/types/types';

const AVAILABLE_SHIPS: Ship[] = [
  {
    name: 'carrier',
    length: 5,
    placed: null,
  },
  {
    name: 'battleship',
    length: 4,
    placed: null,
  },
  {
    name: 'cruiser',
    length: 3,
    placed: null,
  },
  {
    name: 'submarine',
    length: 3,
    placed: null,
  },
];

export const Game = () => {
  const [gameState, setGameState] = useState<string>('placement');
  const [winner, setWinner] = useState<string | null>(null);

  const { isModalOpen, setIsModalOpen } = useContext(ModalContext);

  const [currentlyPlacing, setCurrentlyPlacing] = useState<Vessel | null>(null);
  const [placedShips, setPlacedShips] = useState<Vessel[]>([]);
  const [availableShips, setAvailableShips] = useState<Ship[]>(AVAILABLE_SHIPS);
  const [computerShips, setComputerShips] = useState<Vessel[]>([]);
  const [hitsByPlayer, setHitsByPlayer] = useState<Hit>([]);
  const [hitsByComputer, setHitsByComputer] = useState<Hit[]>([]);

  const totalHitsToWin = 15;

  /** Prevent right-click default action (context menu) so that right-clicks are only for changing ship orientation */
  useEffect(() => {
    const handleContextmenu = (e: MouseEvent): void => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextmenu);
    return function cleanup() {
      document.removeEventListener('contextmenu', handleContextmenu);
    };
  }, []);

  /** Blur background when Modal is open */
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('blur-background');
    } else {
      document.body.classList.remove('blur-background');
    }
    return () => {
      document.body.classList.remove('blur-background');
    };
  }, [isModalOpen]);

  /** Check for game-over condition */
  useEffect(() => {
    /** Calculate number of successful hits */
    const successfulPlayerHits = hitsByPlayer.filter(
      (hit: SQUARE_STATE) => hit.type === SQUARE_STATE.hit
    ).length;
    const successfulComputerHits = hitsByComputer.filter(
      (hit: SQUARE_STATE) => hit.type === SQUARE_STATE.hit
    ).length;

    if (
      successfulPlayerHits === totalHitsToWin ||
      successfulComputerHits === totalHitsToWin
    ) {
      setGameState('game-over');
      setWinner(
        successfulPlayerHits === totalHitsToWin ? 'player' : 'computer'
      );
      setIsModalOpen(true);
    }
  }, [hitsByPlayer, hitsByComputer, totalHitsToWin]);

  /** Player Actions */
  const selectShip = (shipName: string) => {
    let shipIdx = availableShips.findIndex((ship) => ship.name === shipName);
    const shipToPlace = availableShips[shipIdx];

    setCurrentlyPlacing({
      ...shipToPlace,
      orientation: 'horizontal',
      position: null,
    });
  };

  const placeShip = (currentlyPlacing: Vessel) => {
    setPlacedShips([
      ...placedShips,
      {
        ...currentlyPlacing,
        placed: true,
      },
    ]);

    setAvailableShips((previousShips) =>
      previousShips.filter((ship) => ship.name !== currentlyPlacing.name)
    );

    setCurrentlyPlacing(null);
  };

  const rotateShip = (event: React.MouseEvent) => {
    if (currentlyPlacing != null && event.button === 2) {
      setCurrentlyPlacing({
        ...currentlyPlacing,
        orientation:
          currentlyPlacing.orientation === 'vertical'
            ? 'horizontal'
            : 'vertical',
      });
    }
  };

  /** Start player's turn  */
  const startTurn = () => {
    generateComputerShips();
    setGameState('player-turn');
  };
  /** Change turns between player and computer */
  const changeTurn = () => {
    setGameState((oldGameState) =>
      oldGameState === 'player-turn' ? 'computer-turn' : 'player-turn'
    );
  };

  /** Computer Actions */
  const generateComputerShips = () => {
    let placedComputerShips = placeAllComputerShips(AVAILABLE_SHIPS.slice());
    setComputerShips(placedComputerShips);
  };

  const computerFire = (index: number, layout: SQUARE_STATE[]): void => {
    let computerHits: Hit[] = [...hitsByComputer];

    if (layout[index] === SQUARE_STATE.ship) {
      computerHits.push({
        position: indexToCoords(index),
        type: SQUARE_STATE.hit,
      });
    } else if (layout[index] === SQUARE_STATE.empty) {
      computerHits.push({
        position: indexToCoords(index),
        type: SQUARE_STATE.miss,
      });
    }
    const sunkShips = updateSunkShips(computerHits, placedShips);

    setPlacedShips(sunkShips);
    setHitsByComputer(computerHits);
  };

  /** Computer's turn logic */
  const handleComputerTurn = () => {
    changeTurn();

    /** Logic to decide computer's action */
    let layout: SQUARE_STATE[] = placedShips.reduce(
      (prevLayout, currentShip) =>
        putVesselInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
      generateEmptyBoard()
    );

    layout = hitsByComputer.reduce(
      (prevLayout, currentHit) =>
        putVesselInLayout(prevLayout, currentHit, currentHit.type),
      layout
    );

    layout = placedShips.reduce(
      (prevLayout, currentShip) =>
        currentShip.sunk
          ? putVesselInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
          : prevLayout,
      layout
    );

    const successfulComputerHits = hitsByComputer.filter(
      (hit: SQUARE_STATE) => hit.type === SQUARE_STATE.hit
    );

    const nonSunkComputerHits = successfulComputerHits.filter(
      (hit: SQUARE_STATE) => {
        const hitIndex = coordsToIndex(hit.position);
        return layout[hitIndex] === SQUARE_STATE.hit;
      }
    );

    let potentialTargets = nonSunkComputerHits
      .flatMap((hit: Hit) => getNeighbors(hit.position))
      .filter(
        (idx) =>
          layout[idx] === SQUARE_STATE.empty ||
          layout[idx] === SQUARE_STATE.ship
      );

    /** If there's a successful hit */
    if (potentialTargets.length === 0) {
      const layoutIndices = layout.map(
        (item: SQUARE_STATE, idx: number) => idx
      );
      potentialTargets = layoutIndices.filter(
        (index: number) =>
          layout[index] === SQUARE_STATE.ship ||
          layout[index] === SQUARE_STATE.empty
      );
    }

    const randomIndex = generateRandomIndex(potentialTargets.length);

    const target = potentialTargets[randomIndex];

    setTimeout(() => {
      computerFire(target, layout);
      changeTurn();
    }, 300);
  };

  /** Reset to play again */
  const startAgain = () => {
    setGameState('placement');
    setWinner(null);
    setCurrentlyPlacing(null);
    setPlacedShips([]);
    setAvailableShips(AVAILABLE_SHIPS);
    setComputerShips([]);
    setHitsByPlayer([]);
    setHitsByComputer([]);
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <GameView
        availableShips={availableShips}
        selectShip={selectShip}
        currentlyPlacing={currentlyPlacing}
        setCurrentlyPlacing={setCurrentlyPlacing}
        rotateShip={rotateShip}
        placeShip={placeShip}
        placedShips={placedShips}
        startTurn={startTurn}
        computerShips={computerShips}
        gameState={gameState}
        changeTurn={changeTurn}
        hitsByPlayer={hitsByPlayer}
        setHitsByPlayer={setHitsByPlayer}
        hitsByComputer={hitsByComputer}
        setHitsByComputer={setHitsByComputer}
        handleComputerTurn={handleComputerTurn}
        startAgain={startAgain}
        winner={winner}
        setComputerShips={setComputerShips}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        totalHitsToWin={totalHitsToWin}
      />
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div>
            <h2>Game Over</h2>
            <p>{winner === 'player' ? 'You win!' : 'You lose!'}</p>
            <button onClick={startAgain}>Play Again</button>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};
export default Game;
