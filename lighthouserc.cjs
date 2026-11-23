module.exports = {
  ci: {
    collect: {
      // Test against the built static files
      staticDistDir: './dist',
      // URLs to test (relative to staticDistDir)
      url: ['/', '/kubernetes-operator-pattern/'],
      // Number of runs per URL for more stable results
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // Performance budgets
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],

        // Resource budgets
        'resource-summary:script:size': ['warn', { maxNumericValue: 100000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50000 }],
        'resource-summary:total:size': ['warn', { maxNumericValue: 500000 }],
      },
    },
    upload: {
      // Don't upload to public storage
      target: 'temporary-public-storage',
    },
  },
};
