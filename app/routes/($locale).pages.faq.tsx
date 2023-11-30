import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { Accordion } from '~/ui/molecules';
import { Link } from '~/ui/atoms';

export const meta: MetaFunction = ({ data }) => {
  return [{ title: `Asura | FAQ` }];
};

export default function Page() {
  return (
    <div className="max-w-5xl px-4 mx-auto mt-6 xl:mt-24 page">
      <header>
        <h1 className="text-2xl uppercase lg:text-7xl font-accent">FAQ</h1>
        <p className="max-w-xl mt-8 xl:mt-16">
          Trouvez rapidement des réponses aux questions courantes liées à vos besoins et simplifiez votre expérience sur notre boutique.
        </p>
      </header>
      <main className="p-8 pt-3 mt-8 border xl:mb-24 border-neutral-300">
        <Accordion
          className="mt-8"
          title="Quels sont les délais de livraison ?"
          content={[`Les délais de livraison que nous indiquons n'incluent pas les week-ends ni les jours fériés. Pour nos produits, 
          il faut prévoir un délai de traitement de 1 à 2 jours ouvrés avant l'expédition.`,
            `Une fois votre colis expédié, un numéro de suivi vous sera communiqué par e-mail.
        Vous pouvez alors vous attendre à recevoir votre commande à votre domicile dans un délai de 7 à 15 jours. 
        Ces délais varient en fonction de votre adresse de livraison."`
          ]}
        />
        <Accordion
          className="mt-8"
          title="Comment suivre ma commande ?"
          content={[
            `Après l'expédition de votre commande, vous devriez recevoir un numéro de confirmation d'expédition par e-mail dans un délai de 24 à 48 heures, 
            pensez à vérifier votre dossier de courrier indésirable si vous ne le trouvez pas. Ce numéro vous permettra de suivre votre colis en temps réel.`,
            `Vous pouvez aussi utiliser l'onglet 'Ma Commande' disponible sur notre site.`,
            `Si vous n'avez pas reçu de confirmation après quelques jours et avez des préoccupations, n'hésitez pas à nous contacter à contact@asura.fr. 
            Notre équipe du service client est là pour vous aider avec plaisir.`
          ]}
        />
        <Accordion
          className="mt-8"
          title="Comment modifier mes informations ?"
          content={[
            `Une fois votre commande passée, il n'est pas possible de modifier les détails de facturation ou d'expédition par vous-même.`,
            `Si vous avez besoin de faire des ajustements, veuillez prendre contact avec notre Service Client à contact@nookshop.fr.`,
            `Si votre colis n'a pas encore été expédié, nous pourrons organiser son envoi à la nouvelle adresse.`,
            `Cependant, une fois le colis en transit, les informations d'expédition ne pourront plus être modifiées.`
          ]}
        />
        <Accordion
          className="mt-8"
          title="Quels modes de paiement acceptez-vous ?"
          content={[
            `Nous vous offrons la possibilité de régler vos achats en utilisant divers moyens de paiement, notamment Carte Bancaire, Visa, Mastercard, Amex, Apple Pay, et Paypal.`,
            `Vous avez également la possibilité de régler en 3x sans frais grâce à notre partenaire Alma disponible à l'étape de paiement.`,
          ]}
        />
        <Accordion
          className="mt-8"
          title="Quel est le montant de la livraison ?"
          content={[
            `Chez nous, la satisfaction de nos clients est une valeur fondamentale. Nous nous efforçons constamment de répondre à vos besoins et de garantir une expérience d'achat des plus agréables.`,
            `En outre, nous sommes heureux de vous informer que la livraison de nos produits est entièrement gratuite.`,
            `C'est notre manière de vous remercier de faire partie de notre communauté de clients satisfaits.`
          ]}
        />
        <Link href="/pages/nous-contacter"
          className="inline-block px-6 py-3 mt-8 bg-neutral-900 text-neutral-50"
        >Contactez nous</Link>
      </main>
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
