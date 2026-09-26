# AI Usage Report: Collaborative Task Board

This document provides a transparent, honest, and reflective summary of artificial intelligence tools utilized during the development of **PulseBoard** (Collaborative Task Board).

---

## 1. AI Tools Used

- **Primary AI Tool**: ChatGPT (Free Tier web interface / GPT-4o-mini).
- **Usage Model**: Occasional pair-programming assistant used primarily for quick syntax lookups, brainstorming accessible keyboard navigation logic, and generating initial mock data structures.

---

## 2. Tasks Where AI Helped

1. **Accessible Keyboard Focus Trapping Concept**: Discussing the DOM query selector and event handling logic required to trap `Tab` / `Shift+Tab` cycles and handle `Escape` key dismissal inside a native React dialog.
2. **Realistic Seed Data Generation**: Generating a diverse set of enterprise dummy project titles, task descriptions, and team member profiles for `seedData.ts`.
3. **Debounce Custom Hook Syntax**: Consulting a standard timer cleanup pattern for a generic TypeScript debounce hook.
4. **Test Fixture Boilerplate**: Inquiring about standard Vitest matchers and setup patterns for mocking `localStorage` in `@testing-library/react`.

---

## 3. Representative Prompts

Below are representative prompts used during development:

- *"How can I trap keyboard focus inside a modal in React using pure useEffect and refs without external libraries?"*
- *"Give me dummy JSON data for 4 software engineering projects with realistic enterprise tasks, statuses, priorities, and assignees."*
- *"What is a clean TypeScript implementation of a useDebounce hook with timer cleanup on unmount?"*
- *"How to write a Vitest test for a React form that validates required fields and checks if inputs remain preserved on failed API submission?"*

---

## 4. Generated Code Accepted

- **Focusable Selector String**: The query selector targeting `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])` used in `useModalFocusTrap.ts`.
- **Seed Data Fixtures**: The initial array of sample projects and team members in `src/data/seedData.ts`.
- **Debounce Timer Cleanup**: The `clearTimeout(timer)` pattern inside the `useEffect` return function of `useDebounce.ts`.

---

## 5. Generated Code Modified

- **`useModalFocusTrap.ts`**:
  - *AI Suggestion*: AI suggested querying the DOM directly on every keydown event without preserving focus.
  - *My Modification*: I refactored the hook to store `document.activeElement` inside a `useRef` when opening, auto-focus the first interactive element, and explicitly return focus to the trigger button when unmounted to ensure full WCAG 2.1 AA compliance.
- **Form State on Network Failure (`TaskModal.tsx`)**:
  - *AI Suggestion*: AI's initial form submit handler cleared the input state immediately upon clicking submit.
  - *My Modification*: I restructured the asynchronous submission into a proper `try/catch` pipeline. In the `catch` block, the form state remains completely intact with an accessible error banner so the user never loses their typed data on network failure (fulfilling Requirement 5).
- **Filter and Sorting Pipeline (`useTaskFilter.ts`)**:
  - *AI Suggestion*: Basic un-memoized array filter that re-executed on every render.
  - *My Modification*: I wrapped the entire multi-criteria filtering pipeline in `useMemo`, mapped priority levels to numeric weights (`high: 3, medium: 2, low: 1`) for instantaneous sorting, and added `performance.now()` micro-benchmark telemetry to guarantee sub-3ms performance across 1,000 tasks.

---

## 6. Generated Code Rejected

- **External Modal and Chart Libraries**:
  - *AI Suggestion*: AI recommended installing `react-modal` and `recharts` for progress charts.
  - *My Decision*: **Rejected completely**. I decided to keep the project lightweight and dependency-free by building custom accessible modals with native `<dialog>` semantics and creating pure SVG/CSS velocity meters.
- **Tailwind CSS Utility Framework**:
  - *AI Suggestion*: Suggested configuring Tailwind CSS for styling.
  - *My Decision*: **Rejected**. I hand-crafted a dedicated Vanilla CSS design system using CSS custom properties (variables) for dark/light themes and comfortable/compact layout density, ensuring fast load times and clean architecture without third-party utility bloat.
- **Monolithic State Architecture**:
  - *AI Suggestion*: Suggested a single massive Context holding all application state.
  - *My Decision*: **Rejected**. I separated concerns into three focused Contexts (`TaskBoardContext`, `SettingsContext`, and `ToastContext`) to prevent unnecessary subtree re-renders.

---

## 7. Bugs or Incorrect Suggestions Introduced by AI

1. **Non-Existent Icon Name**: AI suggested importing `<Kanbans />` from `lucide-react`, which caused a TypeScript compilation error (`TS2724`). I fixed it by correcting the import to `<Kanban />`.
2. **Missing Active Element Tracking**: AI's modal code did not remember the triggering button, leaving keyboard focus stranded on the `<body>` element when closing. I resolved this with a `triggerRef`.
3. **Ambiguous Button Queries in Tests**: AI suggested querying buttons by generic role name `getByRole('button', { name: /create/i })`, which caused Testing Library conflicts because both the modal trigger and submit button shared similar text. I corrected the tests to use `within(dialog).getByRole(...)`.

---

## 8. How the Final Implementation Was Verified

The entire application was verified independently through automated and manual engineering practices:
1. **Automated Unit & Integration Tests**: 12 comprehensive tests across 4 test suites using Vitest and React Testing Library (`npm test`), testing form validation, debounced search, task editing, deletion confirmation, and the complete 16-step user journey.
2. **Strict Static Type Checking**: Ran `npx tsc --noEmit` with `noUnusedLocals` and `strict: true` achieving 0 errors.
3. **Production Build Validation**: Ran `npm run build` validating clean asset generation in under 3 seconds.
4. **Manual Accessibility & Performance Audit**: Tested complete keyboard-only navigation (`Tab`, `Shift+Tab`, `Escape`), triggered simulated HTTP 500 errors to verify optimistic rollback, and executed the 1,000-task stress test to verify smooth 60 FPS performance.
