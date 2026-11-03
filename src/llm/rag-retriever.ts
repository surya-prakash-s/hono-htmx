import knowledgeBase from '../db/semantic-html-rag.json';

interface KnowledgeSpec {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  source: string;
}

interface RetrievedSpec {
  title: string;
  content: string;
  relevance: number;
}

/**
 * Retrieves relevant MDN specifications based on the user's prompt
 * Uses deterministic keyword matching and semantic analysis
 */
export function retrieveRelevantSpecs(prompt: string, limit: number = 5): RetrievedSpec[] {
  const lowerPrompt = prompt.toLowerCase();
  const promptTokens = tokenize(prompt);

  // Score each spec based on relevance to the prompt
  const scoredSpecs = knowledgeBase.map((spec: KnowledgeSpec) => {
    const relevance = calculateRelevance(spec, lowerPrompt, promptTokens);
    return {
      ...spec,
      relevance,
    };
  });

  // Sort by relevance (descending) and take top results
  const sorted = scoredSpecs.sort((a: any, b: any) => b.relevance - a.relevance);
  const topSpecs = sorted.slice(0, limit);

  // Filter out specs with very low relevance
  return topSpecs
    .filter((spec: any) => spec.relevance > 0.1)
    .map((spec: any) => ({
      title: spec.title,
      content: spec.content,
      relevance: spec.relevance,
    }));
}

/**
 * Tokenizes text into words and phrases
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s.,;:!?]+/)
    .filter((token) => token.length > 1);
}

/**
 * Calculates relevance score between a spec and the prompt
 */
function calculateRelevance(
  spec: KnowledgeSpec,
  lowerPrompt: string,
  promptTokens: string[]
): number {
  let score = 0;

  // Title match (high weight)
  if (lowerPrompt.includes(spec.title.toLowerCase())) {
    score += 0.5;
  }

  // Tag matches (medium weight)
  const tagMatches = spec.tags.filter((tag) =>
    promptTokens.some((token) => tag.toLowerCase().includes(token))
  );
  score += tagMatches.length * 0.2;

  // Content matches (lower weight)
  const contentLower = spec.content.toLowerCase();
  const contentMatches = promptTokens.filter((token) =>
    contentLower.includes(token)
  );
  score += (contentMatches.length / Math.max(1, promptTokens.length)) * 0.3;

  // Category bonus
  if (spec.category === 'Structure' && lowerPrompt.includes('structure')) {
    score += 0.1;
  }
  if (spec.category === 'Forms' && lowerPrompt.includes('form')) {
    score += 0.1;
  }
  if (spec.category === 'Navigation' && lowerPrompt.includes('nav')) {
    score += 0.1;
  }

  // Normalize score
  return Math.min(1, score);
}

/**
 * Gets all specs in a specific category
 */
export function getSpecsByCategory(category: string): KnowledgeSpec[] {
  return knowledgeBase.filter((spec: KnowledgeSpec) =>
    spec.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Searches specs by exact title
 */
export function getSpecByTitle(title: string): KnowledgeSpec | null {
  const found = knowledgeBase.find(
    (spec: KnowledgeSpec) => spec.title.toLowerCase() === title.toLowerCase()
  );
  return found || null;
}

/**
 * Gets all available categories
 */
export function getCategories(): string[] {
  const categories = new Set(
    knowledgeBase.map((spec: KnowledgeSpec) => spec.category)
  );
  return Array.from(categories).sort();
}
