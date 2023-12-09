import type { EntryContext } from '@shopify/remix-oxygen';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { createContentSecurityPolicy } from '@shopify/hydrogen';
import { securityPolicies } from './tracking/securityPolicies';

const BASIC_SECURITY_POLICIES = [
  "'self'",
  'https://cdn.shopify.com',
  'https://shopify.com',
  "https://cdn.shopifycdn.net",
  "https://*.shopifysvc.com"
]

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    defaultSrc: [
      ...BASIC_SECURITY_POLICIES,
      // apps
      "https://pp-proxy.parcelpanel.com",
      "https://loox.io",
      // cms
      'https://cdn.sanity.io',
      // pixels
      "https://static.hotjar.com",
      ...securityPolicies.defaultSrc,
    ],
    connectSrc: [
      ...BASIC_SECURITY_POLICIES,
      // any other URLs your app needs to connect to
      "https://pp-proxy.parcelpanel.com",
      ...securityPolicies.connectSrc,
    ],
    frameAncestors: [
      ...BASIC_SECURITY_POLICIES,
      "https://loox.io",
      ...securityPolicies.frameAncestors,
    ],
    styleSrc: [
      ...BASIC_SECURITY_POLICIES,
      "'unsafe-inline'",
      ...securityPolicies.styleSrc,
    ]
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  // responseHeaders.set('Content-Security-Policy', header);
  // TODO : fix judge me Content-Security-Policy

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
