import { Hono } from 'hono';
import { runPipeline } from '../../llm/pipeline';

const generateRoute = new Hono();

generateRoute.post('/generate', async (c) => {
  try {
    const { prompt, context } = await c.req.formData();
    
    if (!prompt) {
      return c.html(
        <div class="error-message">
          <p>Please provide a prompt to generate HTML.</p>
        </div>
      );
    }

    // Run the LLM pipeline
    const result = await runPipeline(
      prompt.toString(),
      context?.toString() || ''
    );

    // Return the generated HTML with validation status
    return c.html(
      <div class="result-container">
        <div class="result-header">
          <h3>Generated Semantic HTML</h3>
          {result.validation.valid ? (
            <span class="validation-badge valid">Valid Semantic HTML</span>
          ) : (
            <span class="validation-badge invalid">Needs Review</span>
          )}
        </div>
        
        <div class="code-container">
          <pre class="code-block"><code>{result.html}</code></pre>
        </div>

        {!result.validation.valid && (
          <div class="validation-errors">
            <h4>Validation Issues:</h4>
            <ul>
              {result.validation.errors.map((error, index) => (
                <li key={index} class="error-item">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {result.validation.warnings.length > 0 && (
          <div class="validation-warnings">
            <h4>Warnings:</h4>
            <ul>
              {result.validation.warnings.map((warning, index) => (
                <li key={index} class="warning-item">{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div class="result-meta">
          <p><small>Generated in {result.stats.generationTime}ms</small></p>
          <p><small>Confidence: {result.stats.confidenceScore}%</small></p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Generation error:', error);
    return c.html(
      <div class="error-message">
        <h3>Error Generating HTML</h3>
        <p>An error occurred while processing your request. Please try again.</p>
        <p><small>Error: {error instanceof Error ? error.message : 'Unknown error'}</small></p>
      </div>
    );
  }
});

export default generateRoute;
