import React from 'react';
import { render } from '@testing-library/react';
import ComputerBoard from './ComputerBoard';
import { generateEmptyBoard } from '../../utils/utils';

describe('ComputerBoard', () => {
  const mockSetCurrentlyPlacing = jest.fn();
  const mockRotateShip = jest.fn();
  const mockPlaceShip = jest.fn();
  const mockSetHitsByPlayer = jest.fn();
  const mockHandleComputerTurn = jest.fn();
  const mockSetComputerShips = jest.fn();

  const props = {
    currentlyPlacing: {
      name: 'testShip',
      length: 3,
      orientation: 'vertical',
      placed: null,
      position: [0, 0],
    },
    setCurrentlyPlacing: mockSetCurrentlyPlacing,
    rotateShip: mockRotateShip,
    placeShip: mockPlaceShip,
    placedShips: [],
    hitsByComputer: [],
    computerShips: [], 
    hitsByPlayer: [],
    gameState: 'start',
    setHitsByPlayer: mockSetHitsByPlayer, 
    handleComputerTurn: mockHandleComputerTurn,
    setComputerShips: mockSetComputerShips,
  };

  it('renders the component', () => {
    const { getByText } = render(<ComputerBoard {...props} />);
    expect(getByText('Computer')).toBeTruthy();
  });

  it('renders the correct number of squares', () => {
    const { getAllByTestId } = render(<ComputerBoard {...props} />);
    const squares = getAllByTestId(/square-/);
    expect(squares.length).toBe(generateEmptyBoard().length);
  });
});
