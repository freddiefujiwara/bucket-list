# Bucket List Frontend

[View the Live Demo](https://freddiefujiwara.com/bucket-list/)

This is the frontend application for the Bucket List project. It's a dynamic, tile-based gallery that displays data from a Google Apps Script backend, allowing users to browse, filter, and view details of their bucket list items.

## Features

- **Dynamic Tile Gallery**: Displays bucket list items in a visually appealing, responsive tile layout.
- **Detailed Modal View**: Clicking on a tile opens a modal with more information, including notes, images, and completion status.
- **Category and Age-Based Filtering**: Allows users to filter the bucket list items by category or target age.
- **Responsive Design**: Ensures a seamless experience across various devices, including desktops, tablets, and smartphones.
- **Data-Driven**: Fetches data from a backend API, making the content easy to manage and update.

## Tech Stack

- **Vue 3**: A progressive JavaScript framework for building user interfaces.
- **Vite**: A modern, fast build tool and development server.
- **Vitest**: A native unit testing framework for Vite.
- **JSONP**: Used to fetch data from the Google Apps Script backend to overcome cross-origin issues.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Configuration

### Data Source

The application fetches data from a JSONP endpoint. You can configure the data source URL by setting the `VITE_DATA_URL` environment variable.

For example, to run the development server with a custom data source:

```bash
VITE_DATA_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" npm run dev
```

**Note:** The `callback` parameter should not be included in the URL.

## Development

### Running Tests

This project uses Vitest for unit testing. To run the tests:

```bash
npm test
```

This command will execute all unit tests and display a coverage report.

## Deployment

This project is configured for deployment to GitHub Pages.

1.  **Build for Production**: If you are deploying to a subdirectory (e.g., `https://username.github.io/repo-name/`), set the `VITE_BASE` environment variable to your repository name.

    ```bash
    VITE_BASE="/your-repo-name/" npm run build
    ```

2.  **Deploy to GitHub Pages**: The following command will build the project and push the `dist` directory to the `gh-pages` branch.

    ```bash
    npm run deploy
    ```

## Relationship with the Backend

This frontend application is designed to work with the [Bucket List API](https://github.com/freddiefujiwara/bucket-list-gas/tree/main), a serverless backend built with Google Apps Script. The frontend fetches data from the API and displays it to the user.

This separation of concerns allows for independent development, testing, and deployment of the frontend and backend.
