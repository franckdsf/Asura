import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen | ${data.page.title}` }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const { page } = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ page });
}

export default function Page() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="page px-4 max-w-5xl mx-auto mt-24">
      <header>
        <h1 className="uppercase text-2xl lg:text-7xl font-accent">{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{ __html: page.body }} className="mt-6 mb-32" />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
