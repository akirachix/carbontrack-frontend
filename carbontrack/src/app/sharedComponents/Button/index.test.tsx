import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import Button from '../Button';


describe('Button component', () => {
  it('renders with correct text', () => {
    render(<Button buttonText="Click Me" variant="primary" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  it('calls onclickHandler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button buttonText="Click Me" variant="primary" onclickHandler={handleClick} />);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('renders an icon if provided', () => {
    const Icon = <span data-testid="icon">Icon</span>;
    render(<Button buttonText="Click Me" variant="primary" icon={Icon} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
  it('applies the correct variant class', () => {
    render(<Button buttonText="Click Me" variant="secondary" />);
    const btn = screen.getByText('Click Me');
    expect(btn).toHaveClass('bg-[#F79B72]');
  });
});
it('defaults to type="button"', () => {
  render(<Button buttonText="Default" variant="primary" />);
  expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
});
it('respects type="submit"', () => {
  render(<Button buttonText="Submit" variant="primary" type="submit" />);
  expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
});