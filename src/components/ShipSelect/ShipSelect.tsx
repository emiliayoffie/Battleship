import React from 'react';
import { Ship } from '@/types/types';

/** Displays the currently selected ship */

interface ShipSelectProps {
  shipName: string;
  selectShip: (shipName: string) => void;
  availableShips: Ship[];
  isCurrentlyPlacing: boolean;
}

const ShipSelect = ({
  shipName,
  selectShip,
  availableShips,
  isCurrentlyPlacing,
}: ShipSelectProps) => {
  /** Find the ship object based on the shipName */
  const ship = availableShips.find((item) => item.name === shipName);

  /** Generate an array of div elements representing the squares of the ship */
  const shipLength = new Array(ship.length).fill('ship');
  const allSelectedShipSquares = shipLength.map((item, index) => (
    <div className="small-square" key={index} />
  ));

  return (
    <div
      id={`${shipName}-battleship`}
      onClick={() => selectShip(shipName)}
      key={`${shipName}`}
      className={isCurrentlyPlacing ? 'battleship placing' : 'battleship'}
    >
      <div className="ship-select-title">{shipName}</div>
      <div className="battleship-squares">{allSelectedShipSquares}</div>
    </div>
  );
};

export default ShipSelect;
