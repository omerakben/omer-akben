# GEMINI.md

## Project Overview

This is a personal portfolio website for Omer "Ozzy" Akben, a software engineer and SDET. The project is built with Next.js (using the App Router), TypeScript, and Tailwind CSS. It showcases Omer's projects, skills, and experience. A key feature of the site is "Ozzy," an AI assistant built with OpenAI's AgentKit and ChatKit, which can answer questions about Omer and his work.

The project is well-structured, with a clear separation of concerns. Data for projects, testimonials, skills, and other content is stored in dedicated files within the `src/data` directory. The UI is built with a combination of custom components and components from the `shadcn/ui` library.

## Building and Running

The following scripts are available in `package.json`:

*   `npm run dev`: Starts the development server with Turbopack.
*   `npm run build`: Builds the application for production with Turbopack.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the codebase using ESLint.

**To run the project locally:**

1.  Install dependencies: `npm install`
2.  Start the development server: `npm run dev`
3.  Open your browser to `http://localhost:3000`

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Custom styles are defined in `src/app/globals.css`.
*   **Components:** Reusable UI components are located in the `src/components` directory.
*   **Data:** All static data is stored in the `src/data` directory.
*   **API Routes:** API routes for the AI assistant's tools are located in `src/app/api/tools`.
*   **Linting:** The project uses ESLint to enforce code quality.
*   **TypeScript:** The project is written in TypeScript and uses strict type checking.
