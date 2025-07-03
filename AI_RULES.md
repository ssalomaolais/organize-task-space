# AI Rules for TaskFlow Project

This document outlines the core technologies used in the TaskFlow application and provides guidelines for using specific libraries and frameworks.

## Tech Stack

*   **Frontend Framework**: React
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **UI Component Library**: shadcn/ui (built on Radix UI)
*   **Routing**: React Router DOM
*   **Backend/Database/Auth**: Supabase
*   **Data Fetching & Caching**: React Query
*   **Date Manipulation**: date-fns
*   **Icons**: Lucide React
*   **Calendar Component**: React Big Calendar
*   **Toast Notifications**: Sonner

## Library Usage Rules

To maintain consistency and efficiency, please adhere to the following rules when developing:

*   **UI Components**: Always prioritize `shadcn/ui` components for building the user interface. If a required component is not available in `shadcn/ui`, or if significant customization is needed, create a new component in `src/components/` and style it with Tailwind CSS. **Do not modify `shadcn/ui` component files directly.**
*   **Styling**: All styling must be done using **Tailwind CSS**. Avoid inline styles or separate CSS files unless absolutely necessary for third-party library integration (e.g., `react-big-calendar`'s base CSS).
*   **Routing**: Use `react-router-dom` for all client-side navigation. All main routes should be defined in `src/App.tsx`.
*   **Data Management**:
    *   For server-side data fetching, caching, and synchronization, use **React Query**.
    *   All database interactions (CRUD operations) and authentication flows must be handled via the **Supabase client** (`@supabase/supabase-js`).
*   **Icons**: Use icons from the **`lucide-react`** library.
*   **Date & Time**: For any date formatting, parsing, or manipulation, use **`date-fns`**.
*   **Notifications**: Implement all toast notifications using the **`sonner`** library.
*   **Calendar View**: The calendar display functionality should utilize **`react-big-calendar`**.
*   **Forms**: For form management and validation, leverage `react-hook-form` and `zod` as demonstrated in existing components.
*   **File Structure**:
    *   New components should be placed in `src/components/`.
    *   New pages should be placed in `src/pages/`.
    *   New hooks should be placed in `src/hooks/`.
    *   Utility functions should be placed in `src/lib/`.
    *   Always create a new file for each new component or hook.