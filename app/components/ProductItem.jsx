import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({ product, loading }) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="group flex flex-col gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="text-gray-400">No Image</div>
        )}

        {/* Nút giả lập Thêm vào giỏ hàng (chỉ hiển thị khi hover) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="bg-black text-white text-sm font-medium px-6 py-2 rounded-full whitespace-nowrap shadow-lg whitespace-nowrap">
            View Details
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-2">
        {product.vendor && (
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">
            {product.vendor}
          </span>
        )}
        <h4 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h4>
        <div className="font-bold text-lg text-black">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </div>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
