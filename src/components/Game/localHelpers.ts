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

export const AVAILABLE_SHIPS: Ship[] = [
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

/** Computer Actions */
export const generateComputerShips = (availableShips, setComputerShips) => {
    let placedComputerShips = placeAllComputerShips(AVAILABLE_SHIPS.slice());
    setComputerShips(placedComputerShips);
  };

export const computerFire = (index: number, layout: SQUARE_STATE[]): void => {
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
export const handleComputerTurn = () => {
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