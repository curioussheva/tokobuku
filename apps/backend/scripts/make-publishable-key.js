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

  // medusa exec transpiles the script, so __dirname can resolve to undefined.
  // Fall back to the repo's scripts/ directory when that happens.
  const dir = typeof __dirname === "string" && __dirname ? __dirname : "scripts"
  fs.writeFileSync(path.join(dir, "pk.txt"), String(token))
}

export const config = {
  name: "make-publishable-key",
}
