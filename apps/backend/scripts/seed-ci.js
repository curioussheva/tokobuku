// CI build-time seed: provisions the minimum the storefront needs to render
// statically — store, sales channel, publishable key linked to that channel,
// region, and one dummy product. Runs before `next build`.
// Run with: pnpm exec medusa exec ./scripts/seed-ci.js
// language: JS (ESM — medusa exec loads this through ts-node/ESM), Medusa v2

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

  const { result: salesChannels } = await createSalesChannelsWorkflow(
    container
  ).run({
    input: {
      sales_channels: [{ name: "Default channel" }],
    },
  })
  const defaultChannel = salesChannels[0]

  const { result: apiKeys } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [{ title: "storefront", type: "publishable" }],
    },
  })
  const publishableApiKey = apiKeys[0]

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      api_key_ids: [publishableApiKey.id],
      sales_channel_ids: [defaultChannel.id],
    },
  })

  const { result: stores } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "QF Pustaka",
          default_sales_channel_id: defaultChannel.id,
          supported_currencies: [{ currency_code: "idr", is_default: true }],
        },
      ],
    },
  })
  const store = stores[0]

  const { result: regions } = await createRegionsWorkflow(container).run({
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
  const region = regions[0]

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Buku Contoh",
          status: "published",
          description: "Produk dummy untuk build CI",
          handle: "buku-contoh",
          variants: [
            {
              title: "Default",
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
