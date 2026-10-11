// Qaf-style sections: section heading + 4-up product grid, then a dark reseller banner.
// language: TSX
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/products/components/product-card"
import SectionHeading from "@modules/common/components/section-heading"

type ProductSectionProps = {
  id: string
  title: string
  href?: string
  region: HttpTypes.StoreRegion
  limit?: number
}

export default async function ProductSection({
  id,
  title,
  href,
  region,
  limit = 4,
}: ProductSectionProps) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: [id],
      fields: "*variants.calculated_price",
      limit,
    },
  })

  if (!products?.length) {
    return null
  }

  return (
    <section
      className="pt-10 small:pt-14 pb-12 small:pb-20"
      data-testid="product-section"
      aria-labelledby={`${title}-heading`}
    >
      <SectionHeading title={title} href={href} />
      <div className="content-container">
        <ul className="mt-8 grid grid-cols-2 small:grid-cols-4 gap-x-4 small:gap-x-6 gap-y-10 small:gap-y-14">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} region={region} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
