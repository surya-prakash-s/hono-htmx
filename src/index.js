import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

// Serve static files (HTMX, CSS, client-side JS)
app.use('/static/*', serve({ root: './public' }))

// Main route
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hono + HTMX + Semantic CSS</title>
  <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
  <header class="header">
    <h1>Hono + HTMX + Semantic CSS</h1>
    <nav>
      <a href="/" hx-get="/" hx-target="main">Home</a>
      <a href="/about" hx-get="/about" hx-target="main">About</a>
      <a href="/contact" hx-get="/contact" hx-target="main">Contact</a>
    </nav>
  </header>
  
  <main id="main">
    <section class="hero">
      <h2>Welcome to the Application</h2>
      <p>This is a modern web application built with Hono, HTMX, and Semantic CSS.</p>
      <button hx-get="/api/greet" hx-target="#greeting" hx-swap="innerHTML">
        Get Greeting
      </button>
      <div id="greeting"></div>
    </section>
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 Hono + HTMX Application</p>
  </footer>
</body>
</html>
  `)
})

// About page
app.get('/about', (c) => {
  return c.html(`
<section class="page">
  <h2>About</h2>
  <p>This application demonstrates the power of Hono (a fast web framework) combined with HTMX (dynamic HTML) and Semantic CSS (meaningful styling).</p>
  <p>No React. No Tailwind. Just clean, semantic HTML and CSS.</p>
</section>
  `)
})

// Contact page
app.get('/contact', (c) => {
  return c.html(`
<section class="page">
  <h2>Contact</h2>
  <form hx-post="/api/submit" hx-target="#form-result">
    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="message">Message:</label>
      <textarea id="message" name="message" required></textarea>
    </div>
    <button type="submit">Submit</button>
  </form>
  <div id="form-result"></div>
</section>
  `)
})

// API endpoint for greeting
app.get('/api/greet', (c) => {
  const hour = new Date().getHours()
  let greeting
  if (hour < 12) greeting = 'Good morning!'
  else if (hour < 18) greeting = 'Good afternoon!'
  else greeting = 'Good evening!'
  
  return c.html(`<p>${greeting} Welcome to Hono + HTMX!</p>`)
})

// API endpoint for form submission
app.post('/api/submit', async (c) => {
  const formData = await c.req.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')
  
  // In a real app, you would save this to a database
  console.log('Form submitted:', { name, email, message })
  
  return c.html(`
    <div class="notification success">
      <p>Thank you, ${name}! Your message has been received.</p>
    </div>
  `)
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const port = process.env.PORT || 3000

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
