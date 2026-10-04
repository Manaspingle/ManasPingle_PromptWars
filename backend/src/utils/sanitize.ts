/**
 * Sanitizes untrusted user input before injecting into LLM prompts.
 * Neutralizes prompt-injection attempts, XML/HTML delimiter injections,
 * and dangerous control characters.
 */
export function sanitizeInput(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  // 1. Remove dangerous non-printable ASCII control characters (keep \r, \n, \t)
  let sanitized = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Neutralize XML-like tag injections specifically targeting delimiters
  // Replaces <tag> and </tag> with &lt;tag&gt; and &lt;/tag&gt;
  sanitized = sanitized.replace(/<\/?([a-zA-Z0-9_\-]+)(?:\s+[^>]*)?>/g, (match) => {
    return match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });

  return sanitized.trim();
}

/**
 * Specifically neutralizes any attempt to break out of delimiters like </user_input>, </decision>, etc.
 */
export function sanitizeDelimiterInjection(text: string): string {
  return sanitizeInput(text);
}
