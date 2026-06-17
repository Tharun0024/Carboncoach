// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionCard } from '../src/components/actions/ActionCard';
import { Action } from '../src/types';
import React from 'react';

const mockAssignedAction: Action = {
  id: 'act_01',
  category: 'transport',
  title: 'Swap Car for Walk',
  description: 'Walk or bike instead of driving.',
  impact_kgco2e_estimate: 5.4,
  difficulty: 'easy',
  status: 'assigned',
};

const mockCompletedAction: Action = {
  ...mockAssignedAction,
  status: 'completed',
};

const mockSkippedAction: Action = {
  ...mockAssignedAction,
  status: 'skipped',
};

describe('ActionCard Component', () => {
  it('renders action details: title, description, impact and difficulty', () => {
    render(<ActionCard action={mockAssignedAction} />);
    expect(screen.getByText('Swap Car for Walk')).toBeTruthy();
    expect(screen.getByText('Walk or bike instead of driving.')).toBeTruthy();
    expect(screen.getByText('-5.4 kg CO₂e')).toBeTruthy();
    expect(screen.getByText('easy')).toBeTruthy();
  });

  it('shows action buttons for assigned actions', () => {
    render(<ActionCard action={mockAssignedAction} />);
    expect(screen.getByRole('button', { name: /mark action 'Swap Car for Walk' as complete/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /skip action 'Swap Car for Walk' for this week/i })).toBeTruthy();
  });

  it('shows skipped reason input field when "Skip this week" is clicked', () => {
    render(<ActionCard action={mockAssignedAction} />);
    const skipBtn = screen.getByRole('button', { name: /skip action 'Swap Car for Walk' for this week/i });
    fireEvent.click(skipBtn);
    
    expect(screen.getByLabelText(/why did you skip this action/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /submit reason for skipping/i })).toBeTruthy();
  });

  it('renders completed message for completed actions', () => {
    render(<ActionCard action={mockCompletedAction} />);
    expect(screen.getByText('Completed! Great job!')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders skipped message for skipped actions', () => {
    render(<ActionCard action={mockSkippedAction} />);
    expect(screen.getByText('You skipped this action.')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('satisfies accessibility: verifies aria-label exists on active buttons', () => {
    render(<ActionCard action={mockAssignedAction} />);
    const completeBtn = screen.getByText('I did it!');
    const skipBtn = screen.getByText('Skip this week');
    
    expect(completeBtn.getAttribute('aria-label')).toBe("Mark action 'Swap Car for Walk' as complete");
    expect(skipBtn.getAttribute('aria-label')).toBe("Skip action 'Swap Car for Walk' for this week");
  });
});
