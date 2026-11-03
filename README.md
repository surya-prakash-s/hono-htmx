# Semantic HTML Generator

A Hono + HTMX + Semantic CSS application powered by a Deterministic RAG LLM pipeline for generating semantic, accessible HTML.

## Project Structure

```
my-semantic-app/
├── src/
│   ├── index.ts              # Hono app entry point & server setup
│   ├── routes/               # URL routing (The Footwork)
│   │   ├── index.tsx         # Home page route
│   │   └── api/
│   │       └── generate.ts   # The LLM generation endpoint
│   ├── views/                # hono/jsx layouts & static components
│   │   ├── layout.tsx        # Base HTML skeleton (Head, HTMX, CSS)
│   │   └── components/       # Static, hand-written semantic components
│   │       ├── Card.tsx
│   │       └── CodeBlock.tsx
│   ├── llm/                  # The AI Pipeline (The Cornerman)
│   │   ├── pipeline.ts       # Orchestrates the LLM call
│   │   ├── rag-retriever.ts  # The deterministic lookup engine
│   │   └── prompts.ts        # System prompts and rules
│   ├── db/                   # The Knowledge Base
│   │   └── semantic-html-rag.json # The MDN specs we generated
│   ├── lib/                  # Utilities & Validation (The Referee)
│   │   └── html-linter.ts    # Cheerio-based semantic validator
│   └── styles/               # Strict Semantic CSS (The Branding)
│       ├── tokens.css        # CSS variables (colors, spacing, typography)
│       ├── base.css          # Element resets and base typography
│       └── components.css    # Semantic element styling (article, nav, etc.)
├── public/                   # Static assets served directly
│   ├── htmx.min.js           # The HTMX library
│   └── icons/                # SVG icons (no JS icon libraries)
├── package.json
├── tsconfig.json
└── vite.config.ts            # Vite configuration for Hono
```

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) - Ultra-fast web framework
- **Frontend**: HTMX for interactivity without JavaScript
- **Styling**: Pure Semantic CSS with CSS Custom Properties
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast, modern build tool
- **TypeScript**: Full type safety
- **HTML Validation**: [Cheerio](https://cheerio.js.org/) - Fast, flexible, and lean implementation of core jQuery

## Features

### Deterministic RAG Pipeline
- Retrieves relevant MDN specifications based on user prompts
- Generates semantic HTML based on retrieved specs
- Validates generated HTML for accessibility and semantic correctness
- Returns confidence scores and validation results

### Semantic CSS
- CSS Custom Properties for theming
- Responsive design with semantic breakpoints
- Accessible color schemes
- Print-friendly styles

### HTMX Integration
- Seamless interactivity without writing JavaScript
- Form submissions with HTMX
- Dynamic content updates
- Loading indicators

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm or npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd my-semantic-app

# Install dependencies
npm install

# Replace the placeholder HTMX with the real library
# Download from https://unpkg.com/htmx.org@1.9.10
# Or use a CDN in production
```

### Development

```bash
npm run dev
```

The development server will start at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## Usage

1. Visit the home page at `/`
2. Enter a prompt describing the HTML you want to generate
3. Optionally add context or requirements
4. Click "Generate"
5. View the generated semantic HTML with validation results

## Project Philosophy

### The Footwork (Routes)
- Clean, RESTful routing
- Separation of concerns
- HTMX-powered interactivity

### The Cornerman (LLM Pipeline)
- Deterministic RAG retrieval
- Context-aware generation
- Self-validation

### The Referee (Validation)
- Cheerio-based HTML parsing
- Semantic validation
- Accessibility checks

### The Branding (Semantic CSS)
- No Tailwind or utility classes
- Semantic element styling
- CSS Custom Properties for theming
- Responsive and accessible

## Architecture Decisions

### Why Hono?
- Ultra-fast performance
- Simple, expressive API
- First-class TypeScript support
- JSX support for views
- No heavy framework overhead

### Why HTMX?
- Progressive enhancement
- No JavaScript required for interactivity
- Small footprint (~14KB)
- Works with any backend
- Simple, declarative syntax

### Why Semantic CSS?
- Better maintainability
- Improved accessibility
- More meaningful code
- Better SEO
- Future-proof

### Why Vite?
- Blazing fast development server
- Instant hot module replacement
- Optimized production builds
- Simple configuration
- Modern ES modules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License
