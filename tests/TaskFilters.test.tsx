import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TasksPage } from '../src/components/tasks/TasksPage';
import { TaskBoardProvider } from '../src/context/TaskBoardContext';
import { ToastProvider } from '../src/context/ToastContext';
import { SettingsProvider } from '../src/context/SettingsContext';
import { api } from '../src/services/api';

const renderTasksPage = () => {
  return render(
    <ToastProvider>
      <SettingsProvider>
        <TaskBoardProvider>
          <BrowserRouter>
            <TasksPage />
          </BrowserRouter>
        </TaskBoardProvider>
      </SettingsProvider>
    </ToastProvider>
  );
};

describe('Task Rendering, Search, and Filtering', () => {
  beforeEach(() => {
    localStorage.clear();
    api.setSimulateError(false);
    api.setLatency(0);
  });

  it('renders initial tasks properly', async () => {
    renderTasksPage();

    // Verify task title from seed data is rendered
    expect(await screen.findByText(/Configure Istio Service Mesh with mTLS/i)).toBeInTheDocument();
    expect(screen.getByText(/Migrate User Authentication Service/i)).toBeInTheDocument();
  });

  it('filters tasks using debounced search input', async () => {
    const user = userEvent.setup();
    renderTasksPage();

    expect(await screen.findByText(/Configure Istio Service Mesh with mTLS/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search tasks by title/i);
    await user.type(searchInput, 'Istio');

    // Wait for debounced search effect
    await waitFor(() => {
      expect(screen.getByText(/Configure Istio Service Mesh with mTLS/i)).toBeInTheDocument();
      expect(screen.queryByText(/Migrate User Authentication Service/i)).not.toBeInTheDocument();
    }, { timeout: 1500 });
  });

  it('displays empty state when search finds no results', async () => {
    const user = userEvent.setup();
    renderTasksPage();

    expect(await screen.findByText(/Configure Istio Service Mesh with mTLS/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search tasks by title/i);
    await user.type(searchInput, 'NonExistentTaskXYZ999');

    await waitFor(() => {
      expect(screen.getByText(/no matching tasks found/i)).toBeInTheDocument();
    }, { timeout: 1500 });
  });

  it('filters by status and clears filters properly', async () => {
    const user = userEvent.setup();
    renderTasksPage();

    expect(await screen.findByText(/Configure Istio Service Mesh with mTLS/i)).toBeInTheDocument();

    const statusSelect = screen.getByLabelText(/filter by task status/i);
    await user.selectOptions(statusSelect, 'completed');

    await waitFor(() => {
      // Completed task should be present
      expect(screen.getByText(/Migrate User Authentication Service/i)).toBeInTheDocument();
      // In-progress task should not be present
      expect(screen.queryByText(/Configure Istio Service Mesh with mTLS/i)).not.toBeInTheDocument();
    });

    // Clear filters button should be visible
    const clearBtn = screen.getByRole('button', { name: /clear all active filters/i });
    expect(clearBtn).toBeInTheDocument();
    await user.click(clearBtn);

    // After clearing, all tasks return
    await waitFor(() => {
      expect(screen.getByText(/Configure Istio Service Mesh with mTLS/i)).toBeInTheDocument();
    });
  });
});
