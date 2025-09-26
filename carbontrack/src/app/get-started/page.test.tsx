import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GetStarted from './page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} />,
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} />,
  },
}));

describe('GetStarted', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders titles, images, and buttons', () => {
    render(<GetStarted />);
    expect(screen.getByText(/Carbon Track/i)).toBeInTheDocument();
    expect(screen.getByText(/Let’s get started, select your role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ktda manager/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /factory manager/i })).toBeInTheDocument();
  });

  it('navigates to KTDA manager signup on KTDA button click', async () => {
    render(<GetStarted />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /ktda manager/i }));
    expect(mockPush).toHaveBeenCalledWith('/ktda-manager-signup');
  });

  it('navigates to Factory manager signup on Factory button click', async () => {
    render(<GetStarted />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /factory manager/i }));
    expect(mockPush).toHaveBeenCalledWith('/factory-manager-signup');
  });
});
