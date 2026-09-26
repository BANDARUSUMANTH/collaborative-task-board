# Token / Credit Utilization Report: Collaborative Task Board

This report documents the approximate artificial intelligence token consumption, account usage, development metrics, and productivity impact observed during the development of **PulseBoard** (Collaborative Task Board).

---

## 1. AI Tool

- **Tool Name**: ChatGPT Web Assistant (GPT-4o-mini engine)
- **Primary Use**: Targeted syntax lookup, reference pattern validation, and initial test mock structure queries.

---

## 2. Plan / Account Type

- **Account Type**: Free Tier Account
- **Cost / API Credits Billed**: $0.00 (Standard public web interface, no paid API or enterprise token credits consumed).

---

## 3. Approximate Tokens / Credits Consumed

*Note: The project was largely authored, designed, and debugged manually. AI was queried only for 4 targeted problem areas across approximately 6 query-response exchanges.*

| Activity / Query Focus | Number of Exchanges | Input Tokens (Approx.) | Output Tokens (Approx.) | Total Tokens (Approx.) |
| :--- | :--- | :--- | :--- | :--- |
| **Accessible Focus Trap Logic & DOM Query Selectors** | 2 | 2,800 | 1,600 | 4,400 |
| **Realistic Enterprise Dummy Seed Data Structure** | 1 | 1,200 | 3,100 | 4,300 |
| **Generic TypeScript Debounce Hook Pattern** | 1 | 1,500 | 900 | 2,400 |
| **Vitest & React Testing Library Assertion Best Practices** | 2 | 3,400 | 2,200 | 5,600 |
| **Total Estimated Utilization** | **6 Exchanges** | **~8,900** | **~7,800** | **~16,700 Tokens** |

- **Total API Credits Consumed**: **0 Credits** (Free tier usage).

---

## 4. Major AI-Assisted Activities

1. **Accessibility Syntax Reference**:
   - Looked up the standard query selector string for focusable elements (`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`) to implement the `useModalFocusTrap` custom hook.
2. **Mock Data Generation**:
   - Generated initial realistic enterprise dummy titles and assignee names for `seedData.ts` to populate the project list.
3. **Timer Cleanup Clarification**:
   - Verified the cleanup return syntax of `useEffect` for the debounced search hook (`useDebounce.ts`).
4. **Testing Library Selector Patterns**:
   - Looked up how to use `within(dialog)` in React Testing Library when multiple buttons have similar accessible names.

---

## 5. Estimated Development Time

| Development Stage | Manual Solo Time (Estimated) | Time with Targeted AI Assistance | Time Saved |
| :--- | :--- | :--- | :--- |
| Project Planning & TypeScript Architecture | 2.5 hours | 2.0 hours | 0.5 hours |
| Component Development & Vanilla CSS Design System | 6.5 hours | 5.5 hours | 1.0 hours |
| Accessibility, Focus Trapping & Modals | 3.0 hours | 2.0 hours | 1.0 hours |
| Performance Optimization (1,000 Tasks Benchmark) | 3.0 hours | 2.5 hours | 0.5 hours |
| Automated Vitest Test Suite Writing | 4.0 hours | 3.0 hours | 1.0 hours |
| Documentation & Final Verification | 1.5 hours | 1.0 hours | 0.5 hours |
| **Total Project Duration** | **~20.5 Hours** | **~16.0 Hours** | **~4.5 Hours (~22% Time Saved)** |

---

## 6. How AI Affected Productivity

- **Quick Syntax Lookup**: Served as an immediate alternative to searching documentation pages for specific DOM events (`e.key === 'Tab'`, `e.shiftKey`) and Vitest configuration syntax.
- **Speeding up Mock Data Creation**: Generating 4 enterprise project fixtures with 12 initial tasks took seconds instead of manually typing repetitive JSON objects.
- **Architectural Control Maintained**: Rather than relying on AI to generate entire application views, I personally architected the component tree, wrote the Vanilla CSS design system, implemented state management with three separate React Contexts, and engineered the 1,000-task performance optimizations.
- **Critical Code Review**: AI suggestions were carefully scrutinized and often rejected (such as heavy third-party chart/modal libraries and Tailwind CSS) in favor of lightweight, native, and maintainable React patterns.
