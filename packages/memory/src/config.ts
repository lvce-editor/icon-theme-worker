import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 405_000

export const instantiations = 3500

export const instantiationsPath = join(root, 'packages', 'icon-theme-worker')

export const workerPath = join(root, '.tmp/dist/dist/iconThemeWorkerMain.js')

export const playwrightPath = new URL('../../e2e/node_modules/playwright/index.mjs', import.meta.url).toString()
