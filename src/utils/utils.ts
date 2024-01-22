import {
  SQUARE_STATE,
  Coordinates,
  Hit,
  BoardLayout,
  Vessel,
} from '@/types/types';

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
  let indices: number[] = [];
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
  return (
    (vessel.orientation === 'vertical' &&
      vessel.position.y + vessel.length <= BOARD_ROWS) ||
    (vessel.orientation === 'horizontal' &&
      vessel.position.x + vessel.length <= BOARD_COLUMNS)
  );
};

/** Place or update a vessel on the board layout */
export const putVesselInLayout = (
  oldLayout: SQUARE_STATE[],
  vessel: Vessel,
  type: SQUARE_STATE
): SQUARE_STATE[] => {
  const newLayout = [...oldLayout];

  const getSquareState = (type: string): SQUARE_STATE => {
    switch (type) {
      case 'ship':
        return SQUARE_STATE.ship;
      case 'forbidden':
        return SQUARE_STATE.forbidden;
      case 'hit':
        return SQUARE_STATE.hit;
      case 'miss':
        return SQUARE_STATE.miss;
      case 'ship-sunk':
        return SQUARE_STATE.ship_sunk;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  };

  const squareState = getSquareState(type);

  if (type === 'ship' || type === 'forbidden' || type === 'ship-sunk') {
    vesselIndices(vessel).forEach((idx) => {
      newLayout[idx] = squareState;
    });
  } else if (type === 'hit' || type === 'miss') {
    newLayout[coordsToIndex(vessel.position)] = squareState;
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

  return computerShips.map((vessel: Vessel) => {
    while (true) {
      const decoratedShip: Vessel = randomizeShipProps(vessel);

      if (canBePlaced(decoratedShip, compLayout)) {
        compLayout = putVesselInLayout(
          compLayout,
          decoratedShip,
          SQUARE_STATE.ship
        );
        return { ...decoratedShip, placed: true };
      }
    }
  });
};

/** Generate a random orientation for computer ships */
export const generateRandomOrientation = (): 'vertical' | 'horizontal' => {
  let randomNumber = Math.floor(Math.random() * Math.floor(2));
  return randomNumber === 1 ? 'vertical' : 'horizontal';
};

/** Generate a random starting index for placing ships */
export const generateRandomIndex = (value = BOARD) => {
  return Math.floor(Math.random() * Math.floor(value));
};

/** Randomly assign properties to a ship */
export const randomizeShipProps = (vessel: Vessel) => {
  let randomStartIndex = generateRandomIndex();

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
  let newCompLayout = compLayout.slice();

  vesselIndices(vessel).forEach((idx) => {
    newCompLayout[idx] = SQUARE_STATE.ship;
  });
  return newCompLayout;
};

/** Determine neighboring squares for a given set of coordinates (used for computer's firing logic) */
export const getNeighbors = (coords: Coordinates) => {
  let firstRow = coords.y === 0;
  let lastRow = coords.y === 9;
  let firstColumn = coords.x === 0;
  let lastColumn = coords.x === 9;

  /**  Check each direction and add to neighbors if within board bounds */
  let neighbors = [];
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
      { x: coords.x + 1, y: coords.y }, // right
      { x: coords.x, y: coords.y + 1 }, // down
      { x: coords.x, y: coords.y - 1 } // up
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
  let filteredResult = [
    ...new Set(
      neighbors
        .map((coords) => coordsToIndex(coords))
        .filter((number) => number >= 0 && number < BOARD)
    ),
  ];

  return filteredResult;
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
