import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { AnalyticsPageType } from '@shopify/hydrogen';
import { STORE } from '~/store.info';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${STORE.name} | ${data?.page.title}` }];
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

  return json({
    handle: params.handle,
    page,
    analytics: {
      pageType: AnalyticsPageType.page
    }
  });
}

export default function Page() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-5xl px-4 mx-auto mt-12 sm:mt-24 page">
      <header>
        <h1 className="text-2xl uppercase lg:text-7xl font-accent">{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{ __html: page.body }} className="mt-6 md:mt-16 mb-12 md:mb-24 [&>p]:mt-6" />
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
