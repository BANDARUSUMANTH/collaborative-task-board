import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
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

describe('Task Lifecycle: Edit, Status Transition, and Deletion', () => {
  beforeEach(async () => {
    localStorage.clear();
    await api.resetToSeedData();
    api.setSimulateError(false);
    api.setLatency(0);
  });

  it('allows editing an existing task', async () => {
    const user = userEvent.setup();
    renderTasksPage();

    const taskTitle = 'Configure Istio Service Mesh with mTLS';
    expect(await screen.findByText(taskTitle)).toBeInTheDocument();

    const editBtn = screen.getByLabelText(`Edit ${taskTitle}`);
    await user.click(editBtn);

    // Edit Modal should open
    const editDialog = await screen.findByRole('dialog');
    expect(editDialog).toBeInTheDocument();
    expect(screen.getByText(/edit task/i)).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/task title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Configure Istio Mesh with Mutual TLS v2');

    const saveBtn = within(editDialog).getByRole('button', { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByText('Configure Istio Mesh with Mutual TLS v2')).toBeInTheDocument();
    });
  });

  it('updates task status directly from dropdown', async () => {
    const user = userEvent.setup();
    renderTasksPage();

    const taskTitle = 'Configure Istio Service Mesh with mTLS';
    expect(await screen.findByText(taskTitle)).toBeInTheDocument();

    const statusDropdown = screen.getByLabelText(`Change status for task ${taskTitle}`);
    expect(statusDropdown).toHaveValue('in-progress');

    await user.selectOptions(statusDropdown, 'completed');

    await waitFor(() => {
      expect(statusDropdown).toHaveValue('completed');
    });
  });

  it('deletes a task with confirmation', async () => {
    const user = userEvent.setup();
    renderTasksPage();

    const taskTitle = 'Configure Istio Service Mesh with mTLS';
    expect(await screen.findByText(taskTitle)).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText(`Delete ${taskTitle}`);
    await user.click(deleteBtn);

    // Confirmation dialog should be presented
    const deleteDialog = await screen.findByRole('dialog');
    expect(deleteDialog).toBeInTheDocument();
    expect(screen.getByText(/delete task\?/i)).toBeInTheDocument();

    const confirmBtn = within(deleteDialog).getByRole('button', { name: /confirm delete/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(taskTitle)).not.toBeInTheDocument();
    });
  });
});
