import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertModal from '.';

describe('AlertModal', () => {
  const onCloseMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with no alerts message when alert list is empty', () => {
    render(<AlertModal onClose={onCloseMock} alerts={[]} />);
    expect(screen.getByText(/no factories exceeding the emission threshold/i)).toBeInTheDocument();
  });

  it('renders a list of alert items correctly', () => {
    const alerts = [
      {
        factoryName: 'Factory A',
        emissionPerKg: 0.1234,
        complianceTarget: 0.1000,
        totalEmissions: 500,
        teaProcessedKg: 4000,
      },
      {
        factoryName: 'Factory B',
        emissionPerKg: 0.2345,
        complianceTarget: 0.2000,
        totalEmissions: 600,
        teaProcessedKg: 5000,
      },
    ];
    render(<AlertModal onClose={onCloseMock} alerts={alerts} />);

    alerts.forEach((alert) => {
      expect(screen.getByText(alert.factoryName)).toBeInTheDocument();
      expect(
        screen.getByText(
          new RegExp(`Emission per kg tea: ${alert.emissionPerKg.toFixed(4)} \\(Target: ${alert.complianceTarget.toFixed(4)}\\)`, 'i'),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`Total emissions: ${alert.totalEmissions.toFixed(2)} kg CO₂e`, 'i')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`Tea processed: ${alert.teaProcessedKg.toFixed(2)} kg`, 'i')),
      ).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', () => {
    render(<AlertModal onClose={onCloseMock} alerts={[]} />);
    const closeButton = screen.getByRole('button', { name: /close alert modal/i });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
