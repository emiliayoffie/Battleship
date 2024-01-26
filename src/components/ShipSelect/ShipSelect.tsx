import React from 'react';
import { Vessel } from '@/types/types';

/** Displays the currently selected ship */

interface ShipSelectProps {
  shipName: string;
  chooseShip: (shipName: string) => void;
  availableShips: Vessel[];
  isCurrentlyPlacing: boolean;
}

const ShipSelect = ({
  shipName,
  chooseShip,
  availableShips,
  isCurrentlyPlacing,
}: ShipSelectProps) => {
  /** Find the ship object based on the shipName */
  const ship = availableShips.find((item) => item.name === shipName);

  /** Generate an array of div elements representing the squares of the ship */
  const shipLength = new Array(ship?.length).fill('ship');
  const allSelectedShipSquares = shipLength.map((_, index) => (
    <div className="small-square" key={index} />
  ));

  return (
    <div
      id={`${shipName}-battleship`}
      onClick={() => chooseShip(shipName)}
      key={`${shipName}`}
      className={isCurrentlyPlacing ? 'battleship placing' : 'battleship'}
    >
      <div className="ship-select-title">{shipName}</div>
      <div className="battleship-squares">{allSelectedShipSquares}</div>
    </div>
  );
};

export default ShipSelect;
