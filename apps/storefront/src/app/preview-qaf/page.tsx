// Dummy preview page — renders the Qaf-cloned theme with static data so it can
// be eyeballed without the Medusa backend running. Not wired to real collections.
// language: TSX, route: /preview-qaf
import Hero from "@modules/home/components/hero"
import ProductSectionPreview from "@modules/home/components/product-section/preview"
import SectionHeading from "@modules/common/components/section-heading"

const DUMMY_SECTIONS = [
  {
    title: "Terbaru",
    handle: "terbaru",
    products: [
      { title: "Tanya Jawab Keislaman", original: 144000, current: 122000, img: "/books/perempuan-yang-menangis.png" },
      { title: "Al-Qur'an & Kebahagiaan", original: 60000, current: 54000, img: "/books/the-miracle-of-endorphin.png" },
      { title: "Robohnya Khilafah Utsmani", original: 155000, current: 139500, img: "/books/psikologi-wanita.png" },
      { title: "Teori Kacang", original: 90000, current: 81000, img: "/books/the-power-of-now.png" },
    ],
  },
  {
    title: "Kitab Kuning",
    handle: "kitab-kuning",
    products: [
      { title: "Seni Menyucikan Jiwa", original: 70000, current: 63000, img: "/books/mau-minum-obat-seumur-hidup.png" },
      { title: "Seni Mengingat Allah", original: 70000, current: 63000, img: "/books/geni-jora.png" },
      { title: "Seni Berserah", original: 97000, current: 87300, img: "/books/perempuan-yang-menangis.png" },
      { title: "Ngaji Diri Bersama Al-Ghazali", original: 99000, current: 89100, img: "/books/psikologi-wanita.png" },
    ],
  },
  {
    title: "Studi Quran",
    handle: "studi-quran",
    products: [
      { title: "Al-Qur'an & Kebahagiaan", original: 60000, current: 54000, img: "/books/the-miracle-of-endorphin.png" },
      { title: "Living with the Qur'an", original: 80000, current: 72000, img: "/books/the-power-of-now.png" },
      { title: "Khasiat Ayat-Ayat Al-Qur'an", original: 60000, current: 54000, img: "/books/geni-jora.png" },
      { title: "Mutiara Al-Ikhlas", original: 60000, current: 54000, img: "/books/mau-minum-obat-seumur-hidup.png" },
    ],
  },
] as const

export const metadata = {
  title: "Preview Tema Qaf — Tokobuku",
}

export default function PreviewQafPage() {
  return (
    <div className="min-h-screen bg-cream pb-24">
      <Hero />
      {DUMMY_SECTIONS.map((section) => (
        <section
          key={section.handle}
          className="pt-10 small:pt-14 pb-12 small:pb-20"
        >
          <SectionHeading
            title={section.title}
            href={`/collections/${section.handle}`}
          />
          <div className="content-container">
            <ul className="mt-8 grid grid-cols-2 small:grid-cols-4 gap-x-4 small:gap-x-6 gap-y-10 small:gap-y-14">
              {section.products.map((p) => (
                <li key={p.title}>
                  <ProductSectionPreview
                    title={p.title}
                    original={p.original}
                    current={p.current}
                    img={p.img}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  )
}
