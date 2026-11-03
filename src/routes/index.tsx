import { Hono } from 'hono';
import Layout from '../views/layout';

const indexRoute = new Hono();

indexRoute.get('/', (c) => {
  return c.html(
    <Layout>
      <main class="container">
        <section class="hero">
          <h1>Semantic HTML Generator</h1>
          <p class="subtitle">Powered by Deterministic RAG LLM Pipeline</p>
        </section>

        <section class="generator-form">
          <form
            hx-post="/api/generate"
            hx-target="#result"
            hx-swap="innerHTML"
            class="form"
          >
            <fieldset class="fieldset">
              <legend>Generate Semantic HTML</legend>
              
              <div class="form-group">
                <label for="prompt">Describe what you want to build:</label>
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={5}
                  placeholder="e.g., Create a navigation bar with home, about, and contact links"
                  required
                  class="textarea"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="context">Additional context (optional):</label>
                <textarea
                  id="context"
                  name="context"
                  rows={3}
                  placeholder="Any specific requirements or constraints..."
                  class="textarea"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="button primary">
                  Generate
                </button>
                <button type="reset" class="button secondary">
                  Clear
                </button>
              </div>
            </fieldset>
          </form>
        </section>

        <section id="result" class="result-section" hx-trigger="load, generate from:form">
          <p class="placeholder">Your generated semantic HTML will appear here...</p>
        </section>

        <section class="features">
          <h2>Features</h2>
          <ul class="feature-list">
            <li class="feature-item">
              <strong>Deterministic RAG Pipeline:</strong> Consistent, reliable generation based on MDN specifications
            </li>
            <li class="feature-item">
              <strong>Semantic Validation:</strong> Automatically validates generated HTML against semantic best practices
            </li>
            <li class="feature-item">
              <strong>HTMX Powered:</strong> Seamless interactivity without JavaScript
            </li>
            <li class="feature-item">
              <strong>Pure Semantic CSS:</strong> Beautiful styling without Tailwind or utility classes
            </li>
          </ul>
        </section>
      </main>
    </Layout>
  );
});

export default indexRoute;
