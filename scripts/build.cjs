const fs = require('node:fs')
const path = require('node:path')

// This legacy repository contains the built frontend, not its React sources.
// Validate its asset references, then assemble a deployable Node application.
const html = fs.readFileSync('dist/index.html', 'utf8')
const assets = [...html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)].map(match => match[1])
if (!assets.some(asset => asset.endsWith('.js'))) throw new Error('Missing frontend bundle')
for (const asset of assets) {
  if (!fs.existsSync(path.join('dist', asset))) throw new Error(`Missing frontend asset: ${asset}`)
}
fs.mkdirSync('release', { recursive: true })
for (const file of ['app.js', 'index.js', 'package.json', 'package-lock.json', 'dist']) {
  fs.cpSync(file, path.join('release', file), { recursive: true })
}
console.log('Validated frontend assets and assembled application in release/')
