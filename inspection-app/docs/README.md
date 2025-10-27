# Project Structure Documentation

This document provides an overview of the project structure to assist in future development and maintenance.

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
