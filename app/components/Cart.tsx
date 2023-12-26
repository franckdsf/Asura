import { CartForm, Image, Money, parseGid } from '@shopify/hydrogen';
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import { Link } from '@remix-run/react';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/utils';
import { Icon } from '~/ui/atoms';
import { FreeItem } from '~/components/cart/FreeItem';
import { CheckoutLink } from '~/tracking/components';
import { type CartModule } from '~/queries/sanity.types';
import { CMS } from '~/queries/sanity';
import { Countdown } from './cart/Countdown';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  modules: CartModule | null;
  layout: 'page' | 'aside';
};

export function CartMain({ layout, cart, modules }: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} modules={modules} layout={layout} />
    </div>
  );
}

function CartDetails({ layout, cart, modules }: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cart-details">
      <CartLines lines={cart?.lines} layout={layout} />
      {modules?.freeItems.map((item) => {
        const cartItems = cart?.lines.nodes.map((l) => parseGid(l.merchandise.product.id).id) || [];
        if (!item.linkedProducts.some((e) => cartItems.includes(e))) return null;

        return (
          <FreeItem
            key={item.name}
            name={item.name}
            compareAtPrice={item.compareAtPrice}
            imgSrc={CMS.urlForImg(item.image.asset._ref).width(500).url()}
          />
        )
      })}
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
          <CartCheckoutActions cart={cart} />
        </CartSummary>
      )}
    </div>
  );
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

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className="cart-line border-b border-neutral-300 !py-6">
      {image && (
        <Image
          alt={title}
          data={image}
          height={130}
          loading="lazy"
          width={100}
        />
      )}

      <div>
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              // close the drawer
              window.location.href = lineItemUrl;
            }
          }}
        >
          <p className="uppercase text-xs-semibold">
            {product.title}
          </p>
        </Link>
        <ul>
          {selectedOptions.map((option) => (
            <li key={option.name} className={`${option.name === "Title" && 'opacity-0'}`}>
              <small className="text-xs uppercase">
                {option.name}: {option.value}
              </small>
            </li>
          ))}
        </ul>
        <CartLinePrice line={line} as="span" className="my-2" />
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartCheckoutActions({ cart }: { cart: CartApiQueryFragment }) {
  if (!cart.checkoutUrl) return null;

  return (
    <CheckoutLink
      cart={cart}
      className="float-right w-full max-w-xl px-5 py-3 mb-5 text-center rounded-full bg-neutral-900"
    >
      <p className="text-sm uppercase text-neutral-50 lg:text-md">Passer à la caisse</p>
    </CheckoutLink>
  );
}

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
  layout: CartMainProps['layout'];
}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div className="flex flex-row items-center justify-start max-w-sm px-4 py-1 mb-4 bg-container-light rounded-xs">
        <Icon.Truck className="mr-4 icon-md" />
        <p>Livraison standard offerte *</p>
      </div>
      <dl className="pt-4 mb-4 border-t cart-subtotal text-md flex-row-between border-neutral-900">
        <dt>Sous-total</dt>
        <dd className="ml-4">
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      {children}
      <img src="/assets/payment-methods.webp" width={500} height={37} alt="payment methods" className="object-contain h-6 mt-4 mb-6" />
    </div>
  );
}

function CartLineRemoveButton({ lineIds }: { lineIds: string[] }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <div>
        <button type="submit" className="p-2 border rounded-full border-neutral-500">
          <Icon.Minus className="icon-xs" />
        </button>
      </div>
    </CartForm>
  );
}

function CartLineQuantity({ line }: { line: CartLine }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex flex-row items-center justify-start cart-line-quantiy">
      {prevQuantity < 1 ? <CartLineRemoveButton lineIds={[lineId]} /> :
        <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            name="decrease-quantity"
            value={prevQuantity}
            className="p-2 border rounded-full border-neutral-500"
          >
            <Icon.Minus className="icon-xs" />
          </button>
        </CartLineUpdateButton>}
      <small className="mx-3 text-md">{quantity}</small>
      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          className="p-2 border rounded-full border-neutral-500"
        >
          <Icon.Plus className="icon-xs" />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  className = '',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
  className?: string;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className={`text-xs flex flex-row justify-start items-center gap-x-1 ${className}`}>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
      {line.cost.compareAtAmountPerQuantity && <Money withoutTrailingZeros
        className='line-through text-neutral-600'
        data={line.cost.compareAtAmountPerQuantity}
      />}
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

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}
