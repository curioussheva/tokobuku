// Creates a publishable API key and writes only the token to ./pk.txt next to
// this script. Writing to a file (not stdout) keeps CI step output clean,
// because medusa exec logs its own progress lines on stdout.
// Run with: pnpm exec medusa exec -- ./scripts/make-publishable-key.js
// language: JS, target: Medusa v2 backend scripts

const fs = require("fs")
const path = require("path")

module.exports = async function makePublishableKey({ container }) {
  const keyService = container.resolve("apiKey")

  const existing = await keyService.listApiKeys({
    type: "publishable",
  })

  // Reuse the first publishable key so repeated CI runs stay idempotent.
  const token = existing.length ? existing[0].token : (
    await keyService.createApiKeys({
      title: "storefront",
      type: "publishable",
      created_by: "ci",
    })
  ).token

  fs.writeFileSync(path.join(__dirname, "pk.txt"), token)
}

export const config = {
  name: "make-publishable-key",
}
