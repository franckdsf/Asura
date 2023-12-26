import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { type Shop } from '@shopify/hydrogen/storefront-api-types';
import { AnalyticsPageType } from '@shopify/hydrogen';
import { OtherPolicies } from './($locale).policies.others.$handle';
import { STORE } from '~/store.info';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${STORE.name} | ${data?.policy.title}` }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', { status: 404 });
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  if (OtherPolicies.includes(params.handle)) {
    throw redirect(`/policies/others/${params.handle}`);
  }

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', { status: 404 });
  }

  return json({
    policy,
    analytics: {
      pageType: AnalyticsPageType.policy,
    },
  });
}

export default function Policy() {
  const { policy } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-5xl px-4 mx-auto mt-24 page">
      <header>
        <h1 className="text-2xl uppercase lg:text-7xl font-accent">{policy.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{ __html: policy.body }} className="mt-6 mb-32" />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
