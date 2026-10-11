// Ensures a publishable API key exists and prints only its token.
// Idempotent: reuses the first publishable key across repeated CI runs.
// The token is the last non-empty line on stdout — the CI step extracts it
// with tail, since medusa exec also logs its own progress lines there.
// Run with: pnpm exec medusa exec -- ./scripts/make-publishable-key.js
// language: JS, target: Medusa v2 backend scripts

module.exports = async function makePublishableKey({ container }) {
  const keyService = container.resolve("apiKey")

  const existing = await keyService.listApiKeys({
    type: "publishable",
  })

  // Reuse the first publishable key so repeated CI runs stay idempotent.
  const token = existing.length
    ? existing[0].token
    : (
        await keyService.createApiKeys({
          title: "storefront",
          type: "publishable",
          created_by: "ci",
        })
      ).token

  // eslint-disable-next-line no-console
  console.log(String(token))
}

export const config = {
  name: "make-publishable-key",
}
