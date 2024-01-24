import {
  SQUARE_STATE,
  Coordinates,
  Hit,
  BoardLayout,
  Vessel,
} from '../types/types';

/** Constants for board dimensions */
export const BOARD_ROWS: number = 10;
export const BOARD_COLUMNS: number = 10;
export const BOARD: number = BOARD_COLUMNS * BOARD_ROWS;

/** Mapping of SQUARE_STATE to CSS class names */
export const stateToClass: Record<SQUARE_STATE, string> = {
  [SQUARE_STATE.empty]: 'empty',
  [SQUARE_STATE.ship]: 'ship',
  [SQUARE_STATE.hit]: 'hit',
  [SQUARE_STATE.miss]: 'miss',
  [SQUARE_STATE.ship_sunk]: 'ship-sunk',
  [SQUARE_STATE.forbidden]: 'forbidden',
  [SQUARE_STATE.awaiting]: 'awaiting',
};

/** Generate an empty game board */
export const generateEmptyBoard = (): SQUARE_STATE[] => {
  return new Array(BOARD_ROWS * BOARD_COLUMNS).fill(SQUARE_STATE.empty);
};

/** Convert coordinates to board index */
export const coordsToIndex = (coordinates: Coordinates): number => {
  return coordinates.y * BOARD_ROWS + coordinates.x;
};

/** Convert board index to coordinates */
export const indexToCoords = (index: number): Coordinates => {
  return {
    x: index % BOARD_ROWS,
    y: Math.floor(index / BOARD_ROWS),
  };
};

//* Get indices for a vessel's position on the board*/
export const vesselIndices = (vessel: Vessel): number[] => {
  if (!vessel.position) {
    return [];
  }
  const indices: number[] = [];
  for (let i = 0; i < vessel.length; i++) {
    indices.push(
      vessel.orientation === 'vertical'
        ? coordsToIndex({ x: vessel.position.x, y: vessel.position.y + i })
        : coordsToIndex({ x: vessel.position.x + i, y: vessel.position.y })
    );
  }
  return indices;
};

/** Check if a vessel is within the board boundaries */
export const isWithinBounds = (vessel: Vessel): boolean => {
  if (!vessel.position) {
    return false;
  } else
    return (
      (vessel.orientation === 'vertical' &&
        vessel.position.y + vessel.length <= BOARD_ROWS) ||
      (vessel.orientation === 'horizontal' &&
        vessel.position.x + vessel.length <= BOARD_COLUMNS)
    );
};

function isVessel(item: Hit | Vessel): item is Vessel {
  return (item as Vessel).orientation !== undefined;
}

/** Place or update a vessel on the board layout */
export const putVesselInLayout = (
  oldLayout: SQUARE_STATE[],
  item: Vessel | Hit,
  type: SQUARE_STATE
): SQUARE_STATE[] => {
  const newLayout = [...oldLayout];

  if (isVessel(item)) {
    if (
      type === SQUARE_STATE.ship ||
      type === SQUARE_STATE.forbidden ||
      type === SQUARE_STATE.ship_sunk
    ) {
      vesselIndices(item).forEach((idx) => {
        newLayout[idx] = type;
      });
    }
  } else {
    if (type === SQUARE_STATE.hit || type === SQUARE_STATE.miss) {
      newLayout[coordsToIndex(item.position)] = type;
    }
  }

  return newLayout;
};

/** Check if a placement position is free of other vessels */
export const isPlaceFree = (
  vessel: Vessel,
  layout: SQUARE_STATE[]
): boolean => {
  const shipIndices = vesselIndices(vessel);

  return shipIndices.every((idx: number) => layout[idx] === SQUARE_STATE.empty);
};

/** Calculate the overhang of a vessel beyond the board boundaries */
export const calculateOverhang = (vessel: Vessel): number => {
  if (!vessel.position) {
    return 0;
  }
  return Math.max(
    vessel.orientation === 'vertical'
      ? vessel.position.y + vessel.length - BOARD_ROWS
      : vessel.position.x + vessel.length - BOARD_COLUMNS,
    0
  );
};

/** Check if a vessel can be placed at a given position */
export const canBePlaced = (
  vessel: Vessel,
  layout: SQUARE_STATE[]
): boolean => {
  return isWithinBounds(vessel) && isPlaceFree(vessel, layout);
};

/** Place all computer ships randomly on the board */
export const placeAllComputerShips = (computerShips: Vessel[]): Vessel[] => {
  let compLayout: SQUARE_STATE[] = generateEmptyBoard();
  const MAX_ATTEMPTS = 1000;

  return computerShips.map((vessel: Vessel) => {
    let attempts = 0;
    /** If a ship can't be placed after 1000 attempts, the function will throw an error to prevent the possibility of an infinite loop. */
    while (attempts < MAX_ATTEMPTS) {
      const decoratedShip: Vessel = randomizeShipProps(vessel);

      if (canBePlaced(decoratedShip, compLayout)) {
        compLayout = putVesselInLayout(
          compLayout,
          decoratedShip,
          SQUARE_STATE.ship
        );
        return { ...decoratedShip, placed: true };
      }
      attempts++;
    }
    throw new Error(`Could not place ship after ${MAX_ATTEMPTS} attempts`);
  });
};

/** Generate a random orientation for computer ships */
export const generateRandomOrientation = (): 'vertical' | 'horizontal' => {
  const randomNumber = Math.floor(Math.random() * Math.floor(2));
  return randomNumber === 1 ? 'vertical' : 'horizontal';
};

/** Generate a random starting index for placing ships */
export const generateRandomIndex = (value = BOARD) => {
  return Math.floor(Math.random() * Math.floor(value));
};

/** Randomly assign properties to a ship */
export const randomizeShipProps = (vessel: Vessel) => {
  const randomStartIndex = generateRandomIndex();

  return {
    ...vessel,
    position: indexToCoords(randomStartIndex),
    orientation: generateRandomOrientation(),
  };
};

/** Update the layout with the current state of the ships (used for computer's board) */
export const placeCPUShipOnBoard = (
  vessel: Vessel,
  compLayout: BoardLayout
) => {
  const newCompLayout = compLayout.slice();

  vesselIndices(vessel).forEach((idx) => {
    newCompLayout[idx] = SQUARE_STATE.ship;
  });
  return newCompLayout;
};

/** Determine neighboring squares for a given set of coordinates (used for computer's firing logic) */
export const getNeighbors = (coords: Coordinates) => {
  const firstRow = coords.y === 0;
  const lastRow = coords.y === 9;
  const firstColumn = coords.x === 0;
  const lastColumn = coords.x === 9;

  /**  Check each direction and add to neighbors if within board bounds */
  const neighbors = [];
  // coords.y === 0;
  if (firstRow) {
    neighbors.push(
      { x: coords.x + 1, y: coords.y },
      { x: coords.x - 1, y: coords.y },
      { x: coords.x, y: coords.y + 1 }
    );
  }

  // coords.y === 9;
  if (lastRow) {
    neighbors.push(
      { x: coords.x + 1, y: coords.y },
      { x: coords.x - 1, y: coords.y },
      { x: coords.x, y: coords.y - 1 }
    );
  }
  // coords.x === 0
  if (firstColumn) {
    neighbors.push(
      { x: coords.x + 1, y: coords.y } /*right*/,
      { x: coords.x, y: coords.y + 1 } /*down*/,
      { x: coords.x, y: coords.y - 1 } /*up*/
    );
  }

  // coords.x === 9
  if (lastColumn) {
    neighbors.push(
      { x: coords.x - 1, y: coords.y }, // left
      { x: coords.x, y: coords.y + 1 }, // down
      { x: coords.x, y: coords.y - 1 } // up
    );
  }

  if (!lastColumn || !firstColumn || !lastRow || !firstRow) {
    neighbors.push(
      { x: coords.x - 1, y: coords.y }, // left
      { x: coords.x + 1, y: coords.y }, // right
      { x: coords.x, y: coords.y - 1 }, // up
      { x: coords.x, y: coords.y + 1 } // down
    );
  }
  /** Convert coordinates to board indices and filter out duplicates */
  const filteredResult = [
    ...new Set(
      neighbors
        .map((coords) => coordsToIndex(coords))
        .filter((number) => number >= 0 && number < BOARD)
    ),
  ];

  return filteredResult;
};

export const isShipSunk = (vessel: Vessel, hits: Hit[]): boolean => {
  if (!vessel.position) {
    return false;
  }
  // Create a set of coordinates representing the ship's position
  const shipCoordinates = new Set<string>();
  for (let i = 0; i < vessel.length; i++) {
    const coord: Coordinates =
      vessel.orientation === 'horizontal'
        ? { x: vessel.position.x + i, y: vessel.position.y }
        : { x: vessel.position.x, y: vessel.position.y + i };
    shipCoordinates.add(JSON.stringify(coord));
  }

  // Check if every part of the ship has been hit
  return Array.from(shipCoordinates).every((coordStr) =>
    hits.some((hit) => JSON.stringify(hit.position) === coordStr)
  );
};

/** Update the sunk state of ships based on hits received */
export const updateSunkShips = (
  currentHits: Hit[],
  opponentShips: Vessel[]
) => {
  const playerHitIndices = currentHits.map((hit) =>
    coordsToIndex(hit.position)
  );

  const indexWasHit = (index: number) => playerHitIndices.includes(index);

  const shipsWithSunkFlag = opponentShips.map((vessel: Vessel) => {
    const shipIndices = vesselIndices(vessel);
    if (shipIndices.every((idx) => indexWasHit(idx))) {
      return { ...vessel, sunk: true };
    } else {
      return { ...vessel, sunk: false };
    }
  });

  return shipsWithSunkFlag;
};
