// Section heading: uppercase green label + right-aligned "Lihat Semua" link,
// separated by a full-width rule. Matches the Qaf "TERBARU / Lihat Semua" blocks.
// language: TSX
import { clx, Heading } from "@modules/common/components/ui"
import InteractiveLink from "@modules/common/components/interactive-link"

type SectionHeadingProps = {
  title: string
  href?: string
  linkLabel?: string
  className?: string
}

export default function SectionHeading({
  title,
  href,
  linkLabel = "Lihat Semua",
  className,
}: SectionHeadingProps) {
  return (
    <div className={clx("content-container", className)}>
      <div className="flex items-baseline justify-between gap-x-4">
        <Heading
          level="h2"
          className="txt-large text-[#1A952B] font-bold uppercase tracking-wide"
        >
          {title}
        </Heading>
        {href && (
          <span className="shrink-0">
            <InteractiveLink href={href}>{linkLabel}</InteractiveLink>
          </span>
        )}
      </div>
      <hr className="mt-2 h-px w-full border-0 bg-ui-border-base" />
    </div>
  )
}
