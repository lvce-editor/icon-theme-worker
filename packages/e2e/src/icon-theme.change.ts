import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'icon-theme.change'

export const test: Test = async ({ expect, Extension, FileSystem, IconTheme, Locator, Workspace }: Readonly<Parameters<typeof test>[0]>) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'test')
  await FileSystem.mkdir(`${tmpDir}/test-folder`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve('../fixtures/sample.icon-theme'))

  // act
  await IconTheme.setIconTheme('test-icon-theme')

  // assert
  const iconFile = Locator('.TreeItem[aria-label="test.xyz"] .FileIcon[src$="/sample.icon-theme/icons/default_file.svg"]')
  await expect(iconFile).toBeVisible()
}
