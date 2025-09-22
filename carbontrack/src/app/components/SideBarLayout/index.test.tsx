import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SidebarLayout from '.';


jest.mock('../../sharedComponents/KtdaSideBar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Mocked Sidebar</div>,
}));

describe('SidebarLayout', () => {
  test('renders Sidebar and children content with correct layout', () => {
    const testContent = 'Test Content';
    
    render(
      <SidebarLayout>
        <div data-testid="child-content">{testContent}</div>
      </SidebarLayout>
    );
    
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();

    const childContent = screen.getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    expect(childContent).toHaveTextContent(testContent);

    const container = sidebar.parentElement;
    expect(container).toHaveClass('flex');
    
    const mainElement = childContent.parentElement;
    expect(mainElement).toHaveClass('flex-grow');
 
    expect(container?.children[0]).toBe(sidebar);
    expect(container?.children[1]).toBe(mainElement);
  });
  
  test('renders multiple children correctly', () => {
    render(
      <SidebarLayout>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </SidebarLayout>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();

    const mainElement = screen.getByTestId('child1').parentElement;
    expect(mainElement).toContainElement(screen.getByTestId('child2'));
  });
  
  test('applies correct CSS classes to layout elements', () => {
    render(
      <SidebarLayout>
        <div>Content</div>
      </SidebarLayout>
    );

    const container = screen.getByTestId('sidebar').parentElement;
    const mainElement = screen.getByText('Content').parentElement;

    expect(container).toHaveClass('flex');
    expect(mainElement).toHaveClass('flex-grow');
  });
});