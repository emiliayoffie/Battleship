import React from 'react';
import {
  stateToClass,
  generateEmptyBoard,
  indexToCoords,
  updateSunkShips,
  putVesselInLayout,
} from '@/utils/utils';

import { SQUARE_STATE, Hit, Vessel } from '@/types/types';

/** Renders the computer's board.
 * To do: move logic for generating computer board layout to separate function or hook to make this component cleaner and more focused */

type ComputerBoardProps = {
  computerShips: Vessel[];
  gameState: string;
  hitsByPlayer: Hit[];
  setHitsByPlayer: (hits: Hit[]) => void;
  handleComputerTurn: () => void;
  setComputerShips: (ships: Vessel[]) => void;
};

const ComputerBoard = ({
  computerShips,
  gameState,
  hitsByPlayer,
  setHitsByPlayer,
  handleComputerTurn,
  setComputerShips,
}: ComputerBoardProps) => {
  /** Create the initial layout of the computer's board */
  let compLayout = computerShips.reduce(
    (prevLayout, currentShip) =>
      putVesselInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
    generateEmptyBoard()
  );

  /** Add hits by player onto the computer's board layout */
  compLayout = hitsByPlayer.reduce(
    (prevLayout, currentHit) =>
      putVesselInLayout(prevLayout, currentHit, currentHit.type),
    compLayout
  );

  /** Update sunk ships on the computer's board layout */
  compLayout = computerShips.reduce(
    (prevLayout, currentShip) =>
      currentShip.sunk
        ? putVesselInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
        : prevLayout,
    compLayout
  );

  /** Handle player's firing at a square */
  const fireShot = (index: number): Hit[] => {
    const newHits: Hit[] = [...hitsByPlayer];

    /** Determine if the shot is a hit, miss or already hit */
    if (compLayout[index] === SQUARE_STATE.ship) {
      newHits.push({
        position: indexToCoords(index),
        type: SQUARE_STATE.hit,
      });
    } else if (compLayout[index] === SQUARE_STATE.empty) {
      newHits.push({
        position: indexToCoords(index),
        type: SQUARE_STATE.miss,
      });
    }

    /** Update payer's hits */
    setHitsByPlayer(newHits);
    return newHits;
  };

  /** check if it's the player's turn and if they can fire */
  const playerTurn = gameState === 'player-turn';
  const playerCanFire = playerTurn;

  /** Check if a square has already been hit */
  const alreadyHit = (index: number) =>
    compLayout[index] === SQUARE_STATE.hit ||
    compLayout[index] === SQUARE_STATE.miss ||
    compLayout[index] === SQUARE_STATE.ship_sunk;

  /** Map the computer's board layout to square elements */
  const compSquares = compLayout.map((square: SQUARE_STATE, index: number) => {
    return (
      <div
        className={
          stateToClass[square] === SQUARE_STATE.hit  ||
          stateToClass[square] === SQUARE_STATE.miss ||
          stateToClass[square] === SQUARE_STATE.ship_sunk
            ? `square ${stateToClass[square]}`
            : `square`
        }
        key={`comp-square-${index}`}
        id={`comp-square-${index}`}
        onClick={() => {
          if (playerCanFire && !alreadyHit(index)) {
            const newHits = fireShot(index);
            const shipsWithSunkFlag = updateSunkShips(newHits, computerShips);

            setComputerShips(shipsWithSunkFlag);
            handleComputerTurn();
          }
        }}
      />
    );
  });

  return (
    <div>
      <h2 className="player-title">Computer</h2>
      <div className="board">{compSquares}</div>
    </div>
  );
};

export default ComputerBoard;
