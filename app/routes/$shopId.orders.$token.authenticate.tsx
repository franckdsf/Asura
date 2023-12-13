import { type LoaderFunctionArgs, redirect } from '@shopify/remix-oxygen';

// redirect old checkout before storefront implementation to the new one
export async function loader({ request, context: { storefront } }: LoaderFunctionArgs) {
  const { origin } = new URL(request.url);

  const { shop } = await storefront.query(
    `query getShopDomain{ shop { primaryDomain{ url } } }`,
  );

  const onlineStoreStatusPage = request.url.replace(
    origin,
    shop.primaryDomain.url,
  );

  return redirect(onlineStoreStatusPage);
}