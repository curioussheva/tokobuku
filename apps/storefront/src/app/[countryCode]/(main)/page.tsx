import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import ProductSection from "@modules/home/components/product-section"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Penerbit Qaf — Toko Buku Online",
  description:
    "Buku-buku keislaman bermutu: kitab kuning, studi Quran, smart muslimah, fiqih, kisah islami, motivasi, dan biografi tokoh.",
}

// Map Qaf product-category sections to collections by handle.
// Dummy handles below match the seeded collections; swap to real handles when
// the backend catalogue is imported.
const SECTION_HANDLES: { title: string; handle: string; href: string }[] = [
  { title: "Terbaru", handle: "terbaru", href: "/collections/terbaru" },
  { title: "Kitab Kuning", handle: "kitab-kuning", href: "/collections/kitab-kuning" },
  { title: "Studi Quran", handle: "studi-quran", href: "/collections/studi-quran" },
  { title: "Smart Muslimah", handle: "smart-muslimah", href: "/collections/smart-muslimah" },
  { title: "Fiqih / Hukum Islam", handle: "fiqih-hukum-islam", href: "/collections/fiqih-hukum-islam" },
  { title: "Kisah Islami", handle: "kisah-islami", href: "/collections/kisah-islami" },
]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  const byHandle = new Map(collections.map((c) => [c.handle, c]))

  return (
    <>
      <Hero />
      {SECTION_HANDLES.map(({ title, handle, href }) => {
        const collection = byHandle.get(handle)

        // Sections without a matching collection are skipped rather than
        // rendered empty — dummy data lands when the backend is seeded.
        if (!collection) {
          return null
        }

        return (
          <ProductSection
            key={collection.id}
            id={collection.id}
            title={title}
            href={href}
            region={region}
          />
        )
      })}
    </>
  )
}
