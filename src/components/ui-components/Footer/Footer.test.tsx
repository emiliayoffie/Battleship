import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Header', () => {

  it('renders the component', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('Built by Emilia Yoffie')).toBeTruthy();
  });
});

