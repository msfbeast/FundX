// Input sanitization utilities to prevent injection attacks

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export const sanitizeInput = (input: string, maxLength: number = 500): string => {
  if (!input) return '';
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:text\/html/gi, '')
    // Trim whitespace
    .trim()
    // Limit length
    .slice(0, maxLength);
};

/**
 * Sanitize email input
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  return email
    .toLowerCase()
    .trim()
    .slice(0, 254); // Max email length per RFC
};

/**
 * Sanitize URL input
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
};

/**
 * Validate and sanitize startup context
 */
export const sanitizeStartupContext = (context: any): any => {
  return {
    name: sanitizeInput(context.name, 100),
    description: sanitizeInput(context.description, 1000),
    stage: sanitizeInput(context.stage, 50),
    pitch: sanitizeInput(context.pitch, 2000),
    roundSize: sanitizeInput(context.roundSize, 50),
    traction: sanitizeInput(context.traction, 1000),
    team: sanitizeInput(context.team, 1000),
    problem: sanitizeInput(context.problem, 1000),
    solution: sanitizeInput(context.solution, 1000),
    market: sanitizeInput(context.market, 1000),
    businessModel: sanitizeInput(context.businessModel, 1000),
    competitors: sanitizeInput(context.competitors, 1000),
    useOfFunds: sanitizeInput(context.useOfFunds, 1000),
  };
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Rate limiting helper (client-side)
 * Note: This is NOT secure - real rate limiting must be server-side
 * This is just to prevent accidental spam
 */
class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return true;
  }
  
  reset(key: string): void {
    this.requests.delete(key);
  }
}

export const rateLimiter = new ClientRateLimiter();
