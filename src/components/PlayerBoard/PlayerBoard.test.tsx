import React from 'react';
import { render } from '@testing-library/react';
import PlayerBoard from './PlayerBoard'; 
import { generateEmptyBoard } from '../../utils/utils';


describe('PlayerBoard', () => {
  const mockSetCurrentlyPlacing = jest.fn();
  const mockRotateShip = jest.fn();
  const mockPlaceShip = jest.fn();

  const props = {
    currentlyPlacing: { 
      name: 'testShip', 
      length: 3, 
      orientation: 'vertical', 
      placed: null, 
      position: [0, 0] 
    },
    setCurrentlyPlacing: mockSetCurrentlyPlacing,
    rotateShip: mockRotateShip,
    placeShip: mockPlaceShip,
    placedShips: [],
    hitsByComputer: [],
  };

  it('renders without crashing', () => {
    const { getByText } = render(<PlayerBoard {...props} />);
    expect(getByText('Player')).toBeInTheDocument();
  });

  it('renders the correct number of squares', () => {
    const { getAllByTestId } = render(<PlayerBoard {...props} />);
    const squares = getAllByTestId(/square-/);
    expect(squares.length).toBe(generateEmptyBoard().length);
  });
});