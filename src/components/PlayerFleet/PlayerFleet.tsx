import React from 'react';
import ShipSelect from '../ShipSelect/ShipSelect';
import { Vessel } from '@/types/types';

/** Displays the Player's Fleet */

interface PlayerFleetProps {
  availableShips: Vessel[];
  selectShip: (shipName: string) => void;
  currentlyPlacing: Vessel | undefined;
  startTurn: () => void;
  startAgain: () => void;
}

const PlayerFleet = ({
  availableShips,
  selectShip,
  currentlyPlacing,
  startTurn,
  startAgain,
}: PlayerFleetProps) => {
  const shipsLeft = availableShips.map((ship) => ship.name);

  /** Generate ShipSelect components for each available ship */
  const ShipSelects = shipsLeft.map((shipName) => (
    <ShipSelect
      selectShip={selectShip}
      key={shipName}
      isCurrentlyPlacing={
        !!(currentlyPlacing && currentlyPlacing.name === shipName)
      }
      shipName={shipName}
      availableShips={availableShips}
    />
  ));

  const fleet = (
    <div id="ship-fleet">
      {ShipSelects}
      <p className="game-info">Right-click to rotate ship before placement.</p>
      <p className="restart" onClick={startAgain}>
        Start Over
      </p>
    </div>
  );

  const playButton = (
    <div id="play-ready">
      <p className="game-info">Ready for battle.</p>
      <button id="play-button" onClick={startTurn}>
        Start game
      </button>
    </div>
  );

  return (
    <div id="available-ships">
      {availableShips.length > 0 && (
        <div className="game-info-box-title">Your Fleet</div>
      )}
      {availableShips.length > 0 ? fleet : playButton}
    </div>
  );
};

export default PlayerFleet;
