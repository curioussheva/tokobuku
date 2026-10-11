// Home hero: the Qaf Elementor block is a top spacer, then a 3-column pillar
// row (icon + title + body), then a full-width reseller CTA banner. No big
// banner image on the live page, so this stays typographic. Order and copy
// follow the scraped source.
// language: TSX
import { Heading, Text } from "@modules/common/components/ui"

const PILLARS = [
  {
    icon: "star-and-crescent",
    title: "Mozaik Islam",
    body: "Mempersembahkan berbagai pengetahuan dan pemikiran Islam yang mencerahkan dan bertanggung jawab. Mulai dari buku referensial, tuntunan praktis, hingga kisah-kisah teladan. Memadukan kekuatan cerita dengan kelugasan ulasan.",
  },
  {
    icon: "book-open",
    title: "Kitab Kuning",
    body: "Membantu pembaca masa kini agar turut menikmati kekayaan ilmu dan kearifan ulama klasik yang dapat disambungkan dan disumbangkan untuk kemajuan peradaban Islam modern.",
  },
  {
    icon: "graduation-cap",
    title: "Qaf Academy",
    body: "Menggali ragam gagasan alternatif dan karya akademik dari intelektual-ulama Tanah Air serta menyebarkannya lewat buku, diskusi, pelatihan, dan wahana lain yang relevan.",
  },
] as const

export default function Hero() {
  return (
    <div className="w-full bg-cream">
      <div className="content-container flex flex-col items-center pt-8 small:pt-14 pb-10 small:pb-16">
        <Heading
          level="h1"
          className="font-serif text-3xl small:text-4xl leading-tight text-center text-marun max-w-2xl"
        >
          Buku bermutu, ulasan yang cerdas dan mencerahkan.
        </Heading>
        <Text className="mt-4 max-w-xl text-center text-ui-fg-subtle txt-medium">
          Asyik &amp; mendidik. Sebuah jendela menuju khazanah keilmuan Islam,
          dari yang klasik hingga yang kontemporer.
        </Text>
      </div>

      <div className="content-container grid grid-cols-1 small:grid-cols-3 gap-x-10 gap-y-10 small:gap-y-0 pb-12 small:pb-20">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="flex flex-col items-center text-center gap-y-3 px-2"
          >
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-soft/50 text-gold"
            >
              <PillarIcon name={p.icon} />
            </span>
            <Heading level="h2" className="txt-large font-bold text-marun">
              {p.title}
            </Heading>
            <Text className="txt-compact text-ui-fg-subtle leading-relaxed">
              {p.body}
            </Text>
          </div>
        ))}
      </div>

      <ResellerBanner />
    </div>
  )
}

function ResellerBanner() {
  return (
    <div className="content-container pb-12 small:pb-16">
      <div className="relative overflow-hidden rounded-large bg-marun px-6 small:px-10 py-8 small:py-10 text-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-y-4">
          <Heading level="h2" className="txt-xlarge text-white">
            Gabung jadi reseller Qaf, yuk!
          </Heading>
          <Text className="max-w-xl txt-compact text-white/85">
            Utamakan niatmu berjualan untuk menyebarkan pengetahuan dan
            kemanfaatan. InsyaAllah cuan ikutan dan berkah.
          </Text>
          <a
            href="#reseller"
            className="inline-flex items-center justify-center rounded-soft bg-white px-6 py-2.5 txt-compact-medium text-marun transition-opacity hover:opacity-90"
          >
            Klik di Sini
          </a>
        </div>
      </div>
    </div>
  )
}

function PillarIcon({ name }: { name: "star-and-crescent" | "book-open" | "graduation-cap" }) {
  const common = "h-5 w-5"

  if (name === "book-open") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5.5C10.5 4.2 8.4 3.8 5.5 4.2 4.7 4.3 4 5 4 5.8v10.6c0 .6.6 1.1 1.2 1 2.6-.3 4.4.1 5.8 1.2.5.4 1.3.4 1.8 0 1.4-1.1 3.2-1.5 5.8-1.2.6.1 1.2-.4 1.2-1V5.8c0-.8-.7-1.5-1.5-1.6-2.9-.4-5 0-6.3 1.3Z" />
        <path d="M12 5.5v13" />
      </svg>
    )
  }

  if (name === "graduation-cap") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" />
        <path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11" />
        <path d="M21.5 9v5" />
      </svg>
    )
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 12.5a5.5 5.5 0 1 1-7.6-5.1 4.3 4.3 0 1 0 7.6 5.1Z" />
    </svg>
  )
}
