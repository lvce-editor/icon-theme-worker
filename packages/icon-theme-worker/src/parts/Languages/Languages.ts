import type { Language } from '../Language/Language.ts'
import * as GetFileExtension from '../GetFileExtension/GetFileExtension.ts'

const state = {
  fileNames: Object.create(null),
  languages: Object.create(null),
}

export const addLanguages = (languages: readonly Language[]): void => {
  for (const language of languages) {
    const { extensions, fileNames, id } = language
    if (extensions) {
      for (const extension of extensions) {
        state.languages[extension] = id
      }
    }
    if (fileNames) {
      for (const fileName of fileNames) {
        state.fileNames[fileName.toLowerCase()] = id
      }
    }
  }
}

export const reset = (): void => {
  state.languages = Object.create(null)
  state.fileNames = Object.create(null)
}

export const getLanguageId = (fileName: string): string => {
  const { fileNames, languages } = state
  const fileNameLower = fileName.toLowerCase()
  if (fileNameLower in fileNames) {
    return fileNames[fileNameLower]
  }
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
