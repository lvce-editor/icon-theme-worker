import { DirentType } from '@lvce-editor/constants'
import type { Dirent } from '../Dirent/Dirent.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'
import * as DefaultIcon from '../DefaultIcon/DefaultIcon.ts'
import * as GetAbsoluteIconPath from '../GetAbsoluteIconPath/GetAbsoluteIconPath.ts'
import * as IconThemeState from '../IconThemeState/IconThemeState.ts'
import * as Languages from '../Languages/Languages.ts'
import * as Logger from '../Logger/Logger.ts'

const getFileIconFromFileNames = (iconTheme: any, fileNameLower: string): string => {
  const baseUrl = IconThemeState.getExtensionBaseUrl()

  if (iconTheme.fileNames) {
    const fileNameIcon = iconTheme.fileNames[fileNameLower]
    if (fileNameIcon) {
      return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, fileNameIcon, baseUrl)
    }
  }
  return ''
}

const getFileIconFromFileExtensions = (iconTheme: any, fileNameLower: string): string => {
  const baseUrl = IconThemeState.getExtensionBaseUrl()
  if (iconTheme.fileExtensions) {
    let index = -1
    while ((index = fileNameLower.indexOf(Character.Dot, index + 1)) !== -1) {
      const shorterExtension = fileNameLower.slice(index + 1)
      const extensionIcon = iconTheme.fileExtensions[shorterExtension]
      if (extensionIcon) {
        return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, extensionIcon, baseUrl)
      }
    }
  }
  return ''
}

const getFileIconFromLanguageIds = (iconTheme: any, fileNameLower: string): string => {
  const baseUrl = IconThemeState.getExtensionBaseUrl()
  if (iconTheme.languageIds) {
    const languageId: string = Languages.getLanguageId(fileNameLower)
    const languageIcon = iconTheme.languageIds[languageId]
    if (languageId === 'jsx' && fileNameLower.endsWith('.js')) {
      const alternativeFileIcon = iconTheme.languageIds.javascript
      if (alternativeFileIcon) {
        return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, alternativeFileIcon, baseUrl)
      }
    }
    if (languageIcon) {
      return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, languageIcon, baseUrl)
    }
  }
  return ''
}

export const getFileNameIcon = (file: string): string => {
  Assert.string(file)
  const baseUrl = IconThemeState.getExtensionBaseUrl()

  const iconTheme = IconThemeState.getIconTheme()
  const fileNameLower = file.toLowerCase()
  if (!iconTheme) {
    return ''
  }
  return (
    getFileIconFromFileNames(iconTheme, fileNameLower) ||
    getFileIconFromFileExtensions(iconTheme, fileNameLower) ||
    getFileIconFromLanguageIds(iconTheme, fileNameLower) ||
    GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.File, baseUrl)
  )
}

export const getFileIcon = (file: any): string => {
  return getFileNameIcon(file.name)
}

export const getFileIcons = (fileNames: readonly any[]): readonly string[] => {
  const icons = []
  for (const fileName of fileNames) {
    icons.push(getFileIcon(fileName))
  }
  return icons
}

export const getFolderNameIcon = (folderName: string): string => {
  const iconTheme = IconThemeState.getIconTheme()
  if (!iconTheme || !iconTheme.iconDefinitions) {
    return ''
  }
  const baseUrl = IconThemeState.getExtensionBaseUrl()
  const { folderNames, iconDefinitions } = iconTheme
  if (folderNames) {
    const folderNameLower = folderName.toLowerCase()
    const folderIcon = folderNames[folderNameLower]
    if (folderIcon) {
      return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, folderIcon, baseUrl)
    }
  }
  if (iconDefinitions[DefaultIcon.Folder]) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.Folder, baseUrl)
  }
  return ''
}

export const getFolderIcon = (folder: any): string => {
  return getFolderNameIcon(folder.name)
}

const getFolderIconExpanded = (folder: any): string => {
  const baseUrl = IconThemeState.getExtensionBaseUrl()

  const iconTheme = IconThemeState.getIconTheme()
  if (!iconTheme) {
    return ''
  }
  if (!iconTheme.folderNamesExpanded) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.FolderOpen, baseUrl)
  }
  const folderName = iconTheme.folderNamesExpanded[folder.name.toLowerCase()]
  if (folderName) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, folderName, baseUrl)
  }
  return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.FolderOpen, baseUrl)
}

export const getIcon = (dirent: Dirent): string => {
  const baseUrl = IconThemeState.getExtensionBaseUrl()

  switch (dirent.type) {
    case DirentType.BlockDevice:
    case DirentType.CharacterDevice:
    case DirentType.Socket:
    case DirentType.Symlink:
      return GetAbsoluteIconPath.getAbsoluteIconPath(IconThemeState.getIconTheme(), DefaultIcon.File, baseUrl)
    case DirentType.Directory:
    case DirentType.SymLinkFolder:
      return getFolderIcon(dirent)
    case DirentType.DirectoryExpanded:
      return getFolderIconExpanded(dirent)
    case DirentType.File:
    case DirentType.SymLinkFile:
      return getFileIcon(dirent)
    default:
      Logger.warn(`unsupported type ${dirent.type}`)
      return DefaultIcon.None
  }
}
