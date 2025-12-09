// import validator from 'validator';

// // Reserved words that cannot be used as custom codes
// const RESERVED_WORDS = new Set([
//   'api', 'admin', 'stats', 'analytics', 'health', 'cache',
//   'login', 'register', 'user', 'account', 'www', 'dashboard',
//   'settings', 'profile', 'auth', 'logout', 'signup'
// ]);

// export function isReservedWord(word) {
//   return RESERVED_WORDS.has(word?.toLowerCase());
// }

// export function sanitizeInput(input) {
//   if (!input || typeof input !== 'string') return '';
  
//   // Remove whitespace
//   let sanitized = input.trim();
  
//   // Block SQL injection patterns
//   const sqlPatterns = [
//     /(\bselect\b.*\bfrom\b)/i,
//     /(\bunion\b.*\bselect\b)/i,
//     /(\binsert\b.*\binto\b)/i,
//     /(\bdelete\b.*\bfrom\b)/i,
//     /(\bdrop\b.*\btable\b)/i,
//     /(\bupdate\b.*\bset\b)/i,
//     /(--|;|@@|\/\*|\*\/)/,
//     /(\bxp_\w+)/i,
//     /(\bexec\b|\bexecute\b)/i
//   ];
  
//   for (const pattern of sqlPatterns) {
//     if (pattern.test(sanitized)) {
//       throw new Error('SQL injection attempt detected');
//     }
//   }
  
//   // Escape HTML/XSS
//   sanitized = validator.escape(sanitized);
  
//   return sanitized;
// }

// export function validateUrl(url) {
//   if (!url || typeof url !== 'string') {
//     throw new Error('URL is required');
//   }
  
//   if (url.length === 0) {
//     throw new Error('URL cannot be empty');
//   }
  
//   if (url.length > 2048) {
//     throw new Error('URL too long (max 2048 characters)');
//   }
  
//   // Block dangerous protocols
//   const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
//   const lowerUrl = url.toLowerCase();
  
//   for (const proto of dangerousProtocols) {
//     if (lowerUrl.startsWith(proto)) {
//       throw new Error('Dangerous protocol blocked');
//     }
//   }
  
//   // Validate URL format
//   try {
//     const parsedUrl = new URL(url);
    
//     // Only allow http/https
//     if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
//       throw new Error('Only HTTP/HTTPS protocols allowed');
//     }
    
//     return true;
//   } catch {
//     throw new Error('Invalid URL format');
//   }
// }

// export function validateCustomCode(code) {
//   if (!code) return true; // Optional field
  
//   if (typeof code !== 'string') {
//     throw new Error('Custom code must be a string');
//   }
  
//   const sanitized = code.trim();
  
//   if (sanitized.length < 3 || sanitized.length > 20) {
//     throw new Error('Custom code must be 3-20 characters');
//   }
  
//   // Only alphanumeric and hyphens
//   if (!/^[a-zA-Z0-9-]+$/.test(sanitized)) {
//     throw new Error('Custom code can only contain letters, numbers, and hyphens');
//   }
  
//   // Check reserved words
//   if (isReservedWord(sanitized)) {
//     throw new Error('This custom code is reserved and cannot be used');
//   }
  
//   return true;
// }



import validator from 'validator';

const RESERVED_WORDS = new Set([
  'api', 'admin', 'stats', 'analytics', 'health', 'cache',
  'login', 'register', 'user', 'account', 'www', 'dashboard',
  'settings', 'profile', 'auth', 'logout', 'signup'
]);

export function isReservedWord(word) {
  return RESERVED_WORDS.has(word?.toLowerCase());
}

export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  
  // Remove whitespace
  let sanitized = input.trim();
  
  // Block SQL injection patterns
  const sqlPatterns = [
    /(\bselect\b.*\bfrom\b)/i,
    /(\bunion\b.*\bselect\b)/i,
    /(\binsert\b.*\binto\b)/i,
    /(\bdelete\b.*\bfrom\b)/i,
    /(\bdrop\b.*\btable\b)/i,
    /(\bupdate\b.*\bset\b)/i,
    /(--|;|@@|\/\*|\*\/)/,
    /(\bxp_\w+)/i,
    /(\bexec\b|\bexecute\b)/i
  ];
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(sanitized)) {
      throw new Error('SQL injection attempt detected');
    }
  }
  
  // ✅ DON'T escape URLs - just return trimmed and validated
  // validator.escape() breaks URLs by converting : and / to HTML entities
  return sanitized;
}

export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required');
  }
  
  if (url.length === 0) {
    throw new Error('URL cannot be empty');
  }
  
  if (url.length > 2048) {
    throw new Error('URL too long (max 2048 characters)');
  }
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase();
  
  for (const proto of dangerousProtocols) {
    if (lowerUrl.startsWith(proto)) {
      throw new Error('Dangerous protocol blocked');
    }
  }
  
  // Validate URL format
  try {
    const parsedUrl = new URL(url);
    
    // Only allow http/https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Only HTTP/HTTPS protocols allowed');
    }
    
    return true;
  } catch {
    throw new Error('Invalid URL format');
  }
}

export function validateCustomCode(code) {
  if (!code) return true; // Optional field
  
  if (typeof code !== 'string') {
    throw new Error('Custom code must be a string');
  }
  
  const sanitized = code.trim();
  
  if (sanitized.length < 3 || sanitized.length > 20) {
    throw new Error('Custom code must be 3-20 characters');
  }
  
  // Only alphanumeric and hyphens
  if (!/^[a-zA-Z0-9-]+$/.test(sanitized)) {
    throw new Error('Custom code can only contain letters, numbers, and hyphens');
  }
  
  // Check reserved words
  if (isReservedWord(sanitized)) {
    throw new Error('This custom code is reserved and cannot be used');
  }
  
  return true;
}
