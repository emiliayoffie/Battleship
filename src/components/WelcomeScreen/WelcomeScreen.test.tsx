import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import WelcomeScreen from './WelcomeScreen';

describe('WelcomeScreen', () => {
  const mockStartPlay = jest.fn();

  it('renders the component', () => {
    const { getByText } = render(<WelcomeScreen startPlay={mockStartPlay} />);
    expect(getByText('Objective of the Game')).toBeTruthy();
  });

  it('calls startPlay when the PLAY button is clicked', () => {
    const { getByText } = render(<WelcomeScreen startPlay={mockStartPlay} />);
    fireEvent.click(getByText('PLAY'));
    expect(mockStartPlay).toHaveBeenCalled();
  });
});