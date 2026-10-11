// Qaf-style product card. Mirrors penerbitqaf.com: square cover, sale badge
// overlapping the cover corner, title, strikethrough + sale price, add-to-cart.
// language: TSX, app: Next.js 15 (Medusa storefront), styling: Tailwind
import { Text, clx } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import PreviewPrice from "../product-preview/price"
import SaleBadge from "./sale-badge"

type ProductCardProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  showAddToCart?: boolean
}

export default function ProductCard({
  product,
  region: _region,
  showAddToCart = true,
}: ProductCardProps) {
  const { cheapestPrice } = getProductPrice({ product })
  const onSale = cheapestPrice?.price_type === "sale"

  return (
    <div className="group flex flex-col" data-testid="product-wrapper">
      <LocalizedClientLink href={`/products/${product.handle}`} className="block">
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured
          />
          {onSale && <SaleBadge price={cheapestPrice} />}
        </div>
      </LocalizedClientLink>

      <div className="flex flex-col gap-y-1 mt-3 small:mt-4">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <Text
            className="txt-compact-medium text-ui-fg-base line-clamp-2 min-h-[2.6em] group-hover:text-marun transition-colors"
            data-testid="product-title"
          >
            {product.title}
          </Text>
        </LocalizedClientLink>

        <div className="flex items-baseline gap-x-2 txt-compact-medium">
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>

        {showAddToCart && (
          <button
            type="button"
            className="mt-1 w-full rounded-soft border border-marun/30 bg-marun/5 px-3 py-2 text-xsmall-regular text-marun transition-colors hover:bg-marun hover:text-white"
            data-testid="product-add-to-cart"
          >
            Tambah ke Keranjang
          </button>
        )}
      </div>
    </div>
  )
}
