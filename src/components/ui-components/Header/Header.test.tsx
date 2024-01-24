import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the component', () => {
    const { getByText } = render(<Header />);
    expect(getByText('BATTLESHIP')).toBeTruthy();
  });
});
