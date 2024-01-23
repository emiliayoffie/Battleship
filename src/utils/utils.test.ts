import {
  generateEmptyBoard,
  canBePlaced,
  coordsToIndex,
  isWithinBounds,
  BOARD_ROWS,
  BOARD_COLUMNS,
  indexToCoords,
  placeAllComputerShips,
} from './utils';

import {
  SQUARE_STATE,
  Coordinates,
  Hit,
  BoardLayout,
  Vessel,
} from '../types/types';

describe('utils', () => {
  describe('generateEmptyBoard', () => {
    it('should generate an empty game board of the correct size', () => {
      const board = generateEmptyBoard();
      expect(board.length).toBe(BOARD_ROWS * BOARD_COLUMNS);
      expect(board.every((state) => state === SQUARE_STATE.empty)).toBe(true);
    });
  });

  describe('coordsToIndex', () => {
    it('should convert coordinates to the correct board index', () => {
      const index = coordsToIndex({ x: 5, y: 3 });
      const expectedIndex = 3 * BOARD_ROWS + 5;
      expect(index).toBe(expectedIndex);
    });
  });

  describe('isWithinBounds', () => {
    it('should return true for a vessel within board boundaries', () => {
      const vessel: Vessel = {
        name: 'cruiser',
        length: 3,
        position: { x: 0, y: 0 },
        orientation: 'horizontal',
        placed: false,
      };
      expect(isWithinBounds(vessel)).toBe(true);
    });

    it('should return false for a vessel outside board boundaries', () => {
      const vessel: Vessel = {
        name: 'carrier',
        length: 5,
        position: { x: 7, y: 0 },
        orientation: 'horizontal',
        placed: false,
      };
      expect(isWithinBounds(vessel)).toBe(false);
    });
  });

  describe('generateEmptyBoard', () => {
    it('creates a 10x10 board with all squares empty', () => {
      const board = generateEmptyBoard();
      expect(board.length).toBe(100);
      expect(
        board.every((square) => square === SQUARE_STATE.empty)
      ).toBeTruthy();
    });
  });

  describe('coordinate and index conversions', () => {
    it('correctly converts coordinates to index', () => {
      expect(coordsToIndex({ x: 0, y: 0 })).toBe(0);
      expect(coordsToIndex({ x: 9, y: 9 })).toBe(99);
    });

    it('correctly converts index to coordinates', () => {
      expect(indexToCoords(0)).toEqual({ x: 0, y: 0 });
      expect(indexToCoords(99)).toEqual({ x: 9, y: 9 });
    });
  });
});

describe('canBePlaced', () => {
  it('returns true when the vessel can be placed', () => {
    const vessel: Vessel = {
      name: 'test',
      length: 3,
      position: { x: 0, y: 0 },
      orientation: 'horizontal',
      placed: false,
    };
    const board = generateEmptyBoard();
    expect(canBePlaced(vessel, board)).toBeTruthy();
  });
});

describe('placeAllComputerShips', () => {
    it('places all computer ships without overlap', () => {
      const computerShips: Vessel[] = [
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
  
      const placedShips = placeAllComputerShips(computerShips);
  
      // Check if all ships are placed
      expect(placedShips.every(ship => ship.placed)).toBeTruthy();
  
      // Create a board and place ships on it
      const board = generateEmptyBoard();
      placedShips.forEach(ship => {
        Array.from({ length: ship.length }).forEach((_, i) => {
          const index = ship.orientation === 'horizontal'
            ? coordsToIndex({ x: ship.position!.x + i, y: ship.position!.y })
            : coordsToIndex({ x: ship.position!.x, y: ship.position!.y + i });
          board[index] = SQUARE_STATE.ship;
        });
      });
  
      // Count the number of ship squares on the board
      const shipSquaresCount = board.filter(square => square === SQUARE_STATE.ship).length;
  
      // Calculate the total length of all ships
      const totalShipLength = 15;
  
      // Check if the number of ship squares on the board matches the total ship length
      expect(shipSquaresCount).toBe(totalShipLength);
    });
  });

// other functions to cover here: generateRandomOrientation, randomizeShipProps, placeCPUShip, getNeighbors, isShipSunk, updateSunkShips