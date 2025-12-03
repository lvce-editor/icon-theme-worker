import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 395_000

export const instantiations = 3000

export const instantiationsPath = join(root, 'packages', 'icon-theme-worker')

export const workerPath = join(root, '.tmp/dist/dist/iconThemeWorkerMain.js')

export const playwrightPath = new URL('../../e2e/node_modules/playwright/index.mjs', import.meta.url).toString()
