import * as cheerio from 'cheerio';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates HTML for semantic correctness and accessibility
 * Uses Cheerio for DOM parsing and analysis
 */
export function validateHTML(html: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Load HTML with Cheerio
    const $ = cheerio.load(html, { xmlMode: false });

    // Run all validation checks
    checkDoctype($, errors);
    checkHtmlLang($, errors);
    checkHeadStructure($, errors, warnings);
    checkBodyStructure($, errors);
    checkSemanticElements($, errors, warnings);
    checkHeadingHierarchy($, errors, warnings);
    checkForms($, errors, warnings);
    checkImages($, errors);
    checkTables($, errors, warnings);
    checkLists($, errors, warnings);
    checkAccessibility($, errors, warnings);
    checkDeprecatedElements($, errors);

    // Determine if valid (no critical errors)
    const valid = errors.length === 0;

    return { valid, errors, warnings };
  } catch (error) {
    // If parsing fails, return critical error
    return {
      valid: false,
      errors: [`Failed to parse HTML: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
    };
  }
}

/**
 * Checks for proper DOCTYPE declaration
 */
function checkDoctype($: cheerio.CheerioAPI, errors: string[]): void {
  const doctype = $('!DOCTYPE').length || $('!doctype').length;
  if (doctype === 0) {
    errors.push('Missing DOCTYPE declaration. HTML5 requires <!DOCTYPE html>.');
  }
}

/**
 * Checks for lang attribute on html element
 */
function checkHtmlLang($: cheerio.CheerioAPI, errors: string[]): void {
  const html = $('html');
  if (html.length === 0) {
    errors.push('Missing <html> root element.');
    return;
  }

  if (!html.attr('lang')) {
    errors.push('Missing lang attribute on <html> element. Specify the document language (e.g., lang="en").');
  }
}

/**
 * Checks head element structure
 */
function checkHeadStructure($: cheerio.CheerioAPI, errors: string[], warnings: string[]): void {
  const head = $('head');
  
  if (head.length === 0) {
    errors.push('Missing <head> element.');
    return;
  }

  // Check for charset meta
  const charsetMeta = head.find('meta[charset]');
  if (charsetMeta.length === 0) {
    errors.push('Missing charset meta tag. Add <meta charset="UTF-8">.');
  }

  // Check for viewport meta
  const viewportMeta = head.find('meta[name="viewport"]');
  if (viewportMeta.length === 0) {
    warnings.push('Missing viewport meta tag. Consider adding <meta name="viewport" content="width=device-width, initial-scale=1.0"> for responsive design.');
  }

  // Check for title
  const title = head.find('title');
  if (title.length === 0) {
    errors.push('Missing <title> element in <head>.');
  } else if (title.text().trim() === '') {
    warnings.push('Empty <title> element. Provide a meaningful page title.');
  }
}

/**
 * Checks body element structure
 */
function checkBodyStructure($: cheerio.CheerioAPI, errors: string[]): void {
  const body = $('body');
  if (body.length === 0) {
    errors.push('Missing <body> element.');
    return;
  }

  // Check for semantic structure
  const hasMain = body.find('main').length > 0;
  const hasHeader = body.find('header').length > 0 || body.find('nav').length > 0;
  const hasFooter = body.find('footer').length > 0;

  if (!hasMain) {
    errors.push('Missing <main> element. The main content should be wrapped in <main> for accessibility.');
  }
}

/**
 * Checks for proper use of semantic elements
 */
function checkSemanticElements($: cheerio.CheerioAPI, errors: string[], warnings: string[]): void {
  // Check for div abuse
  const divs = $('div');
  const totalElements = $('*').length;
  const divRatio = divs.length / totalElements;

  if (divRatio > 0.5) {
    warnings.push(`High div usage detected (${Math.round(divRatio * 100)}% of elements). Consider using more semantic elements.`);
  }

  // Check for empty semantic elements
  const semanticElements = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
  semanticElements.forEach((tag) => {
    $(tag).each((i, el) => {
      if ($(el).text().trim() === '' && $(el).children().length === 0) {
        warnings.push(`Empty <${tag}> element found. Semantic elements should contain content.`);
      }
    });
  });

  // Check for nav without aria-label
  $('nav').each((i, el) => {
    if (!$(el).attr('aria-label') && !$(el).attr('aria-labelledby')) {
      warnings.push('Navigation element (<nav>) should have an aria-label or aria-labelledby attribute for accessibility.');
    }
  });
}

/**
 * Checks heading hierarchy
 */
function checkHeadingHierarchy($: cheerio.CheerioAPI, errors: string[], warnings: string[]): void {
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const headingLevels: number[] = [];

  // Collect all heading levels
  headings.forEach((tag) => {
    const level = parseInt(tag.substring(1));
    $(tag).each((i, el) => {
      headingLevels.push(level);
    });
  });

  if (headingLevels.length === 0) {
    warnings.push('No headings found. Consider adding headings for document structure and accessibility.');
    return;
  }

  // Check for h1
  if (!headingLevels.includes(1)) {
    errors.push('Missing h1 heading. Every page should have exactly one h1 element for the main title.');
  }

  // Check for multiple h1s
  const h1Count = headingLevels.filter((l) => l === 1).length;
  if (h1Count > 1) {
    warnings.push(`Found ${h1Count} h1 elements. Consider using only one h1 per page.`);
  }

  // Check for skipped levels
  const uniqueLevels = [...new Set(headingLevels)].sort((a, b) => a - b);
  for (let i = 1; i < uniqueLevels.length; i++) {
    if (uniqueLevels[i] !== uniqueLevels[i - 1] + 1) {
      warnings.push(`Heading hierarchy skips from h${uniqueLevels[i - 1]} to h${uniqueLevels[i]}. Avoid skipping heading levels.`);
    }
  }
}

/**
 * Checks form accessibility
 */
function checkForms($: cheerio.CheerioAPI, errors: string[], warnings: string[]): void {
  $('form').each((i, form) => {
    const formEl = $(form);

    // Check for action and method
    if (!formEl.attr('action')) {
      warnings.push('Form missing action attribute. Specify where to submit the form data.');
    }
    if (!formEl.attr('method')) {
      warnings.push('Form missing method attribute. Specify GET or POST.');
    }

    // Check form controls
    const inputs = formEl.find('input, textarea, select');
    inputs.each((j, input) => {
      const inputEl = $(input);
      const type = inputEl.attr('type') || 'text';
      const id = inputEl.attr('id');

      // Skip submit, reset, button, image types
      if (['submit', 'reset', 'button', 'image'].includes(type)) {
        return;
      }

      // Check for label
      if (!id) {
        errors.push(`Form control (${type}) missing id attribute. Required for label association.`);
      } else {
        const label = formEl.find(`label[for="${id}"]`);
        if (label.length === 0) {
          warnings.push(`Form control with id="${id}" has no associated label. Add <label for="${id}">.`);
        }
      }

      // Check for required attribute on mandatory fields
      const name = inputEl.attr('name');
      if (name && name.toLowerCase().includes('required')) {
        if (!inputEl.attr('required')) {
          warnings.push(`Form control with name="${name}" appears to be mandatory but lacks required attribute.`);
        }
      }
    });

    // Check for fieldset/legend
    const hasFieldset = formEl.find('fieldset').length > 0;
    if (inputs.length > 3 && !hasFieldset) {
      warnings.push('Form with multiple controls should consider using <fieldset> and <legend> for grouping.');
    }

    // Check fieldset has legend
    formEl.find('fieldset').each((k, fieldset) => {
      const legend = $(fieldset).find('legend');
      if (legend.length === 0) {
        errors.push('Fieldset element missing <legend> child. Fieldsets must have a legend for accessibility.');
      }
    });
  });

  // Check for inputs without form
  const orphanInputs = $('input, textarea, select').filter((i, el) => {
    return $(el).parents('form').length === 0;
  });

  if (orphanInputs.length > 0) {
    warnings.push(`${orphanInputs.length} form control(s) found outside of <form> elements. Consider wrapping them in a form.`);
  }
}

/**
 * Checks image accessibility
 */
function checkImages($: cheerio.CheerioAPI, errors: string[]): void {
  $('img').each((i, img) => {
    const imgEl = $(img);

    // Check for alt attribute
    if (!imgEl.attr('alt')) {
      errors.push('Image missing alt attribute. All images must have alt text for accessibility.');
    }

    // Check for src attribute
    if (!imgEl.attr('src')) {
      errors.push('Image missing src attribute.');
    }

    // Check for width/height (recommended for performance)
    if (!imgEl.attr('width') || !imgEl.attr('height')) {
      errors.push('Image missing width and/or height attributes. These prevent layout shifts.');
    }
  });
}

/**
 * Checks table accessibility
 */
function checkTables($: cheerio.CheerioAPI, errors: string[], warnings: string[]): void {
  $('table').each((i, table) => {
    const tableEl = $(table);

    // Check for caption
    if (tableEl.find('caption').length === 0) {
      warnings.push('Table missing <caption> element. Captions describe the table for accessibility.');
    }

    // Check for thead/tbody
    if (tableEl.find('thead').length === 0) {
      warnings.push('Table missing <thead> element. Use thead for header rows.');
    }

    // Check th elements have scope
    tableEl.find('th').each((j, th) => {
      const thEl = $(th);
      if (!thEl.attr('scope')) {
        warnings.push('Table header (<th>) missing scope attribute. Use scope="col", "row", "colgroup", or "rowgroup".');
      }
    });
  });
}

/**
 * Checks list usage
 */
function checkLists($: cheerio.CheerioAPI, errors: string[], warnings: string[]): void {
  // Check for ul/ol without li
  $('ul, ol').each((i, list) => {
    const listEl = $(list);
    const items = listEl.find('li');
    const directChildren = listEl.children();

    // Check if all children are li
    const nonLiChildren = directChildren.filter((j, child) => {
      return $(child).prop('tagName')?.toLowerCase() !== 'li';
    });

    if (nonLiChildren.length > 0) {
      errors.push(`<${listEl.prop('tagName')?.toLowerCase()}> element contains non-<li> children. Lists should only contain <li> elements.`);
    }

    if (items.length === 0) {
      warnings.push(`Empty <${listEl.prop('tagName')?.toLowerCase()}> element. Lists should contain at least one <li> element.`);
    }
  });

  // Check for dl without dt/dd
  $('dl').each((i, dl) => {
    const dlEl = $(dl);
    const hasDt = dlEl.find('dt').length > 0;
    const hasDd = dlEl.find('dd').length > 0;

    if (!hasDt && !hasDd) {
      warnings.push('Description list (<dl>) has no <dt> or <dd> elements.');
    }
  });
}

/**
 * Checks general accessibility issues
 */
function checkAccessibility($: cheerio.CheerioAPI, errors: string[], warnings: string[]): void {
  // Check for elements with onclick without keyboard support
  const clickableElements = $('[onclick]').filter((i, el) => {
    const tag = $(el).prop('tagName')?.toLowerCase();
    return !['button', 'a', 'input'].includes(tag || '');
  });

  if (clickableElements.length > 0) {
    warnings.push(`${clickableElements.length} element(s) with onclick attribute are not natively keyboard accessible. Use <button> or <a> instead.`);
  }

  // Check for links without meaningful text
  $('a').each((i, link) => {
    const linkEl = $(link);
    const text = linkEl.text().trim();
    const href = linkEl.attr('href');

    if (text === '' && !linkEl.find('img').length) {
      errors.push('Link with empty text content. Screen readers need meaningful link text.');
    }

    if (text === 'click here' || text.toLowerCase().includes('click here')) {
      warnings.push(`Link text "${text}" is not descriptive. Use meaningful link text that describes the destination.`);
    }

    if (href?.startsWith('#') && $(href).length === 0) {
      warnings.push(`Link to ${href} but no element with that ID exists.`);
    }
  });

  // Check for buttons without type
  $('button').each((i, button) => {
    const buttonEl = $(button);
    if (!buttonEl.attr('type')) {
      warnings.push('Button missing type attribute. Default is "submit" which may cause unintended form submission.');
    }
  });

  // Check for empty aria-label
  $('[aria-label]').each((i, el) => {
    const ariaLabel = $(el).attr('aria-label');
    if (ariaLabel?.trim() === '') {
      errors.push('Element has empty aria-label attribute. Remove it or provide meaningful text.');
    }
  });
}

/**
 * Checks for deprecated elements
 */
function checkDeprecatedElements($: cheerio.CheerioAPI, errors: string[]): void {
  const deprecatedElements = [
    'acronym', 'applet', 'basefont', 'big', 'center', 'dir', 'font',
    'frame', 'frameset', 'noframes', 'strike', 'tt', 'u', 'xmp',
    'blink', 'marquee', 'isindex', 'listing', 'plaintext', 'spacer'
  ];

  deprecatedElements.forEach((tag) => {
    $(tag).each((i, el) => {
      errors.push(`Deprecated element <${tag}> found. Use semantic HTML alternatives instead.`);
    });
  });
}
