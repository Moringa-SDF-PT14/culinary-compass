# Culinary Compass (M3 Recipe Finder)

Culinary Compass is a responsive, front-end web application that allows users to search for recipes, view detailed instructions and ingredients, and save their favorite meals. It is built using vanilla web technologies and integrates with [TheMealDB API](https://www.themealdb.com/api.php).

## Features

- **Recipe Search:** Search for meals by main ingredient or name.
- **Recipe Details:** View comprehensive meal details, including exact measurements, ingredients, and step-by-step instructions in a clean modal interface.
- **Favorites Management:** Save recipes to a "Favorites" list. Your favorites are stored locally in your browser so they persist across sessions!
- **Responsive Design:** Designed with a mobile-first approach using Flexbox and CSS Grid, styled with Material Design 3 inspired design tokens.

## Technologies Used

- **HTML5:** Semantic markup and structure.
- **CSS3:** Custom CSS variables (Material Design inspired), Flexbox, CSS Grid, and responsive media queries.
- **JavaScript (ES6+):**
  - Asynchronous JavaScript (`async`/`await` and Fetch API) for data fetching.
  - Event Delegation for optimized DOM event handling.
  - `localStorage` API for persisting user data.

## Getting Started

Because this is a vanilla frontend project without build tools, running the project is incredibly straightforward.

### Prerequisites

You only need a modern web browser (Chrome, Firefox, Safari, Edge) to run this application.

### Installation / Execution

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd culinary-compass
   ```

3. Open the `index.html` file in your browser.
   *Note: For the best development experience, consider using an extension like **Live Server** in VS Code to run the project over a local HTTP server.*

## Project Structure

- `index.html`: The main HTML structure, including the search form, recipe grid placeholder, favorites sidebar, and modal dialog.
- `main.css`: All application styling, utilizing custom CSS properties (`:root`) for easy theme management.
- `main.js`: Core application logic handling API calls, DOM manipulation, state management, and event listeners.

## API Reference

This application relies on the free tier of TheMealDB API.

- **Search by Name/Ingredient:** `https://www.themealdb.com/api/json/v1/1/search.php?s={query}`
- **Lookup Full Recipe Details by ID:** `https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}`

## Roadmap / Future Improvements

- [ ] Add a visual loading spinner during API requests.
- [ ] Add a feature to filter recipes by category (e.g., Breakfast, Dessert) or geographic origin.
- [ ] Link directly to YouTube video tutorials provided by TheMealDB API.

## License

This project is licensed under the MIT License.
