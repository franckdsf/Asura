import type { EntryContext } from '@shopify/remix-oxygen';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { createContentSecurityPolicy } from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    defaultSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      "https://cdn.shopifycdn.net",
      // apps
      "https://pp-proxy.parcelpanel.com",
      "https://loox.io",
      // cms
      'https://cdn.sanity.io',
      // pixels
      "https://static.hotjar.com",
      "https://www.googletagmanager.com"
    ],
    connectSrc: [
      "'self'",
      "https://pp-proxy.parcelpanel.com",
      "https://static.hotjar.com",
      // any other URLs your app needs to connect to
    ],
    frameAncestors: [
      "'self'",
      "https://loox.io",
      "https://www.googletagmanager.com"
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
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
