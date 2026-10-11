// Static dummy variant of ProductCard for the /preview-qaf page.
// language: TSX
import Image from "next/image"
import { Text } from "@modules/common/components/ui"

const IDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

type PreviewCardProps = {
  title: string
  original: number
  current: number
  img: string
}

export default function ProductSectionPreview({
  title,
  original,
  current,
  img,
}: PreviewCardProps) {
  const onSale = original > current
  const percent = onSale
    ? Math.round(((original - current) / original) * 100)
    : 0

  return (
    <div className="group flex flex-col">
      <div className="relative w-full overflow-hidden rounded-large bg-ui-bg-subtle aspect-[1/1] shadow-elevation-card-rest transition-shadow ease-in-out duration-150 group-hover:shadow-elevation-card-hover">
        <Image
          src={img}
          alt={title}
          className="absolute inset-0 object-cover object-center"
          draggable={false}
          quality={50}
          fill
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
        />
        {onSale && (
          <span
            className="absolute left-0 top-0 z-10 bg-[#1A952B] px-2.5 py-1 text-xsmall-regular font-semibold text-white shadow-sm"
            data-testid="sale-badge"
          >
            -{percent}%
          </span>
        )}
      </div>

      <div className="mt-3 small:mt-4 flex flex-col gap-y-1">
        <Text className="txt-compact-medium text-ui-fg-base line-clamp-2 min-h-[2.6em] group-hover:text-marun transition-colors">
          {title}
        </Text>
        <div className="flex items-baseline gap-x-2 txt-compact-medium">
          {onSale && (
            <Text className="line-through text-ui-fg-muted">
              {IDR.format(original)}
            </Text>
          )}
          <Text className={onSale ? "text-marun font-semibold" : "text-ui-fg-muted"}>
            {IDR.format(current)}
          </Text>
        </div>
        <button
          type="button"
          className="mt-1 w-full rounded-soft border border-marun/30 bg-marun/5 px-3 py-2 text-xsmall-regular text-marun transition-colors hover:bg-marun hover:text-white"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  )
}
