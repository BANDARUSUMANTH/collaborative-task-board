import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';
import { api } from '../src/services/api';

describe('Complete End-to-End User Journey (Section 9 Requirements)', () => {
  beforeEach(() => {
    localStorage.clear();
    api.setSimulateError(false);
    api.setLatency(0);
  });

  it('executes full 16-step user flow smoothly', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Step 1: Enter application and observe Dashboard
    expect(await screen.findByText(/operations dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/total projects/i)).toBeInTheDocument();

    // Step 2: Open Projects
    const projectsNavLinks = screen.getAllByRole('link', { name: /projects/i });
    await user.click(projectsNavLinks[0]);

    // Step 3: Observe project portfolio & Select a project
    expect(await screen.findByText(/project portfolio/i)).toBeInTheDocument();
    const openProjectLinks = screen.getAllByRole('link', { name: /open project/i });
    await user.click(openProjectLinks[0]);

    // Step 4: View Project Tasks
    expect(await screen.findByText(/project tasks/i)).toBeInTheDocument();

    // Step 5: Click Create a New Task
    const addTaskBtn = screen.getByRole('button', { name: /add task/i });
    await user.click(addTaskBtn);

    // Modal dialog opens
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Step 6: Submit invalid form (empty title) and observe validation
    const titleInput = screen.getByLabelText(/task title/i);
    await user.clear(titleInput);
    const createBtn = within(dialog).getByRole('button', { name: /create task/i });
    await user.click(createBtn);

    expect(screen.getByText(/task title is required/i)).toBeInTheDocument();

    // Step 7: Correct validation errors
    const uniqueTitle = 'Build Automated Zero Trust Pipeline';
    await user.type(titleInput, uniqueTitle);

    // Select High priority
    const prioritySelect = within(dialog).getByLabelText(/priority/i);
    await user.selectOptions(prioritySelect, 'high');

    // Step 8: Successfully create task
    await user.click(createBtn);

    // Modal closes and task is rendered
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByText(uniqueTitle)).toBeInTheDocument();
    });

    // Step 9: Search for the task using debounced search
    const searchInput = screen.getByPlaceholderText(/search tasks by title/i);
    await user.type(searchInput, 'Zero Trust');

    await waitFor(() => {
      expect(screen.getByText(uniqueTitle)).toBeInTheDocument();
    }, { timeout: 1500 });

    // Step 10: Filter by priority
    const priorityFilterSelect = screen.getByLabelText(/filter by task priority/i);
    await user.selectOptions(priorityFilterSelect, 'high');

    await waitFor(() => {
      expect(screen.getByText(uniqueTitle)).toBeInTheDocument();
    });

    // Step 11: Edit the task
    const editBtn = screen.getByLabelText(`Edit ${uniqueTitle}`);
    await user.click(editBtn);

    const editDialog = await screen.findByRole('dialog');
    expect(editDialog).toBeInTheDocument();
    const editTitleInput = within(editDialog).getByLabelText(/task title/i);
    const updatedTitle = 'Build Automated Zero Trust Pipeline v2';
    fireEvent.change(editTitleInput, { target: { value: updatedTitle } });

    // Step 12: Change its status to Completed
    const editStatusSelect = within(editDialog).getByLabelText(/status/i);
    await user.selectOptions(editStatusSelect, 'completed');

    const saveBtn = within(editDialog).getByRole('button', { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByText(updatedTitle)).toBeInTheDocument();
    });

    // Step 13: Verify Dashboard statistics are updated
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    await user.click(dashboardLink);

    expect(await screen.findByText(/operations dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(updatedTitle)).toBeInTheDocument();

    // Navigate back to tasks
    const tasksLink = screen.getByRole('link', { name: /all tasks/i });
    await user.click(tasksLink);

    expect(await screen.findByText(updatedTitle)).toBeInTheDocument();

    // Step 14: Delete the task
    const deleteBtn = screen.getByLabelText(`Delete ${updatedTitle}`);
    await user.click(deleteBtn);

    // Step 15: Confirm deletion in modal
    const deleteDialog = await screen.findByRole('dialog');
    expect(deleteDialog).toBeInTheDocument();
    const confirmDeleteBtn = within(deleteDialog).getByRole('button', { name: /confirm delete/i });
    await user.click(confirmDeleteBtn);

    // Step 16: Verify the task is removed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(updatedTitle)).not.toBeInTheDocument();
    });
  });
});
