# Project Structure Documentation

This document provides an overview of the project structure to assist in future development and maintenance.

## Getting Started

To get started with this project, follow these steps:

1.  Clone the repository to your local machine.
2.  Navigate to the `inspection-app` directory.
3.  Install the dependencies by running `npm install`.
4.  Start the backend server by running `node server.js`.
5.  In a separate terminal, start the frontend development server by running `npm start`.

The application will be available at `http://localhost:3000`.

## Root Directory

-   `package-lock.json`: Records the exact version of each package that is installed.
-   `.git`: Git directory for version control.
-   `inspection-app`: Main application folder.

## `inspection-app` Directory

-   `.gitignore`: Specifies intentionally untracked files to ignore.
-   `package-lock.json`: Records the exact version of each package that is installed for the app.
-   `package.json`: Contains metadata about the project and its dependencies.
-   `postcss.config.js`: Configuration file for PostCSS.
-   `tailwind.config.js`: Configuration file for Tailwind CSS.
-   `node_modules`: Directory where npm installs dependencies.
-   `public`: Contains static assets that are publicly accessible.
    -   `index.html`: The main HTML file for the application.
-   `recursos`: Contains resource files.
-   `src`: Contains the source code of the application.

### `src` Directory

-   `App.js`: The main application component.
-   `fileParser.js`: A utility for parsing files.
-   `index.css`: Global CSS file.
-   `index.js`: The entry point of the application.
-   `InspectionModule.jsx`: A module for inspections.
-   `components`: Contains reusable UI components.
    -   `ProtectedRoute.jsx`: A component for handling protected routes.
    -   `SideMenu.jsx`: The side menu component.
-   `config`: Contains configuration files.
    -   `permissions.js`: A file for managing user permissions.
-   `context`: Contains React context providers.
    -   `AuthContext.jsx`: The authentication context.
-   `data`: Contains static data.
    -   `users.js`: A file with user data.
-   `layouts`: Contains layout components.
    -   `DashboardLayout.jsx`: The dashboard layout.
-   `pages`: Contains the application's pages.
    -   `Dashboard.jsx`: The dashboard page.
    -   `InspectionPage.jsx`: The inspection page.
    -   `LoginPage.jsx`: The login page.
