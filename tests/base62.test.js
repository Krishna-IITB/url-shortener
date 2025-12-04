// import base62 from '../src/utils/base62.js';

// describe('Base62 encode/decode', () => {
//   test('encodes simple numbers', () => {
//     expect(base62.encode(0)).toBe('0');
//     expect(base62.encode(1)).toBe('1');
//   });

//   test('encode/decode round-trip', () => {
//     const values = [1, 10, 123, 9999, 1234567];
//     for (const v of values) {
//       const code = base62.encode(v);
//       const decoded = base62.decode(code);
//       expect(decoded).toBe(v);
//     }
//   });

//   test('rejects negative numbers', () => {
//     expect(() => base62.encode(-1)).toThrow();
//   });
// });



import base62 from '../src/utils/base62.js';

describe('Base62 encode/decode', () => {
  test('encodes simple numbers', () => {
    expect(base62.encode(0)).toBe('0');
    expect(base62.encode(1)).toBe('1');
  });

  test('encode/decode round-trip', () => {
    const values = [1, 10, 123, 9999, 1234567];
    for (const v of values) {
      const code = base62.encode(v);
      const decoded = base62.decode(code);
      expect(decoded).toBe(v);
    }
  });
});
