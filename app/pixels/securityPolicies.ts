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
  "https://*.googleadservices.com"
  // "https://*.g.doubleclick.net",
  // "https://*.google.com",
]

export const securityPolicies = {
  defaultSrc: [
    // google
    ...GOOGLE,
    // hotjar
    "https://script.hotjar.com"
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
    // hotjar
    "https://static.hotjar.com",
    // google
    ...GOOGLE,
  ]
} as const;