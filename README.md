# Bucket List: A Dynamic Tiled Gallery

This web app shows your bucket list as a beautiful gallery of tiles. It gets data from a Google Apps Script and lets you filter items and see more details.

[View the Live Demo](https://freddiefujiwara.com/bucket-list/)

## Features

- **Tile Display**: Shows your bucket list items as tiles.
- **Detailed View**: Click a tile to see more details in a popup.
- **Filtering**: Filter tiles by category or target age.
- **Responsive Design**: Works well on different devices, like phones and desktops.

## Technology Stack

- **Vue 3**: A progressive framework for building reactive user interfaces.
- **Vite**: A fast development server and build tool.
- **Vitest**: A unit testing framework that runs on Vite.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bucket-list.git
   ```
2. Navigate to the project directory:
   ```bash
   cd bucket-list
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the local development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

The output files will be generated in the `dist` directory.

### Running Tests

To run the unit tests, use the following command:

```bash
npm test
```

## Configuration

### Data Source

The application fetches data from a JSONP endpoint. You can specify the URL of your data source by setting the `VITE_DATA_URL` environment variable.

```bash
VITE_DATA_URL="https://script.google.com/macros/s/XXXX/exec" npm run dev
```

**Note:** Do not include the `callback` parameter in the URL.

### Deployment

This project can be deployed to GitHub Pages.

1. **Build the application.** If your repository is not at the root of your custom domain, you may need to set the `VITE_BASE` environment variable to the repository path.
   ```bash
   VITE_BASE="/your-repo-name/" npm run build
   ```
2. **Deploy.** The following command will publish the contents of the `dist` directory to the `gh-pages` branch.
   ```bash
   npm run deploy
   ```

## Data Structure

This app gets data from a JSONP endpoint, like a Google Apps Script. The data source needs to be an array of JSON objects with this structure:

```json
[
  {
    "id": "Unique ID",
    "category": "Category Name",
    "target_age": "Target Age",
    "title": "Title",
    "note": "Note",
    "image_url": "Image URL",
    "completed": true,
    "completed_at": "2023-10-27"
  }
]
```
