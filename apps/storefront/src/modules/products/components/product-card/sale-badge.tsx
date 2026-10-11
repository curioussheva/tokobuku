// Sale badge: green pill at the cover's top-left, same spot as the Qaf onsale badge.
// language: TSX
import { clx } from "@modules/common/components/ui"
import { VariantPrice } from "types/global"

type SaleBadgeProps = {
  price: VariantPrice
  className?: string
}

export default function SaleBadge({ price, className }: SaleBadgeProps) {
  const percent = computeSalePercent(price)

  return (
    <span
      className={clx(
        "absolute left-0 top-0 z-10 inline-flex items-center justify-center rounded-none",
        "bg-[#1A952B] px-2.5 py-1 text-xsmall-regular font-semibold text-white",
        "shadow-sm",
        className
      )}
      data-testid="sale-badge"
    >
      -{percent}%
    </span>
  )
}

function computeSalePercent(price: VariantPrice): number {
  const original = price.original_price_number
  const current = price.calculated_price_number

  if (!original || !current || original <= current) {
    return 0
  }

  return Math.round(((original - current) / original) * 100)
}
