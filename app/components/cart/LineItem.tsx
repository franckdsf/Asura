import type { CartApiQueryFragment, UpsellProductFragment } from "storefrontapi.generated";
import { CartForm, Image, Money } from '@shopify/hydrogen';
import { Icon, Link } from "~/ui/atoms";
import { useVariantUrl } from "~/utils";
import type { CartMainProps } from "../Cart";
import type { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types";

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

export function CartLineItem({
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
          height={100}
          loading="lazy"
          width={100}
        />
      )}
      <div>
        <Link
          prefetch="intent"
          href={lineItemUrl}
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
        <div className="flex flex-row items-center justify-start mt-2">
          <CartLineQuantity line={line} />
          <CartLinePrice
            line={line}
            as="span"
            className="ml-4 sm:ml-6"
          />
        </div>
      </div>
    </li>
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

function CartLinePrice({
  line,
  className = '',
  ...passthroughProps
}: {
  line: CartLine;
  [key: string]: any;
  className?: string;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  if (line.cost.amountPerQuantity == null) {
    return null;
  }

  const moneyV2 = {
    ...line.cost.amountPerQuantity,
    amount: `${Number(line.cost.amountPerQuantity.amount) * line.quantity}`
  };

  const compareAt = line.cost.compareAtAmountPerQuantity ? {
    ...line.cost.compareAtAmountPerQuantity,
    amount: `${Number(line.cost.compareAtAmountPerQuantity.amount) * line.quantity}`
  } : undefined;

  const reductionAmount = Number(compareAt!.amount || moneyV2.amount) - Number(moneyV2.amount);
  const reduction = {
    amount: `${Math.round(reductionAmount * 100) / 100}`,
    currencyCode: moneyV2.currencyCode
  }
  const reductionPourcent = Math.round(Number(reduction.amount) / Number(compareAt!.amount || moneyV2.amount) * 100);

  return (
    <div className={`${className}`}>
      <div className="flex flex-row items-center justify-start text-xs gap-x-2">
        <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
        {compareAt && <Money withoutTrailingZeros
          className='line-through text-neutral-600'
          data={compareAt}
        />}
      </div>
      {reductionAmount > 0 && <div className="text-2xs lg:text-xs text-primary-500 mt-0.5">
        Economisez <Money data={reduction} className='inline-block' />
      </div>}
      {line.quantity > 1 && reductionAmount > 0 && <div className="px-2 py-1 mt-2 uppercase text-2xs lg:text-xs lg:font-medium bg-container-light rounded-xs flex-row-center">
        <Icon.Tag className="inline-block mr-2 icon-sm" />
        acheter {line.quantity} pour {reductionPourcent}%
      </div>}
    </div>
  );
}