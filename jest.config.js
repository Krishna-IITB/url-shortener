export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/tests/**/*.test.js'],
  
  // ✅ Increased timeout for rate limit tests
  testTimeout: 30000,
  
  // ✅ Force exit after tests complete (prevents hanging)
  forceExit: true,
  
  // ✅ Detect and warn about open handles
  detectOpenHandles: true,
  
  // ✅ Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/cron/**'
  ],
  
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Don't reset modules (for performance)
  resetModules: false
};
