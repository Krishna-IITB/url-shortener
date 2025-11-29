// Base62 character set: 0-9, A-Z, a-z
const CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = CHARSET.length;

// Encode a number to Base62 string
function encode(num) {
  if (num === 0) return CHARSET[0];
  let encoded = '';
  while (num > 0) {
    encoded = CHARSET[num % BASE] + encoded;
    num = Math.floor(num / BASE);
  }
  return encoded;
}

// Decode a Base62 string to number
function decode(str) {
  let decoded = 0;
  for (let i = 0; i < str.length; i++) {
    const charIndex = CHARSET.indexOf(str[i]);
    if (charIndex === -1) throw new Error(`Invalid Base62 character: ${str[i]}`);
    decoded = decoded * BASE + charIndex;
  }
  return decoded;
}

// Pad encoded string to minimum length
function pad(encoded, minLength = 7) {
  return encoded.padStart(minLength, CHARSET[0]);
}

export default { encode, decode, pad, CHARSET, BASE };
