import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static';
import { serve } from '@hono/node-server';
import indexRoute from './routes/index';
import generateRoute from './routes/api/generate';

const app = new Hono();

// Serve static assets from public directory
app.use('/public/*', serveStatic({ root: './public' }));
app.use('/icons/*', serveStatic({ root: './public/icons' }));

// Serve CSS files from styles directory
app.use('/src/styles/*', serveStatic({ root: './src/styles' }));

// Routes
app.route('/', indexRoute);
app.route('/api', generateRoute);

// Health check endpoint
app.get('/health', (c) => c.text('OK'));

// 404 handler
app.notFound((c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 - Not Found</title>
        <link rel="stylesheet" href="/src/styles/tokens.css" />
        <link rel="stylesheet" href="/src/styles/base.css" />
        <link rel="stylesheet" href="/src/styles/components.css" />
      </head>
      <body>
        <main class="container">
          <h1>404 - Page Not Found</h1>
          <p>Sorry, the page you're looking for doesn't exist.</p>
          <a href="/">Return to Home</a>
        </main>
      </body>
    </html>
  );
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>500 - Server Error</title>
        <link rel="stylesheet" href="/src/styles/tokens.css" />
        <link rel="stylesheet" href="/src/styles/base.css" />
        <link rel="stylesheet" href="/src/styles/components.css" />
      </head>
      <body>
        <main class="container">
          <h1>500 - Server Error</h1>
          <p>Something went wrong on our end. Please try again later.</p>
          <a href="/">Return to Home</a>
        </main>
      </body>
    </html>
  );
});

// Start the server
const port = parseInt(process.env.PORT || '3000');

console.log(`Starting Hono server on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
}, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
