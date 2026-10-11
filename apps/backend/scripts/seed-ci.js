// CI build-time seed: provisions the minimum the storefront needs to render
// statically — store, sales channel, publishable key linked to that channel,
// region, and one dummy product. Runs before `next build`.
// Run with: pnpm exec medusa exec ./scripts/seed-ci.js
// language: JS (ESM — medusa exec loads this through ts-node/ESM), Medusa v2
// Input shapes mirror src/migration-scripts/initial-data-seed.ts.

import {
  createApiKeysWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createStoresWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedCi({ container }) {
  const logger = container.resolve("logger")

  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Default Sales Channel",
          description: "Created for CI build",
        },
      ],
    },
  })

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "CI Publishable API Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  })

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  })

  const {
    result: [store],
  } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "QF Pustaka",
          supported_currencies: [
            { currency_code: "idr", is_default: true },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  })

  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Indonesia",
          currency_code: "idr",
          countries: ["id"],
          payment_providers: [],
          is_automatic: false,
        },
      ],
    },
  })
  const region = regionResult[0]

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Buku Contoh",
          status: "published",
          description: "Produk dummy untuk build CI",
          handle: "buku-contoh",
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              options: { Default: "Default" },
              prices: [{ amount: 99000, currency_code: "idr" }],
            },
          ],
        },
      ],
    },
  })

  logger.info(
    `CI seed complete: store=${store.id} region=${region.id} key=${publishableApiKey.token}`
  )
  // Last line of stdout is parsed by the CI workflow.
  console.log(publishableApiKey.token)
}

export const config = {
  name: "seed-ci",
}
