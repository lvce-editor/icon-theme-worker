import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.icon-theme-error-invalid-json'

export const test: Test = async ({ Extension, FileSystem, IconTheme, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'test')
  await FileSystem.mkdir(`${tmpDir}/test-folder`)
  await Workspace.setUri(tmpDir)
  await Extension.addWebExtension(new URL('../fixtures/sample.icon-theme-error-invalid-json', import.meta.url).href)

  // act
  await IconTheme.setIconTheme('test-icon-theme')

  // assert
  // TODO check that warning message is printed to console
  // warning message should contain babel code frame with json error
}
