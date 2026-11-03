import type { FC, PropsWithChildren } from 'hono/jsx';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Semantic HTML Generator with Deterministic RAG LLM Pipeline" />
        <title>Semantic HTML Generator</title>
        
        {/* CSS Tokens and Styles */}
        <link rel="stylesheet" href="/src/styles/tokens.css" />
        <link rel="stylesheet" href="/src/styles/base.css" />
        <link rel="stylesheet" href="/src/styles/components.css" />
        
        {/* HTMX for interactivity */}
        <script src="/public/htmx.min.js"></script>
        
        {/* HTMX configuration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            htmx.config.globalViewTransitions = true;
            htmx.onLoad(function(content) {
              // Auto-init any HTMX attributes
              htmx.process(content);
            });
          `,
        }} />
        
        {/* Preload HTMX */}
        <link rel="preload" href="/public/htmx.min.js" as="script" />
      </head>
      <body>
        <header class="header">
          <nav class="nav" aria-label="Main navigation">
            <div class="nav-container">
              <a href="/" class="nav-brand">
                <span class="brand-name">Semantic HTML</span>
                <span class="brand-tagline">Generator</span>
              </a>
              <ul class="nav-links">
                <li><a href="/" class="nav-link">Home</a></li>
                <li><a href="#features" class="nav-link">Features</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
              </ul>
            </div>
          </nav>
        </header>

        {children}

        <footer class="footer">
          <div class="footer-container">
            <p class="footer-text">
              Built with <strong>Hono</strong>, <strong>HTMX</strong>, and <strong>Semantic CSS</strong>
            </p>
            <p class="footer-text">
              Powered by <strong>Deterministic RAG LLM Pipeline</strong>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
