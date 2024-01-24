import React from 'react';
import { render } from '@testing-library/react';
import PlayerBoard from './PlayerBoard';
import { generateEmptyBoard } from '@/utils/utils';

describe('ComputerBoard', () => {
  const mockPlaceShip = jest.fn();
  const mockSetCurrentlyPlacing = jest.fn();
  const mockRotateShip = jest.fn();

  const mockVessel = {
    name: 'submarine',
    length: 3,
    position: { x: 3, y: 1 },
    orientation: 'horizontal',
    placed: true,
    sunk: false,
  };

  const props = {
    currentlyPlacing: mockVessel,
    setCurrentlyPlacing: mockSetCurrentlyPlacing,
    rotateShip: mockRotateShip,
    placeShip: mockPlaceShip,
    placedShips: [],
    hitsByComputer: [],
  };

  it('renders the component', () => {
    const { getByText } = render(<PlayerBoard {...props} />);
    expect(getByText('Computer')).toBeTruthy();
  });

  it('renders the correct number of squares', () => {
    const { container } = render(<PlayerBoard {...props} />);
    const squares = container.querySelectorAll('.square');
    expect(squares.length).toBe(generateEmptyBoard().length);
  });
});
