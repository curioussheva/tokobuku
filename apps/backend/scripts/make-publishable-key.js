// Creates a publishable API key and prints only the token to stdout.
// Run with: pnpm exec medusa exec -- ./scripts/make-publishable-key.js
// language: JS, target: Medusa v2 backend scripts

module.exports = async function makePublishableKey({ container }) {
  const keyService = container.resolve("apiKey")

  const existing = await keyService.listApiKeys({
    type: "publishable",
  })

  if (existing.length) {
    // Reuse the first publishable key so repeated CI runs stay idempotent.
    process.stdout.write(existing[0].token)
    return
  }

  const apiKey = await keyService.createApiKeys({
    title: "storefront",
    type: "publishable",
    created_by: "ci",
  })

  process.stdout.write(apiKey.token)
}

export const config = {
  name: "make-publishable-key",
}
