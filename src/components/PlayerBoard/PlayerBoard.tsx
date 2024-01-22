import React from 'react';
import {
  stateToClass,
  generateEmptyBoard,
  putVesselInLayout,
  indexToCoords,
  calculateOverhang,
  canBePlaced,
} from '@/utils/utils';

import { SQUARE_STATE, Vessel, Hit } from '@/types/types';

/** Render's player's board and handles ship placement
 *  * To do: move logic for generating computer board layout to separate function or hook to make this component cleaner and more focused */

type PlayerBoardProps = {
  currentlyPlacing?: Vessel;
  setCurrentlyPlacing: (vessel: Vessel) => void;
  rotateShip: React.MouseEventHandler<HTMLDivElement>;
  placeShip: (vessel: Vessel) => void;
  placedShips: Vessel[];
  hitsByComputer: Hit[];
};

const PlayerBoard = ({
  currentlyPlacing,
  setCurrentlyPlacing,
  rotateShip,
  placeShip,
  placedShips,
  hitsByComputer,
}: PlayerBoardProps) => {
/** Construct initial layout for player's board */
  let layout = placedShips.reduce(
    (prevLayout, currentShip) =>
      putVesselInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
    generateEmptyBoard()
  );

  /** Adds hits by the computer onto the player's board */
  layout = hitsByComputer.reduce(
    (prevLayout, currentHit) =>
      putVesselInLayout(prevLayout, currentHit, currentHit.type),
    layout
  );

/** Update the layout with sunk ships */
  layout = placedShips.reduce(
    (prevLayout, currentShip) =>
      currentShip.sunk
        ? putVesselInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
        : prevLayout,
    layout
  );

  /** Determine if the currently placing ship is over the board */
  const isPlacingOverBoard =
    currentlyPlacing && currentlyPlacing.position != null;
    /** Check if the current ship can be placed in its intended position */
  const canPlaceCurrentShip =
    isPlacingOverBoard && canBePlaced(currentlyPlacing, layout);

    /**Update the layout to show a preview of the ship placement*/
  if (isPlacingOverBoard) {
    if (canPlaceCurrentShip) {
      layout = putVesselInLayout(layout, currentlyPlacing, SQUARE_STATE.ship);
    } else {
      let forbiddenShip = {
        ...currentlyPlacing,
        length: currentlyPlacing.length - calculateOverhang(currentlyPlacing),
      };
      layout = putVesselInLayout(layout, forbiddenShip, SQUARE_STATE.forbidden);
    }
  }

/** Map the board layout to square elements */
  const squares = layout.map((square: SQUARE_STATE, index: number) => {
    return (
      <div
        onMouseDown={rotateShip}
        onClick={() => {
          if (canPlaceCurrentShip) {
            placeShip(currentlyPlacing);
          }
        }}
        className={`square ${stateToClass[square]}`}
        key={`square-${index}`}
        id={`square-${index}`}
        onMouseOver={() => {
          if (currentlyPlacing) {
            setCurrentlyPlacing({
              ...currentlyPlacing,
              position: indexToCoords(index),
            });
          }
        }}
      />
    );
  });

  return (
    <div>
      <h2 className="player-title">Player</h2>
      <div className="board">{squares}</div>
    </div>
  );
};

export default PlayerBoard;