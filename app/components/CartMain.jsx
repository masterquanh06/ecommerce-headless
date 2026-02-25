import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from 'react-router';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';
/**
 * Returns a map of all line items and their children.
 * @param {CartLine[]} lines
 * @return {import("/Users/quanh/akira-headless/hydrogen-storefront/app/components/CartMain").LineItemChildrenMap}
 */
function getLineItemChildrenMap(lines) {
  const children = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const children = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(children)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({ layout, cart: originalCart }) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `flex flex-col gap-8 ${layout === 'page' ? 'lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start' : 'h-full'}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />

      {/* Phần Danh sách sản phẩm chiếm layout chính */}
      <div className="flex-1 overflow-y-auto w-full px-6 py-6">
        <ul aria-labelledby="cart-lines" className="flex flex-col w-full m-0 p-0 list-none">
          {(cart?.lines?.nodes ?? []).map((line) => {
            // we do not render non-parent lines at the root of the cart
            if (
              'parentRelationship' in line &&
              line.parentRelationship?.parent
            ) {
              return null;
            }
            return (
              <CartLineItem
                key={line.id}
                line={line}
                layout={layout}
                childrenMap={childrenMap}
              />
            );
          })}
        </ul>
      </div>
      {/* Phần Summary nằm bên phải (hoặc bên dưới) */}
      {cartHasItems && (
        <div className={layout === 'page' ? 'lg:col-span-5 xl:col-span-4' : 'mt-auto shrink-0'}>
          <CartSummary cart={cart} layout={layout} />
        </div>
      )}
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({ hidden = false }) {
  const { close } = useAside();
  return (
    <div hidden={hidden} className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">
        Your cart is empty
      </h3>
      <p className="text-gray-500 mb-8 max-w-sm">
        Looks like you haven't added anything yet. Let's get you started!
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="px-8 py-4 bg-black text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-gray-800 transition-colors hover:-translate-y-1 shadow-lg hover:shadow-xl duration-300"
      >
        Continue shopping
      </Link>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */
/** @typedef {{[parentId: string]: CartLine[]}} LineItemChildrenMap */

/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartLineItem').CartLine} CartLine */
