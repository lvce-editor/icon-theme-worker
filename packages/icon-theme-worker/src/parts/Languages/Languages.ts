import * as GetFileExtension from '../GetFileExtension/GetFileExtension.ts'

const state = {
  languages: Object.create(null),
}

export const addLanguages = (languages: readonly any[]): void => {
  for (const language of languages) {
    const { id, extensions } = language
    if (extensions) {
      for (const extension of extensions) {
        state.languages[extension] = id
      }
    }
  }
}

export const getLanguageId = (fileName: string): string => {
  const { languages } = state
  const extensionIndex = GetFileExtension.getFileExtensionIndex(fileName)
  const extension = fileName.slice(extensionIndex)
  const extensionLower = extension.toLowerCase()
  if (extensionLower in languages) {
    return languages[extensionLower]
  }
  const secondExtensionIndex = GetFileExtension.getNthFileExtension(fileName, extensionIndex - 1)
  const secondExtension = fileName.slice(secondExtensionIndex)
  if (secondExtensionIndex !== -1 && secondExtension in languages) {
    return languages[secondExtension]
  }
  return ''
}
