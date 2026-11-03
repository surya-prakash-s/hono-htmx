# Hono + HTMX + Semantic CSS Application

A modern web application built with:
- **Hono**: Fast, lightweight web framework for JavaScript/TypeScript
- **HTMX**: Dynamic HTML without writing JavaScript
- **Semantic CSS**: Meaningful class names based on content purpose (no Tailwind!)

## Features

- Server-side rendering with Hono
- Dynamic client-side updates with HTMX
- Clean, semantic HTML and CSS
- No React, no build step required
- Progressive enhancement

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
.
├── src/
│   └── index.js          # Main Hono server
├── public/
│   └── styles.css        # Semantic CSS styles
├── package.json
├── README.md
└── .gitignore
```

## HTMX Usage

The application uses HTMX for dynamic behavior:

- `hx-get`: Fetch content via GET request
- `hx-post`: Submit forms via POST request
- `hx-target`: Specify where to place the response
- `hx-swap`: Control how content is swapped in

Example:
```html
<button hx-get="/api/greet" hx-target="#greeting">Get Greeting</button>
<div id="greeting"></div>
```

## Semantic CSS Philosophy

Instead of utility classes like `bg-blue-500`, we use semantic class names:

- `.header` - for the header section
- `.hero` - for the hero section
- `.form-group` - for form input groups
- `.notification` - for notification messages
- `.success`, `.warning`, `.error` - for notification types

This makes the CSS:
- More readable
- More maintainable
- More portable
- Easier to understand

## API Endpoints

- `GET /` - Home page
- `GET /about` - About page (HTMX target)
- `GET /contact` - Contact page (HTMX target)
- `GET /api/greet` - Returns a greeting message
- `POST /api/submit` - Handles form submission
- `GET /health` - Health check endpoint

## License

MIT
