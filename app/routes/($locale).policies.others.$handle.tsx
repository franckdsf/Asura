import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { AnalyticsPageType } from '@shopify/hydrogen';
import { STORE } from '~/store.info';

export const OtherPolicies = ['legal-notice', 'terms-of-sale'] as const;
export type TOtherPolicies = typeof OtherPolicies[number];

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${STORE.name} | ${data?.policy.title}` }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', { status: 404 });
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => ` ${m1}`,
  ) as string;


  return json({
    policy: { title: policyName, name: params.handle as TOtherPolicies },
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
      <main className="flex flex-col mt-6 mb-32 gap-y-8">
        {policy.name === "legal-notice" && <>
          <p>SELLEST (S.)</p>
          <p>SIREN : 922 789 771</p>
          <p>Adresse : 12 Rue de la Part Dieu, 69003, Lyon</p>
          <p>Téléphone : +33 07 56 93 97 04</p>
          <p>Mail : {STORE.contactEmail}</p>
          <p>Sellest est une société enregistrée en vertu des dispositions de la loi Française et basée à Lyon.</p>
        </>}
        {policy.name === "terms-of-sale" && <div>
          <p className="my-6 text-lg text-accent">APERÇU</p>

          Ce site web est exploité par Sellest. <br /><br />
          Partout sur le site, nous employons les termes « nous », « notre » et « nos » en référence à Sellest. Ce site web, y compris l&apos;ensemble des informations, outils et services auquel il donne accès, est offert par Sellest à l&apos;utilisateur que vous êtes, à condition que vous acceptiez la totalité des modalités, conditions, politiques et avis stipulés ici.
          <br /><br />
          En visitant notre site et/ou en achetant quelque chose auprès de notre entreprise, vous prenez part à notre « Service » et acceptez d&apos;être lié(e) par les modalités et conditions suivantes (« Conditions générales », « Conditions d&apos;utilisation »), y compris par les modalités, conditions et politiques mentionnées aux présentes et/ou accessibles en hyperlien. Les présentes Conditions d&apos;utilisation s&apos;appliquent à tous les utilisateurs du Site, y compris, sans s&apos;y limiter, aux individus qui sont des visiteurs, des fournisseurs, des clients, des marchands et/ou des fournisseurs de contenu.
          Veuillez lire attentivement les présentes Conditions d&apos;utilisation avant d&apos;accéder à notre site web et de l&apos;utiliser. En accédant à une quelconque partie du Site ou en l&apos;utilisant, vous acceptez d&apos;être lié(e) par les présentes Conditions d&apos;utilisation. Si vous n&apos;acceptez pas la totalité des modalités et conditions du présent accord, vous ne pourrez peut-être pas accéder au site web ou utiliser ses services. Si les présentes Conditions d&apos;utilisation sont considérées comme une offre, leur acceptation se limite expressément à elles.
          <br /><br />
          Chacun des nouveaux outils ou fonctionnalités qui sont ajoutés à la présente boutique est également assujetti aux Conditions d&apos;utilisation. Vous pouvez consulter la version la plus récente des Conditions d&apos;utilisation à tout moment sur cette page. Nous nous réservons le droit de mettre à jour, modifier ou remplacer n&apos;importe quelle partie des présentes Conditions d&apos;utilisation en publiant lesdites mises à jour et/ou modifications sur notre site web. Il vous incombe de vérifier cette page de temps à autre pour voir si des changements y ont été apportés. En continuant à accéder au site web ou à l&apos;utiliser après la publication des modifications, vous acceptez celles-ci.
          Notre boutique est hébergée sur Shopify Inc. Cette société nous fournit la plateforme e-commerce en ligne qui nous permet de vous vendre nos produits et services.

          <p className="my-6 text-lg text-accent">SECTION 1 – CONDITIONS D&apos;UTILISATION DE LA BOUTIQUE EN LIGNE</p>

          En acceptant les présentes Conditions d&apos;utilisation, vous déclarez avoir atteint ou dépassé l&apos;âge de la majorité dans votre région, province ou État et nous avoir donné l&apos;autorisation de permettre à toute personne mineure à votre charge d&apos;utiliser ce site.
          <br /><br />
          Vous ne devez en aucune façon utiliser nos produits à des fins illégales ou non autorisées, ni violer des lois de votre juridiction lorsque vous utilisez le Service (y compris, sans toutefois s&apos;y limiter, les lois relatives aux droits d&apos;auteur).
          <br /><br />
          Vous ne devez pas transmettre de vers informatique, de virus ou tout code de nature destructrice.
          <br /><br />
          Une infraction ou une violation de n&apos;importe laquelle des Conditions entraînera la résiliation immédiate de vos Services.
          <p className="my-6 text-lg text-accent">SECTION 2 – CONDITIONS GÉNÉRALES</p>

          Nous nous réservons le droit de refuser de servir quelqu&apos;un à tout moment et pour quelque raison que ce soit.
          <br /><br />
          Vous comprenez que votre contenu (à l&apos;exception des informations relatives à votre carte de crédit) peut être transféré sans chiffrement et que cela comprend (a) des transmissions sur plusieurs réseaux ; et (b) des changements effectués dans le but de se conformer et de s&apos;adapter aux exigences techniques de la connexion de réseaux ou d&apos;appareils. Les informations de votre carte de crédit sont toujours chiffrées lors de leur transfert sur les réseaux.
          <br /><br />
          Vous acceptez de ne pas reproduire, dupliquer, copier, vendre, revendre ou exploiter toute partie du Service, toute utilisation du Service ou tout accès au Service, ou encore tout contact sur le site web à travers lequel le Service est fourni, sans notre autorisation écrite expresse.
          <br /><br />
          Les titres utilisés dans le présent accord sont inclus à titre indicatif uniquement et ne limiteront ni n&apos;affecteront aucunement ces Conditions.

          <p className="my-6 text-lg text-accent">SECTION 3 – EXACTITUDE, EXHAUSTIVITÉ ET ACTUALITÉ DES INFORMATIONS</p>

          Nous ne saurions être tenus responsables si les informations proposées sur ce site sont inexactes, incomplètes ou caduques. Le contenu de ce site est fourni à titre d&apos;information générale uniquement et ne doit pas être considéré ou utilisé comme seule base pour la prise de décisions sans consulter des sources d&apos;information plus importantes, plus exactes, plus complètes ou plus actuelles. Si vous vous fiez au contenu de ce site, vous le faites à vos propres risques.
          <br /><br />
          Ce site peut contenir certaines données historiques. Par définition, les données historiques ne sont pas actuelles et sont fournies uniquement à titre de référence. Nous nous réservons le droit de modifier les contenus de ce site à tout moment, mais nous n&apos;avons aucune obligation de mettre à jour les informations qu&apos;il contient, quelles qu&apos;elles soient. Vous reconnaissez qu&apos;il vous incombe de surveiller les changements apportés à notre site.

          <p className="my-6 text-lg text-accent">SECTION 4 – MODIFICATIONS DU SERVICE ET DES PRIX</p>

          Les prix de nos produits sont modifiables sans préavis.
          <br /><br />
          Nous nous réservons le droit de modifier ou de mettre fin au Service (ou à une quelconque partie de celui-ci) à tout moment et sans préavis.
          <br /><br />
          Nous ne pourrons être tenus responsables envers vous ou tout tiers de tout changement de prix, ou encore de toute modification, suspension ou interruption du Service.

          <p className="my-6 text-lg text-accent">SECTION 5 – PRODUITS OU SERVICES (le cas échéant)</p>

          Il est possible que certains produits ou services ne soient disponibles qu&apos;en ligne à travers le site web. Il se peut que les quantités de ces produits ou services soient limitées et que leur retour ou leur échange soit strictement assujetti à notre Politique de retour.
          <br /><br />
          Nous nous sommes efforcés de présenter aussi précisément que possible les couleurs et images des produits figurant sur la boutique. Nous ne pouvons cependant pas garantir la précision d&apos;affichage des couleurs sur l&apos;écran de votre ordinateur.
          Nous nous réservons le droit, sans toutefois y être obligés, de limiter la vente de nos produits ou Services à n&apos;importe quelle personne, région géographique ou juridiction donnée. Nous nous autorisons à exercer ce droit au cas par cas. Nous nous réservons le droit de limiter les quantités des produits ou services que nous offrons. Toutes les descriptions des produits et leur tarification sont modifiables à tout moment, sans préavis et à notre entière discrétion. Nous nous réservons le droit d&apos;interrompre la vente d&apos;un produit à tout moment. Toute offre de produit ou service sur ce site est nulle là où la loi l&apos;interdit.
          <br /><br />
          Nous ne garantissons pas que la qualité des produits, services, informations ou autres matériels que vous achetez ou que vous vous procurez répondra à vos attentes ni que les erreurs que comporte éventuellement le Service seront corrigées.

          <p className="my-6 text-lg text-accent">SECTION 6 – EXACTITUDE DE LA FACTURATION ET DES INFORMATIONS DE COMPTE</p>

          Nous nous réservons le droit de refuser toute commande que vous passez auprès de nous. Nous pouvons, à notre seule discrétion, limiter ou annuler les quantités achetées par personne, par foyer ou par commande. Ces restrictions peuvent inclure les commandes passées par ou sur le même compte client, la même carte de crédit et/ou des commandes utilisant la même adresse de facturation et/ou d&apos;expédition. Si nous modifions ou annulons une commande, il se peut que nous tentions de vous en aviser en vous contactant au moyen de l&apos;adresse e-mail et/ou de l&apos;adresse de facturation ou du numéro de téléphone fournis au moment de la commande. Nous nous réservons le droit de limiter ou d&apos;interdire les commandes qui, selon nous, semblent avoir été passées par des négociants, des revendeurs ou des distributeurs.
          Vous acceptez de fournir des informations d&apos;achat et de compte actuelles, complètes et exactes pour tous les achats effectués dans notre boutique. Vous acceptez de mettre rapidement à jour votre compte et toute autre information, y compris votre adresse e-mail et vos numéros de cartes de crédit et leurs dates d&apos;expiration, afin que nous puissions finaliser vos transactions et vous contacter en cas de besoin.
          <br /><br />
          Pour plus d&apos;informations, veuillez consulter notre Politique de retour.

          <p className="my-6 text-lg text-accent">SECTION 7 – OUTILS FACULTATIFS</p>

          Nous sommes susceptibles de vous fournir l&apos;accès à des outils tiers que nous ne surveillons, ne contrôlons et ne gérons pas.
          <br /><br />
          Vous reconnaissez et acceptez que nous vous fournissons l&apos;accès à ces outils « tels quels » et « sous réserve de disponibilité », sans garantie, représentation ou condition d&apos;aucune sorte et sans la moindre approbation. Nous ne saurions être tenus responsables de quoi que ce soit à l&apos;égard de ce qui pourrait résulter de ou être relié à votre utilisation des outils facultatifs tiers.
          <br /><br />
          Toute utilisation par vous des outils facultatifs proposés par le biais du site est entièrement à votre discrétion et à vos propres risques. En outre, il vous appartient de vous renseigner sur les conditions dans lesquelles ces outils sont fournis par le(s) fournisseur(s) tiers concerné(s) et accepter ces conditions.
          <br /><br />
          Il se peut également qu&apos;à l&apos;avenir, nous proposions de nouveaux services et/ou de nouvelles fonctionnalités à travers le site web (y compris le lancement de nouveaux outils et ressources). Ces nouveaux services et/ou fonctionnalités seront aussi assujettis aux présentes Conditions d&apos;utilisation.

          <p className="my-6 text-lg text-accent"> ARTICLE 8 – LIENS DE TIERS</p>

          Certains contenus, produits et services accessibles via notre Service peuvent inclure des éléments provenant de tiers.
          <br /><br />
          Les liens de tiers sur ce site peuvent vous rediriger vers des sites web de tiers qui ne sont pas affiliés à nous. Nous ne sommes pas tenus d’examiner ou d’évaluer leur contenu ou leur exactitude, de même que nous ne garantissons pas et n’assumons aucune responsabilité quant aux contenus ou sites web, ou aux autres contenus, produits ou services de sources tierces.
          <br /><br />
          Nous ne sommes pas responsables des préjudices ou dommages liés à l’achat ou à l’utilisation de biens, services, ressources, contenus ou de toute autre transaction reliée à ces sites web tiers. Veuillez lire attentivement les politiques et pratiques de ces tiers et assurez-vous de bien les comprendre avant de vous engager dans une transaction. Les plaintes, réclamations, préoccupations ou questions concernant les produits de tiers doivent être adressées à ces mêmes tiers.

          <p className="my-6 text-lg text-accent"> ARTICLE 9 – COMMENTAIRES, RETOURS D&apos;EXPÉRIENCE ET AUTRES SOUMISSIONS</p>

          Si, à notre demande, vous soumettez des contenus spécifiques (par exemple, dans le cadre de votre participation à des concours), ou si, sans demande de notre part, vous envoyez des idées créatives, des suggestions, des propositions, des plans ou d’autres éléments, que ce soit en ligne, par e-mail, par courrier ou autrement (collectivement, « commentaires »), vous nous accordez le droit, à tout moment et sans restriction, de modifier, copier, publier, distribuer, traduire et utiliser dans quelque média que ce soit tous les commentaires que vous nous transmettez. Nous ne sommes pas et ne devrons en aucun cas être tenus (1) de maintenir la confidentialité des commentaires ; (2) de dédommager qui que ce soit pour tout commentaire fourni ; ou (3) de répondre aux commentaires.
          7. Nous pouvons, mais nous n&apos;en avons pas l&apos;obligation, supprimer le contenu et les Comptes contenant du contenu que nous jugeons, à notre seule discrétion, illégal, offensant, menaçant, diffamatoire, pornographique, obscène ou autrement répréhensible ou qui viole la propriété intellectuelle d&apos;une partie ou les présentes Conditions d&apos;utilisation.
          Vous convenez que vos commentaires ne doivent en aucun cas porter atteinte aux droits de tiers, y compris aux droits d&apos;auteur, aux marques de commerce, à la vie privée, à la personnalité ou à tout autre droit personnel ou de propriété intellectuelle. Vous convenez en outre que vos commentaires ne devront contenir aucun élément illégal, injurieux ou obscène, ni aucun virus informatique ou autre logiciel malveillant susceptible d&apos;affecter d&apos;une quelconque façon le fonctionnement du Service ou de tout site web connexe. Vous ne pouvez pas utiliser de fausse adresse e-mail, prétendre être quelqu’un que vous n’êtes pas, ou essayer de nous induire, nous ou les tiers, en erreur quant à l’origine des commentaires. Vous êtes entièrement responsable de tous les commentaires que vous émettez ainsi que de leur exactitude. Nous déclinons toute responsabilité à l&apos;égard des commentaires publiés par vous ou un tiers.


          <p className="my-6 text-lg text-accent">ARTICLE 10 – INFORMATIONS PERSONNELLES</p>

          La transmission de vos informations personnelles sur notre boutique est régie par notre Politique de confidentialité. Cliquez ici pour consulter notre Politique de Confidentialité.

          <p className="my-6 text-lg text-accent">ARTICLE 11 – ERREURS, INEXACTITUDES ET OMISSIONS</p>

          Il se peut qu&apos;il y ait parfois, sur notre site ou dans le Service, des informations contenant des erreurs typographiques, des inexactitudes ou des omissions reliées aux descriptions, aux prix, aux promotions, aux offres, aux frais d’expédition, aux délais d&apos;acheminement et à la disponibilité des produits. Nous nous réservons le droit de corriger toute erreur, inexactitude ou omission, et de changer ou d&apos;actualiser des informations, voire d’annuler des commandes si une quelconque information dans le Service ou sur tout site web connexe est inexacte, et ce, à tout moment et sans préavis (y compris après que vous ayez passé votre commande).

          Nous ne sommes pas tenus d&apos;actualiser, de modifier ou de clarifier les informations indiquées dans le Service ou sur tout site web connexe, y compris mais sans s&apos;y limiter, les informations sur les prix, sauf si la loi l&apos;exige. Aucune date précise de mise à jour ou d’actualisation appliquée au Service ou à tout site web connexe ne saurait être définie pour indiquer que l&apos;ensemble des informations offertes dans le Service ou sur tout site web connexe ont été modifiées ou mises à jour.

          <p className="my-6 text-lg text-accent">ARTICLE 12 – UTILISATIONS INTERDITES</p>

          En plus des autres interdictions énoncées dans les Conditions d’utilisation, il vous est interdit d’utiliser le site ou son contenu :
          (a) à des fins illégales ; (b) pour inciter des tiers à réaliser des actes illégaux ou à y prendre part ; (c) pour enfreindre toute ordonnance locale ou toute réglementation, règle ou loi internationale, fédérale, provinciale ou étatique ; (d) pour transgresser ou violer nos droits de propriété intellectuelle ou ceux de tiers ; (e) pour harceler, maltraiter, insulter, blesser, diffamer, calomnier, dénigrer, intimider ou discriminer quiconque en fonction du sexe, de l’orientation sexuelle, de la religion, de l’origine ethnique, de la race, de l’âge, de l’origine nationale ou d’un handicap ; (f) pour soumettre des renseignements faux ou trompeurs ;
          (g) pour mettre en ligne ou transmettre des virus ou tout autre type de code malveillant qui sera ou pourrait être utilisé en vue de compromettre la fonctionnalité ou le fonctionnement du Service ou de tout site web connexe, ainsi que d&apos;autres sites web ou d’Internet ; (h) pour recueillir ou suivre les renseignements personnels d’autrui ; (i) pour spammer, hameçonner, détourner un domaine, extorquer des informations, parcourir, explorer ou balayer le web ; (j) à des fins obscènes ou immorales ; ou (k) pour perturber ou contourner les mesures de sécurité du Service ou de tout site connexe, ainsi que d&apos;autres sites web ou d’Internet. Nous nous réservons le droit de mettre fin à votre utilisation du Service ou de tout site web connexe pour avoir enfreint les interdits en matière d&apos;utilisation.

          <p className="my-6 text-lg text-accent">ARTICLE 13 – EXCLUSION DE GARANTIES ET LIMITATION DE RESPONSABILITÉ</p>

          Nous ne garantissons, certifions ou déclarons en aucun cas que votre utilisation de notre Service sera ininterrompue, sécurisée, sans délai ou sans erreur.
          <br /><br />
          Nous ne garantissons pas que les résultats qui pourraient être obtenus en utilisant le Service seront exacts ou fiables.
          <br /><br />
          Vous acceptez que, de temps à autre, nous puissions retirer le Service pour des périodes indéterminées ou l&apos;annuler à tout moment et sans préavis.
          Vous convenez expressément que votre utilisation du Service, ou votre incapacité à utiliser celui-ci, est à votre seul risque. Le Service ainsi que tous les produits et services qui vous sont fournis par le biais de celui-ci sont (sauf mention expresse de notre part) fournis « tels quels » et « sous réserve de disponibilité » pour votre utilisation, et ce, sans représentation, garanties ou conditions d&apos;aucune sorte, soit expresses soit implicites, y compris toutes les garanties ou conditions implicites de commercialisation ou de qualité marchande, d’adaptation à un usage particulier, de durabilité, de titre et d’absence de contrefaçon.
          Sellest, nos directeurs, responsables, employés, sociétés affiliées, agents, contractants, stagiaires, fournisseurs, prestataires de services et concédants ne peuvent en aucun cas être tenus responsables de toute blessure, perte, réclamation, ou de quelconques dommages directs, indirects, accessoires, punitifs, spéciaux ou consécutifs, y compris mais sans s&apos;y limiter, de la perte de profits, revenus, économies ou données, de coûts de remplacement ou autres dommages similaires, qu’ils soient contractuels, délictuels (même en cas de négligence), de responsabilité stricte ou autre, résultant de votre utilisation du Service ou de tout service ou produit recourant à celui-ci, ou de toute autre réclamation liée de quelque manière que ce soit à votre utilisation du Service ou de tout produit, y compris mais sans s&apos;y limiter, à des erreurs ou omissions dans un contenu, ou à de quelconques pertes ou dommages découlant de l’utilisation du Service ou d&apos;un contenu (ou produit) publié, transmis ou rendu accessible par le biais du Service, et ce, même si vous avez été averti(e) de la possibilité qu’ils surviennent.
          Du fait que certains États ou juridictions ne permettent pas d’exclure ou de limiter la responsabilité quant aux dommages consécutifs ou accessoires, notre responsabilité dans ces États ou juridictions sera limitée dans la mesure maximale permise par la loi.

          <p className="my-6 text-lg text-accent">ARTICLE 14 – INDEMNISATION</p>

          Vous acceptez d’indemniser, de défendre et de tenir Sellest et notre société mère, nos filiales, sociétés affiliées, partenaires, responsables, directeurs, agents, contractants, concédants, prestataires de services, sous-traitants, fournisseurs, stagiaires et employés, quittes de toute réclamation ou demande, y compris d&apos;honoraires raisonnables d’avocat, émise par un quelconque tiers à cause de ou consécutivement à votre violation des présentes Conditions d’utilisation ou des documents auxquels elles font référence, ou à votre violation de quelconques lois ou droits d’un tiers.

          <p className="my-6 text-lg text-accent">ARTICLE 15 – DISSOCIABILITÉ</p>

          Dans le cas où une quelconque disposition des présentes Conditions d’utilisation est jugée illégale, nulle ou inapplicable, cette disposition sera néanmoins applicable dans la pleine mesure permise par la loi, et la partie non applicable sera considérée comme étant dissociée de ces Conditions d’utilisation, sans que ce jugement n&apos;affecte la validité et l’applicabilité des autres dispositions.

          <p className="my-6 text-lg text-accent">ARTICLE 16 – RÉSILIATION</p>

          Les obligations et responsabilités engagées par les parties avant la date de résiliation resteront en vigueur après la résiliation de cet accord, et ce, à toutes fins.
          <br /><br />
          Les présentes Conditions d’utilisation resteront en vigueur, à moins et jusqu’à ce qu’elles soient résiliées par vous ou par nous. Vous pouvez résilier ces Conditions d’utilisation à tout moment en nous avisant que vous ne souhaitez plus utiliser nos Services, ou lorsque vous cessez d’utiliser notre site.
          Si nous jugeons ou suspectons, à notre seule discrétion, que vous ne respectez pas ou que vous n&apos;avez pas respecté une quelconque modalité ou disposition des présentes Conditions d’utilisation, nous pouvons également résilier cet accord à tout moment et sans préavis. Vous demeurerez alors responsable de toutes les sommes redevables jusqu’à la date de résiliation (incluse), en conséquence de quoi nous pouvons vous refuser l’accès à nos Services (ou à une partie de ceux-ci).


          <p className="my-6 text-lg text-accent">ARTICLE 17 – INTÉGRALITÉ DE L’ACCORD</p>

          Tout manquement de notre part à l’exercice ou à l’application d&apos;un droit ou d&apos;une disposition des présentes Conditions d’utilisation ne constitue pas une renonciation à ce droit ou à cette disposition.
          <br /><br />
          Les présentes Conditions d’utilisation ou toute autre politique ou règle d’exploitation que nous publions sur ce site ou qui concernent le Service constituent l’intégralité de l’entente et de l’accord entre vous et nous, et régissent votre utilisation du Service. Elles remplacent l&apos;ensemble des accords, communications et propositions antérieurs et actuels, oraux ou écrits, entre vous et nous (y compris, mais sans s&apos;y limiter, toute version antérieure des Conditions d’utilisation).
          Toute ambiguïté quant à l’interprétation de ces Conditions d’utilisation ne doit pas être interprétée en défaveur de la partie rédactrice.



          <p className="my-6 text-lg text-accent">ARTICLE 18 – LOI APPLICABLE</p>


          Les présentes Conditions d’utilisation, ainsi que tout accord distinct par lequel nous vous fournissons les Services sont régis et interprétés en vertu des lois de 12 rue de la part dieu, Lyon, Rhone, 69003, France.



          <p className="my-6 text-lg text-accent"> ARTICLE 19 – MODIFICATIONS APPORTÉES AUX CONDITIONS D’UTILISATION</p>

          Vous pouvez consulter la version la plus récente des Conditions d’utilisation à tout moment sur cette page.
          <br /><br />
          Nous nous réservons le droit, à notre seule discrétion, de mettre à jour, modifier ou remplacer toute partie des présentes Conditions d&apos;utilisation en publiant lesdites mises à jour et/ou modifications sur notre site web. Il vous incombe de vérifier notre site web de temps à autre pour voir si des changements y ont été apportés. En continuant à accéder à notre site web et au Service ou à les utiliser après la publication de modifications apportées aux présentes Conditions d&apos;utilisation, vous acceptez celles-ci.


          <p className="my-6 text-lg text-accent">  ARTICLE 20 – COORDONNÉES</p>



          Les questions relatives aux Conditions d’utilisation doivent nous être envoyées à {STORE.contactEmail}.
        </div>}
      </main>
    </div>
  );
}

