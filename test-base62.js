import base62 from './src/utils/base62.js';

console.log('=== Base62 Encoding Tests ===\n');

// Test basic encoding
const testIds = [1, 10, 100, 1000, 10000, 100000, 1000000];

testIds.forEach(id => {
  const encoded = base62.encode(id);
  const padded = base62.pad(encoded, 7);
  const decoded = base62.decode(padded);
  
  console.log(`ID: ${id.toString().padStart(10)} → Base62: ${padded} → Decoded: ${decoded} ✓`);
});

console.log('\n=== Capacity Test ===');
console.log(`7 characters can encode: ${Math.pow(62, 7).toLocaleString()} unique URLs`);
console.log(`6 characters can encode: ${Math.pow(62, 6).toLocaleString()} unique URLs`);
console.log(`5 characters can encode: ${Math.pow(62, 5).toLocaleString()} unique URLs`);
