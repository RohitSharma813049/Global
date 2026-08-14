/**
 * Security helper to validate URLs for proxying and remote content fetching.
 * Protects against Server-Side Request Forgery (SSRF) and access to internal metadata/private IP ranges.
 */

const BLOCKED_IP_REGEX = /^(127\.|10\.|169\.254\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|0\.|localhost)/i;

const ALLOWED_HOSTNAME_SUFFIXES = [
  'r2.cloudflarestorage.com',
  '.r2.dev',
  'supabase.co',
  'images.unsplash.com',
  'googleusercontent.com',
  'drive.google.com',
];

export function validateProxyUrl(rawUrl: string, requestBaseUrl?: string): { isValid: boolean; parsedUrl?: URL; error?: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'Missing or invalid URL parameter' };
  }

  try {
    let parsed: URL;
    if (rawUrl.startsWith('/')) {
      if (!requestBaseUrl) {
        return { isValid: false, error: 'Relative path requested without base URL' };
      }
      parsed = new URL(rawUrl, requestBaseUrl);
    } else {
      parsed = new URL(rawUrl);
    }

    // Scheme check
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block local / internal / metadata IP ranges
    if (BLOCKED_IP_REGEX.test(hostname)) {
      return { isValid: false, error: 'Access to internal network or loopback address is forbidden' };
    }

    // Check environment dynamic public URLs if configured
    const r2PublicUrl = process.env.R2_PUBLIC_URL;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (r2PublicUrl && rawUrl.startsWith(r2PublicUrl)) {
      return { isValid: true, parsedUrl: parsed };
    }
    if (supabaseUrl && rawUrl.startsWith(supabaseUrl)) {
      return { isValid: true, parsedUrl: parsed };
    }

    // Check if host matches relative request host or allowed storage suffixes
    if (requestBaseUrl) {
      const baseParsed = new URL(requestBaseUrl);
      if (hostname === baseParsed.hostname.toLowerCase()) {
        return { isValid: true, parsedUrl: parsed };
      }
    }

    const isAllowedHost = ALLOWED_HOSTNAME_SUFFIXES.some(suffix =>
      hostname === suffix || hostname.endsWith('.' + suffix) || hostname.endsWith(suffix)
    );

    if (!isAllowedHost) {
      return { isValid: false, error: 'Domain is not in the list of allowed external media sources' };
    }

    return { isValid: true, parsedUrl: parsed };
  } catch {
    return { isValid: false, error: 'Malformed URL provided' };
  }
}
