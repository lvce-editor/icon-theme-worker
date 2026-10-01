// @ts-nocheck
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))

process.argv.push(`--link=${resolve(root, '.tmp/dist')}`)

await import(pathToFileURL(resolve(root, 'node_modules/@lvce-editor/server/src/server.js')).href)
