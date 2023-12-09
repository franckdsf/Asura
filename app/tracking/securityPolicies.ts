const GOOGLE = [
  // tag manager
  "https://*.googleapis.com",
  "https://*.googletagmanager.com",
  "https://*.gstatic.com",
  // ga4
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  // "https://*.googletagmanager.com",
  "https://*.g.doubleclick.net",
  "https://*.google.fr",  // "https://*.google.<TLD>"
  "https://*.google.com",
  // gads
  "https://google.com",
  "https://*.googleadservices.com",
  "http://*.googlesyndication.com",
  // "https://*.g.doubleclick.net",
  // "https://*.google.com",
]

export const securityPolicies = {
  defaultSrc: [
    // google
    ...GOOGLE,
    // hotjar
    "https://script.hotjar.com",
    // judge me
    "https://cdn.judge.me",
    "https://cache.judge.me/",
  ],
  styleSrc: [
    // google
    ...GOOGLE,
  ],
  frameAncestors: [
    // google
    ...GOOGLE,
  ],
  connectSrc: [
    // judge me 
    "https://cache.judge.me/",
    "https://cdn.judge.me",
    // hotjar
    "https://*.hotjar.com",
    "https://*.hotjar.io",
    // google
    ...GOOGLE,
  ]
} as const;