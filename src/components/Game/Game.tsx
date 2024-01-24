import React, { useState, useEffect, useContext } from 'react';
import GameView from '../GameView/GameView';
import { ModalContext } from '../Modal/ModalContext';

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

import { SQUARE_STATE, Vessel, Hit } from '@/types/types';

const AVAILABLE_SHIPS: Vessel[] = [
  {
    name: 'carrier',
    length: 5,
    placed: null,
    orientation: 'horizontal',
  },
  {
    name: 'battleship',
    length: 4,
    placed: null,
    orientation: 'horizontal',
    position: undefined,
  },
  {
    name: 'cruiser',
    length: 3,
    placed: null,
    orientation: 'horizontal',
    position: undefined,
  },
  {
    name: 'submarine',
    length: 3,
    placed: null,
    orientation: 'horizontal',
    position: undefined,
  },
];

export const Game = () => {
  const [gameState, setGameState] = useState<string>('placement');
  const [winner, setWinner] = useState<string | null>(null);

  const { isModalOpen, setIsModalOpen } = useContext(ModalContext);

  const [currentlyPlacing, setCurrentlyPlacing] = useState<Vessel | undefined>(
    undefined
  );
  const [placedShips, setPlacedShips] = useState<Vessel[]>([]);
  const [availableShips, setAvailableShips] = useState<Vessel[]>(
    AVAILABLE_SHIPS.map((ship) => ({
      ...ship,
      position: undefined,
      orientation: 'horizontal',
    }))
  );
  const [computerShips, setComputerShips] = useState<Vessel[]>([]);
  const [hitsByPlayer, setHitsByPlayer] = useState<Hit[]>([]);
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
      (hit: Hit) => hit.type === SQUARE_STATE.hit
    ).length;
    const successfulComputerHits = hitsByComputer.filter(
      (hit: Hit) => hit.type === SQUARE_STATE.hit
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
    const shipIdx = availableShips.findIndex((ship) => ship.name === shipName);
    const shipToPlace = availableShips[shipIdx];

    setCurrentlyPlacing({
      ...shipToPlace,
      orientation: 'horizontal',
      position: undefined,
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

    setCurrentlyPlacing(undefined);
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
    const placedComputerShips = placeAllComputerShips(
      AVAILABLE_SHIPS.slice().map((ship) => ({
        ...ship,
        position: undefined,
        orientation: 'horizontal',
      }))
    );
    setComputerShips(placedComputerShips);
  };

  const computerFire = (index: number, layout: SQUARE_STATE[]): void => {
    const computerHits: Hit[] = [...hitsByComputer];

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
        putVesselInLayout(
          prevLayout,
          currentHit,
          currentHit.type as SQUARE_STATE
        ),
      layout
    );

    layout = placedShips.reduce((prevLayout, currentShip) => {
      const squareState = currentShip.sunk
        ? SQUARE_STATE.ship_sunk
        : SQUARE_STATE.ship;
      return putVesselInLayout(prevLayout, currentShip, squareState);
    }, layout);

    const successfulComputerHits = hitsByComputer.filter(
      (hit: Hit) => hit.type === SQUARE_STATE.hit
    );

    const nonSunkComputerHits = successfulComputerHits.filter((hit: Hit) => {
      const hitIndex = coordsToIndex(hit.position);
      return layout[hitIndex] === SQUARE_STATE.hit;
    });

    let potentialTargets = nonSunkComputerHits
      .flatMap((hit: Hit) => getNeighbors(hit.position))
      .filter(
        (idx) =>
          layout[idx] === SQUARE_STATE.empty ||
          layout[idx] === SQUARE_STATE.ship
      );

    /** If there's a successful hit */
    if (potentialTargets.length === 0) {
      const layoutIndices = layout.map((_, idx: number) => idx);
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
    }, 400);
  };

  /** Reset to play again */
  const startAgain = () => {
    setGameState('placement');
    setWinner(null);
    setCurrentlyPlacing(undefined);
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
    </React.Fragment>
  );
};
export default Game;
