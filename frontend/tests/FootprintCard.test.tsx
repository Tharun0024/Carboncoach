// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FootprintCard } from '../src/components/dashboard/FootprintCard';
import React from 'react';

// Mock Recharts since JSDom lacks full Canvas / SVG layout rendering APIs
vi.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
    Pie: ({ children, data }: any) => (
      <div data-testid="pie">
        {data.map((d: any, i: number) => (
          <span key={i} data-testid="pie-slice" data-name={d.name} data-value={d.value} />
        ))}
        {children}
      </div>
    ),
    Cell: () => <div data-testid="cell" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

describe('FootprintCard Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<FootprintCard />);
    expect(container).toBeTruthy();
  });

  it('contains the responsive container wrapper', () => {
    render(<FootprintCard />);
    expect(screen.getByTestId('responsive-container')).toBeTruthy();
  });

  it('renders the pie chart element', () => {
    render(<FootprintCard />);
    expect(screen.getByTestId('pie-chart')).toBeTruthy();
  });

  it('has the correct data for carbon footprint categories', () => {
    render(<FootprintCard />);
    const slices = screen.getAllByTestId('pie-slice');
    expect(slices).toHaveLength(4);
    
    const data = slices.map(slice => ({
      name: slice.getAttribute('data-name'),
      value: Number(slice.getAttribute('data-value'))
    }));
    
    expect(data).toContainEqual({ name: 'Transport', value: 400 });
    expect(data).toContainEqual({ name: 'Energy', value: 300 });
    expect(data).toContainEqual({ name: 'Food', value: 200 });
    expect(data).toContainEqual({ name: 'Other', value: 100 });
  });

  it('satisfies accessibility: has role="img"', () => {
    render(<FootprintCard />);
    const mainDiv = screen.getByRole('img');
    expect(mainDiv).toBeTruthy();
  });

  it('satisfies accessibility: has a descriptive aria-label explaining the chart', () => {
    render(<FootprintCard />);
    const mainDiv = screen.getByRole('img');
    expect(mainDiv.getAttribute('aria-label')).toBe(
      'A pie chart showing your carbon footprint breakdown. Transport is 400 kg, Energy is 300 kg, Food is 200 kg, and Other is 100 kg.'
    );
  });
});
