import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import test from 'node:test'
import * as LinkedWorkerPreferences from '@lvce-editor/shared-process/src/parts/LinkedWorkerPreferences/LinkedWorkerPreferences.js'

const root = resolve(import.meta.dirname, '../../..')

test('server links the built icon theme worker package', async () => {
  const dist = resolve(root, '.tmp/dist')
  const packageJson = JSON.parse(await readFile(join(dist, 'package.json'), 'utf8'))
  const originalArgv = process.argv

  try {
    process.argv = [...originalArgv, '--link', dist]

    assert.equal(packageJson.name, '@lvce-editor/icon-theme-worker')
    assert.equal(packageJson.main, 'dist/iconThemeWorkerMain.js')
    await assert.doesNotReject(readFile(join(dist, packageJson.main)))
    assert.deepEqual(await LinkedWorkerPreferences.getLinkedWorkerPreferences(), {
      'develop.iconThemeWorkerPath': join(dist, 'dist/iconThemeWorkerMain.js'),
    })
  } finally {
    process.argv = originalArgv
  }
})
