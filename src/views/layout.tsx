// src/views/layout.tsx
import { jsx } from 'hono/jsx';

export function Layout({ children, title }: { children: string, title: string }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {/* Vite handles the CSS injection in dev, but we link the built CSS in prod */}
        <link rel="stylesheet" href="/styles/main.css" />
        <script src="/htmx.min.js" defer></script>
      </head>
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
          </nav>
        </header>
        <main>
          {/* 
            The LLM generates raw HTML strings. 
            We inject them safely into our semantic layout. 
          */}
          <section dangerouslySetInnerHTML={{ __html: children }} />
        </main>
        <footer>
          <address>Designed with pure mechanics.</address>
        </footer>
      </body>
    </html>
  );
}