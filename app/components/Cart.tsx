import { CartForm, Money, parseGid } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { Await, Link } from '@remix-run/react';
import type { CartApiQueryFragment, UpsellProductFragment, UpsellProductQuery } from 'storefrontapi.generated';
import { Icon } from '~/ui/atoms';
import { FreeItem } from '~/components/cart/FreeItem';
import { CheckoutLink } from '~/tracking/components';
import { type CartModule } from '~/queries/sanity.types';
import { CMS } from '~/queries/sanity';
import { Countdown } from './cart/Countdown';
import { Suspense, useMemo } from 'react';
import { UpsellCartItem } from './cart/Upsell';
import { CartLineItem } from './cart/LineItem';

export type CartMainProps = {
  upsell: Promise<UpsellProductQuery | null>;
  cart: CartApiQueryFragment | null;
  modules: CartModule | null;
  layout: 'page' | 'aside';
};

export function CartMain({ layout, cart, modules, upsell }: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} modules={modules} layout={layout} upsell={upsell} />
    </div>
  );
}

function CartDetails({ layout, cart, modules, upsell }: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  const freeItems = useMemo(() => {
    if (!cartHasItems || !modules?.freeItems) return [];
    return modules?.freeItems.filter((item) => {
      const cartItems = cart?.lines.nodes.map((l) => parseGid(l.merchandise.product.id).id) || [];
      return item.linkedProducts.some((e) => cartItems.includes(e));
    })
  }, [cartHasItems, cart, modules])

  const discount = cart?.lines.nodes.reduce((discount, line) => {
    if (!line.cost.compareAtAmountPerQuantity) return discount;
    const reductionAmount = Number(line.cost.compareAtAmountPerQuantity.amount) - Number(line.cost.amountPerQuantity.amount);
    return discount + freeItems.reduce((i, p) => i + p.compareAtPrice, 0) + reductionAmount * line.quantity;
  }, 0)

  const cost = cartHasItems ? {
    ...cart.cost,
    discount: {
      amount: `${discount}`,
      currencyCode: cart.cost.totalAmount.currencyCode
    }
  } : null;

  return (
    <div className="cart-details">
      <CartLines lines={cart?.lines} layout={layout} />
      {freeItems.map((item) => {
        return (
          <FreeItem
            key={item.name}
            name={item.name}
            compareAtPrice={item.compareAtPrice}
            imgSrc={CMS.urlForImg(item.image.asset._ref).width(500).url()}
          />
        )
      })}
      <Suspense>
        <Await resolve={upsell}>
          {(product) => product?.product && <UpsellModule
            upsell={product.product}
            layout={layout}
            lines={cart?.lines}
          />}
        </Await>
      </Suspense>
      {cartHasItems && (
        <CartSummary cost={cost!} layout={layout}>
          {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
          <CartCheckoutActions cart={cart} />
        </CartSummary>
      )}
    </div>
  );
}

function UpsellModule({ upsell, layout, lines }: {
  upsell: UpsellProductFragment,
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  const upsellAlreadyInCart = lines?.nodes.some((line) => {
    return upsell.variants.nodes.some((e) => parseGid(line.merchandise.id).id === parseGid(e.id).id)
  })

  if (upsellAlreadyInCart) return null;

  return (
    <div className="mt-8 lg:mt-16">
      <p className="mb-2 text-center">Nous suggérons aussi</p>
      <UpsellCartItem product={upsell} layout={layout} />
    </div>
  )
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines || lines.nodes.length === 0) return null;

  return (
    <div aria-labelledby="cart-lines">
      <Countdown />
      <ul>
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
        {/* {lines.nodes.length > 0 && <FreeItem />} */}
      </ul>
    </div>
  );
}


function CartCheckoutActions({ cart }: { cart: CartApiQueryFragment }) {
  if (!cart.checkoutUrl) return null;

  return (
    <CheckoutLink
      cart={cart}
      className="float-right w-full max-w-xl px-5 py-4 mb-5 text-center rounded-full bg-neutral-900"
    >
      <p className="text-sm uppercase text-neutral-50 lg:text-md">Passer à la caisse <span className="mx-1">•</span> <Money data={cart.cost.subtotalAmount} className="inline-block" /></p>
    </CheckoutLink>
  );
}

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'] & { discount?: MoneyV2 };
  layout: CartMainProps['layout'];
}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div className="flex flex-row items-center justify-start max-w-sm px-4 py-1 mb-4 bg-container-light rounded-xs">
        <Icon.Truck className="mr-4 icon-md" />
        <p>Livraison standard offerte</p>
      </div>
      {cost?.discount && <dl className="pt-4 mb-4 border-t cart-subtotal text-md flex-row-between border-neutral-900">
        <dt><Icon.Tag className="inline-block ml-1" /> Vous économisez </dt>
        <dd className="ml-4 flex-row-center">
          {cost?.discount?.amount ? (
            <Money data={cost?.discount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>}
      {children}
      <img src="/assets/payment-methods.webp" width={500} height={37} alt="payment methods" className="object-contain h-6 mt-4 mb-6" />
    </div>
  );
}

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden} className={`${hidden && '!hidden'} h-112 flex-col-center`}>
      <p className="text-2xl text-center uppercase font-accent">
        Votre panier est vide
      </p>
      <Link
        className="px-6 py-3 mt-16 rounded-full bg-neutral-900 text-neutral-50"
        to="/collections"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/collections';
          }
        }}
      >
        Continuer les achats
      </Link>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

