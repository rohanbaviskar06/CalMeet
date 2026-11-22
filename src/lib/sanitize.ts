/**
 * HTML Sanitizer for CalMeet.
 * Strips script tags, iframes, objects, forms, and event handlers while preserving safe formatting.
 */

const ALLOWED_TAGS = new Set([
  "p", "br", "b", "strong", "i", "em", "u", "s", "strike",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "span", "div", "blockquote", "code", "pre", "hr",
  "a"
]);

const ALLOWED_ATTRS = new Set([
  "href", "target", "rel", "class"
]);

export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== "string") return "";

  // 1. Remove dangerous blocks completely (including inner content)
  let clean = dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "");

  // 2. Strip event handlers like onclick, onerror, onload, onmouseover, etc.
  clean = clean.replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // 3. Neutralize javascript: and data: pseudo-protocols
  clean = clean.replace(/href\s*=\s*['"]\s*(?:javascript|data|vbscript):[^'"]*['"]/gi, 'href="#"');

  // 4. Whitelist tags and attributes
  clean = clean.replace(/<\/?([a-zA-Z0-9_-]+)([^>]*)>/g, (match, tagName, attrs) => {
    const lowerTag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(lowerTag)) {
      return "";
    }

    if (match.startsWith("</")) {
      return `</${lowerTag}>`;
    }

    const cleanAttrs: string[] = [];
    const attrRegex = /([a-zA-Z0-9_-]+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+)))?/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      const attrVal = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

      if (ALLOWED_ATTRS.has(attrName)) {
        if (attrName === "href" && /^\s*(javascript|data|vbscript):/i.test(attrVal)) {
          continue;
        }
        cleanAttrs.push(`${attrName}="${attrVal.replace(/"/g, "&quot;")}"`);
      }
    }

    if (lowerTag === "a" && !cleanAttrs.some((a) => a.startsWith("rel="))) {
      cleanAttrs.push('rel="noopener noreferrer"');
    }

    return `<${lowerTag}${cleanAttrs.length ? " " + cleanAttrs.join(" ") : ""}>`;
  });

  return clean;
}
