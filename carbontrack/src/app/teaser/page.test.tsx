import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Teaser from './page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    h1: (props: any) => <h1 {...props} />,
    p: (props: any) => <p {...props} />,
  },
}));;

describe('Teaser', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders titles and images', () => {
    render(<Teaser />);
    expect(screen.getByText(/Carbon Track/i)).toBeInTheDocument();
    expect(screen.getByText(/Track And Measure Your Carbon Emissions With Us/i)).toBeInTheDocument();
  });

  it('redirects to /get-started after 4 seconds', () => {
    render(<Teaser />);
    jest.advanceTimersByTime(4000);
    expect(mockPush).toHaveBeenCalledWith('/get-started');
  });
});
