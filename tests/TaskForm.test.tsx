import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskModal } from '../src/components/tasks/TaskModal';
import { TaskBoardProvider } from '../src/context/TaskBoardContext';
import { ToastProvider } from '../src/context/ToastContext';
import { SettingsProvider } from '../src/context/SettingsContext';
import { api } from '../src/services/api';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ToastProvider>
      <SettingsProvider>
        <TaskBoardProvider>{ui}</TaskBoardProvider>
      </SettingsProvider>
    </ToastProvider>
  );
};

describe('TaskForm Validation and Submission Experience', () => {
  beforeEach(() => {
    localStorage.clear();
    api.setSimulateError(false);
    api.setLatency(0); // Instant for tests
  });

  it('validates required fields when submitted empty', async () => {
    const user = userEvent.setup();
    const handleClose = () => {};

    renderWithProviders(
      <TaskModal isOpen={true} onClose={handleClose} />
    );

    // Wait for form to mount and elements to appear
    const titleInput = await screen.findByLabelText(/task title/i);
    expect(titleInput).toBeInTheDocument();

    // Clear title input
    await user.clear(titleInput);

    // Click submit
    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    // Expect validation errors
    expect(screen.getByText(/task title is required/i)).toBeInTheDocument();
  });

  it('submits successfully when required fields are populated', async () => {
    const user = userEvent.setup();
    let closed = false;
    const handleClose = () => {
      closed = true;
    };

    renderWithProviders(
      <TaskModal isOpen={true} onClose={handleClose} />
    );

    const titleInput = await screen.findByLabelText(/task title/i);
    await screen.findByRole('option', { name: /Cloud Native/i });

    await user.clear(titleInput);
    await user.type(titleInput, 'Deploy Canary Release to Cluster');

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(closed).toBe(true);
    });
  });

  it('preserves entered form data when API submission fails', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <TaskModal isOpen={true} onClose={() => {}} />
    );

    const titleInput = await screen.findByLabelText(/task title/i);
    await screen.findByRole('option', { name: /Cloud Native/i });

    // Enable error simulation for task creation
    api.setSimulateError(true);

    await user.clear(titleInput);
    await user.type(titleInput, 'Resilient Microservice Fallback');

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    // Should display error banner
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Form data must be preserved (not wiped out!)
    expect(titleInput).toHaveValue('Resilient Microservice Fallback');
  });

  it('prevents duplicate submissions while request is processing', async () => {
    const user = userEvent.setup();
    api.setLatency(150); // Set latency so button remains in pending state

    renderWithProviders(
      <TaskModal isOpen={true} onClose={() => {}} />
    );

    const titleInput = await screen.findByLabelText(/task title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Concurrent Mutation Guard Test');

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    // During submission, button should be disabled with loading text
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/saving\.\.\./i)).toBeInTheDocument();
  });
});
