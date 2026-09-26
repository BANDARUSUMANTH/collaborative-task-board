# PulseBoard — Mentor Viva Defense & Advanced React Master Revision Guide

> **Important**: Keep this guide open or review it before your 1-on-1 evaluation with your mentor. It breaks down the exact architecture, the advanced React patterns used, how to explain them with authority, and answers to the toughest questions your mentor might ask.

---

## 1. The 60-Second Elevator Pitch

> *"PulseBoard is an enterprise collaborative task management platform engineered for scalable project delivery and high-volume task backlogs. Rather than building a simple toy Kanban board, I architected a production-grade system with an operations dashboard, multi-project portfolio management, accessible WCAG 2.1 AA dialogs, and a high-performance task engine. It remains fluid at 60 FPS even when handling 1,000+ tasks thanks to debounced search execution, memoized multi-dimensional filtering, and React.memo component boundaries. For network resilience, it implements optimistic UI mutations with automatic state rollback and form data preservation on simulated server failures."*

---

## 2. Advanced React Concepts Used & Why

### A. Performance Optimization (1,000 Tasks Usability — Section 10)
- **The Problem Without Optimization**:
  - In a project containing 1,000 tasks, every keystroke in a search bar would re-execute string matching, date parsing, and priority rank sorting across all 1,000 items on the main JavaScript thread.
  - Furthermore, modifying the status of just *one* task would trigger a re-render of all 1,000 `TaskCard` components, creating severe frame drops and noticeable input lag.
- **The Solution Implemented**:
  1. **Debounced Search (`useDebounce`)**: Decouples the live typing state from the heavy filter recalculation with a 250ms threshold.
  2. **Memoized Filtering Pipeline (`useTaskFilter`)**: Wraps multi-criteria filtering and multi-column sorting in `useMemo`. Numeric priority weights and timestamps are cached so string operations happen only when dependencies change. Live telemetry shows execution time is **under 3ms**!
  3. **Component Memoization (`React.memo` on `TaskCard`)**: Wrapped `TaskCard` in `React.memo` with a shallow equality check. When a single task updates, only that one card reconciles in the Virtual DOM — the other 999 cards skip rendering completely.
  4. **CSS Custom Properties for Density & Theming**: Theme switching (`light`/`dark`) and layout density (`comfortable`/`compact`) toggle CSS variables at the root document element without triggering full React subtree re-renders.

### B. Custom Hooks Architecture
- **`useDebounce<T>(value, delayMs)`**: Delays state propagation using `setTimeout` and cleans up pending timers in the return closure.
- **`useModalFocusTrap({ isOpen, onClose, initialFocusRef })`**:
  - Remembers the `document.activeElement` before the modal opens.
  - Automatically focuses the first form input on mount.
  - Intercepts `Tab` and `Shift + Tab` keydown events to trap focus strictly inside the dialog.
  - Listens for `Escape` to close the dialog.
  - Restores focus to the triggering element when the modal unmounts.
- **`useTaskFilter(tasks, filters)`**: Encapsulates searching, filtering, and sorting into a clean, reusable, memoized hook that tracks `executionTimeMs` via `performance.now()`.

### C. State Organization & Separation of Concerns
- **Why Context API instead of Redux?**:
  - Redux adds boilerplate and unnecessary bundle weight for an application of this scope.
  - We separated global state into three domain-specific Contexts:
    1. `TaskBoardContext`: Manages projects, tasks, team members, filters, CRUD mutations, and network simulation.
    2. `SettingsContext`: Handles theme, density, and view preferences with `localStorage` synchronization.
    3. `ToastContext`: Provides a centralized, accessible notification queue with action callbacks ("Retry").
- **Optimistic Updates & Rollback Mechanics**:
  - In `updateTask` and `deleteTask`, the UI state updates immediately (optimistic UI) for instant feedback.
  - A snapshot of previous state is captured.
  - If the API rejects (e.g. simulated 500 error), the state automatically rolls back to the snapshot and an alert toast appears with a **Retry** button.

### D. Accessibility & Semantic HTML (WCAG 2.1 AA)
- Every dialog has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- Form inputs have associated `<label htmlFor="...">`, `aria-required="true"`, and validation errors linked via `aria-describedby` and `aria-invalid`.
- Status and priority badges do **not rely on color alone**: each badge displays a distinct icon (`AlertCircle`, `Clock`, `CheckCircle2`) plus explicit text.
- Global high-contrast `:focus-visible` styling ensures seamless keyboard navigation.

---

## 3. Top 15 Mentor Questions & How to Answer Them

### Q1: "Why did you use `useMemo` for filtering tasks?"
**Answer**:
> *"Without `useMemo`, every render cycle of the parent component would re-filter and re-sort the entire task array from scratch. When a project has 1,000 tasks, recomputing date comparisons and priority rank weights synchronously on every render causes UI jank. `useMemo` ensures that calculations only occur when the task array or filter criteria actually change, executing in less than 2.5 milliseconds."*

### Q2: "How does your debouncing implementation work?"
**Answer**:
> *"I created a custom hook `useDebounce(value, delay)`. It stores a local debounced state and uses `useEffect` with `setTimeout`. Each time the user types a new character, the previous timer is cancelled via the effect's cleanup return function (`clearTimeout`), and a new timer starts. The debounced value only updates after the user stops typing for 250ms, which prevents 1,000-task re-sorts on every single keystroke."*

### Q3: "What happens if a user submits a task while the API is down or failing?"
**Answer**:
> *"We handle this in two critical ways: First, in `TaskModal.tsx`, the form inputs are **strictly preserved** in component state if the API call throws an error, and an inline error alert explains what happened. Second, for direct status toggles or deletions on the board, we use **optimistic UI updates with rollback**: the change reflects immediately, but if the API rejects, the UI rolls back to the pre-mutation snapshot and presents a toast notification with a 'Retry' action."*

### Q4: "How did you ensure the modal dialog is fully accessible?"
**Answer**:
> *"I built a custom `useModalFocusTrap` hook. When the modal mounts, it caches `document.activeElement`, then focuses the first input (`initialFocusRef`). It attaches a keydown listener: pressing `Tab` on the last focusable element wraps back to the first element, pressing `Shift+Tab` on the first element wraps to the last, and pressing `Escape` dismisses the modal. When the modal closes, focus is returned to the original trigger button."*

### Q5: "How does the app prevent duplicate form submissions?"
**Answer**:
> *"In `TaskModal.tsx`, we have an `isSubmitting` boolean state. When the submit button is clicked, `isSubmitting` is immediately set to `true`. This sets the HTML `disabled` attribute on the submit button and inputs, replaces the button icon with an animated spinner, and early-returns if `handleSubmit` is called concurrently."*

### Q6: "Why did you separate SettingsContext and TaskBoardContext?"
**Answer**:
> *"To avoid unnecessary re-renders. If theme or density changes were stored inside the same context as projects and tasks, every time a user toggles Dark Mode, all components consuming task state would be forced to re-render. By isolating them into distinct contexts, appearance updates happen independently of business data."*

### Q7: "How do you distinguish between 'no search results' and 'no filter results'?"
**Answer**:
> *"Our `EmptyState` component takes a `type` prop. In `TasksPage.tsx`, we evaluate whether `searchQuery` is populated or whether any filter (`status !== 'all'`, `priority !== 'all'`, etc.) is active. If a search query is active, it renders a 'No search matches for [query]' empty state. If filters are active, it renders a 'No tasks match selected filters' state with a single-click 'Clear Filters' button."*

### Q8: "How does your mock API simulate real asynchronous behavior?"
**Answer**:
> *"Our MockApiService (`api.ts`) wraps all operations in Promises with a configurable `delay()` method (ranging from 0ms to 1500ms). It persists data to `localStorage` so changes persist across page reloads. We also added an error simulation toggle that artificially throws HTTP 500 errors to test and demonstrate error handling and rollback resilience."*

### Q9: "What would happen if the project had 1,000 tasks without your optimizations?"
**Answer**:
> *"Without debouncing, typing in the search bar would cause keyboard input stuttering because the main thread would freeze to sort 1,000 strings on every character. Without `React.memo`, changing a task status would cause 1,000 component reconciliations, dropping the browser frame rate from 60 FPS down to 15–20 FPS. With our memoization and debouncing, the app maintains a steady 60 FPS and filtering takes less than 3ms."*

### Q10: "Why did you use Vanilla CSS instead of Tailwind?"
**Answer**:
> *"Vanilla CSS with CSS Custom Properties gives complete architectural control over design tokens, light/dark mode themes, and density scaling with **zero JavaScript runtime overhead**. Switching themes simply changes the `data-theme` attribute on the document root, allowing CSS variables to update natively in sub-milliseconds."*

### Q11: "Explain how React Router navigation works without full browser reload."
**Answer**:
> *"We use React Router's `<BrowserRouter>`, `<Routes>`, and `<NavLink>` components. Navigation uses the HTML5 History API (`pushState` / `replaceState`) to manipulate the URL path client-side. React intercepts route transitions, mounting and unmounting the relevant route components in place without sending a new document request to the server."*

### Q12: "How did you handle the 404 / Not Found page requirement?"
**Answer**:
> *"In `App.tsx`, we have a wildcard route `<Route path="*" element={<NotFoundPage />} />` at the end of the routing table. If a user navigates to an invalid path or an invalid project ID, the high-contrast `NotFoundPage` is displayed with an 'HTTP 404 Error' badge and a direct navigation link back to the Dashboard."*

### Q13: "What automated tests did you write, and what do they verify?"
**Answer**:
> *"We have 12 tests across 4 comprehensive test suites in Vitest and React Testing Library:
> 1. `TaskForm.test.tsx`: Validates required fields, successful creation, form data preservation on simulated API 500 error, and duplicate submission prevention.
> 2. `TaskFilters.test.tsx`: Verifies task rendering, debounced text search, status filtering, and empty search/filter states.
> 3. `TaskLifecycle.test.tsx`: Tests task editing, inline status transitions to 'completed', and deletion with confirmation.
> 4. `UserJourney.test.tsx`: Runs the full 16-step end-to-end user journey specified in Section 9 of the requirements."*

### Q14: "How does the layout density preference work?"
**Answer**:
> *"In `SettingsContext`, the user can toggle between 'Comfortable' and 'Compact' density. This sets a `data-density` attribute on `<html>`. In `index.css`, we define CSS variables like `--card-padding`, `--item-gap`, and `--table-padding-y`. When 'compact' is selected, padding decreases from 1.25rem to 0.75rem, fitting more tasks onto the screen for power users."*

### Q15: "Why did you use deep cloning for seed data in the mock API?"
**Answer**:
> *"If `INITIAL_TASKS` or `INITIAL_PROJECTS` are returned by reference in JavaScript, modifying an element (`tasks[0].title = ...`) mutates the original in-memory seed array. In automated test environments or when clicking 'Reset Data', returning deep clones (`JSON.parse(JSON.stringify(...))`) guarantees that each test or reset starts with pristine, unpolluted data."*

---

## 4. Live Mentor Demonstration Script (Step-by-Step)

Follow these exact steps when presenting your project to achieve 20/20 marks:

1. **Start on Dashboard (`/`)**:
   - Point out the real-time KPI tiles: Total Projects, Total Tasks, Completed Tasks, Pending Tasks, and High-Priority items.
   - Show the Project Progress Overview bars and the Recently Updated Tasks activity feed.
2. **Navigate to Projects (`/projects`)**:
   - Show the project portfolio grid. Point out the completion percentages, owner names, target dates, and team member avatars.
3. **Open a Project (`/projects/proj-1`)**:
   - Show the project detail hero card, progress bar, and scoped task list.
4. **Demonstrate 16-Step Flow**:
   - Click **Add Task**.
   - Click submit on the empty form -> **Show validation error**: *"Task title is required."*
   - Type a title: *"Build Automated Zero Trust Pipeline"*, select High priority, click Create -> **Show successful addition**.
   - Type *"Zero Trust"* in the search bar -> **Show instant debounced filtering**.
   - Filter by **High Priority** -> **Show matching results and active filter chips**.
   - Click **Edit Task** -> update title and change status to **Completed** -> **Show updated badge**.
   - Navigate back to **Dashboard** -> **Show updated KPI statistics** and the task appearing in Recent Activity!
   - Navigate back to **Tasks** -> Click **Delete Task** -> **Show accessible confirmation modal** -> confirm deletion -> task is removed.
5. **Showcase 1,000 Tasks Benchmark (Section 10 Requirement)**:
   - Click **1,000 Tasks Benchmark** in the filter bar.
   - Click **Inject 1,000 Tasks Now**.
   - Show the counter update to **1,000+ tasks**!
   - Scroll smoothly through the columns to demonstrate **fluid 60 FPS scrolling**.
   - Type into the search bar: show the **Filter Time badge** displaying `< 3.00ms`! Explain the `useMemo` and `useDebounce` optimizations.
6. **Demonstrate Network Error Resilience (Section 8 & 13 Requirement)**:
   - On the top diagnostic bar, click **Simulate Failed API**.
   - Click **Create Task**, enter a title, and submit.
   - Show that the request fails, an error banner is displayed, and **the user's entered form data is completely preserved**!
   - Turn off error mode and submit -> task creates cleanly.
7. **Demonstrate Preferences & Persistence**:
   - Toggle **Theme** from Dark to Light and back.
   - Toggle **Density** from Comfortable to Compact (point out tighter padding).
   - Switch from **Kanban Board** to **Data Table** view.
   - Refresh the browser (`F5`) -> show that the preferences and all data persisted in `localStorage`!
8. **Show Automated Tests**:
   - Run `npm test` in the terminal to show all **12 tests passing green**!
