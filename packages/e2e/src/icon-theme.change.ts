import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'icon-theme.change'

export const skip = true

export const test: Test = async ({ FileSystem, Workspace, Extension, IconTheme, Locator, expect, BaseUrl }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'test')
  await FileSystem.mkdir(`${tmpDir}/test-folder`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL('../fixtures/sample.icon-theme', import.meta.url).toString())

  // act
  await IconTheme.setIconTheme('test-icon-theme')

  // assert
  const iconFile = Locator('.TreeItem[aria-label="test.xyz"] .FileIcon')
  const baseUrl = BaseUrl.getBaseUrl()
  await expect(iconFile).toHaveAttribute('src', `${baseUrl}packages/extension-host-worker-tests/fixtures/sample.icon-theme/icons/default_file.svg`)
}
