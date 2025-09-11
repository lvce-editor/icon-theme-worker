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
  if (iconTheme.fileNames) {
    const fileNameIcon = iconTheme.fileNames[fileNameLower]
    if (fileNameIcon) {
      return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, fileNameIcon)
    }
  }
  return ''
}

const getFileIconFromFileExtensions = (iconTheme: any, fileNameLower: string): string => {
  if (iconTheme.fileExtensions) {
    let index = -1
    while ((index = fileNameLower.indexOf(Character.Dot, index + 1)) !== -1) {
      const shorterExtension = fileNameLower.slice(index + 1)
      const extensionIcon = iconTheme.fileExtensions[shorterExtension]
      if (extensionIcon) {
        return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, extensionIcon)
      }
    }
  }
  return ''
}

const getFileIconFromLanguageIds = (iconTheme: any, fileNameLower: string): string => {
  if (iconTheme.languageIds) {
    const languageId: string = Languages.getLanguageId(fileNameLower)
    const languageIcon = iconTheme.languageIds[languageId]
    if (languageId === 'jsx' && fileNameLower.endsWith('.js')) {
      const alternativeFileIcon = iconTheme.languageIds.javascript
      if (alternativeFileIcon) {
        return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, alternativeFileIcon)
      }
    }
    if (languageIcon) {
      return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, languageIcon)
    }
  }
  return ''
}

export const getFileNameIcon = (file: string): string => {
  Assert.string(file)
  const iconTheme = IconThemeState.getIconTheme()
  const fileNameLower = file.toLowerCase()
  if (!iconTheme) {
    return ''
  }
  return (
    getFileIconFromFileNames(iconTheme, fileNameLower) ||
    getFileIconFromFileExtensions(iconTheme, fileNameLower) ||
    getFileIconFromLanguageIds(iconTheme, fileNameLower) ||
    GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.File)
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
  if (!iconTheme || !iconTheme.folderNames || !iconTheme.iconDefinitions) {
    return ''
  }
  const folderNameLower = folderName.toLowerCase()
  const folderIcon = iconTheme.folderNames[folderNameLower]
  if (folderIcon) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, folderIcon)
  }
  return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.Folder)
}

export const getFolderIcon = (folder: any): string => {
  return getFolderNameIcon(folder.name)
}

const getFolderIconExpanded = (folder: any): string => {
  const iconTheme = IconThemeState.getIconTheme()
  if (!iconTheme) {
    return ''
  }
  if (!iconTheme.folderNamesExpanded) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.FolderOpen)
  }
  const folderName = iconTheme.folderNamesExpanded[folder.name.toLowerCase()]
  if (folderName) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, folderName)
  }
  return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.FolderOpen)
}

export const getIcon = (dirent: Dirent): string => {
  switch (dirent.type) {
    case DirentType.File:
    case DirentType.SymLinkFile:
      return getFileIcon(dirent)
    case DirentType.Directory:
    case DirentType.SymLinkFolder:
      return getFolderIcon(dirent)
    case DirentType.DirectoryExpanded:
      return getFolderIconExpanded(dirent)
    case DirentType.Symlink:
    case DirentType.CharacterDevice:
    case DirentType.BlockDevice:
    case DirentType.Socket:
      return GetAbsoluteIconPath.getAbsoluteIconPath(IconThemeState.getIconTheme(), DefaultIcon.File)
    default:
      Logger.warn(`unsupported type ${dirent.type}`)
      return DefaultIcon.None
  }
}

export const getIcons = (iconRequests: readonly any[]): readonly string[] => {
  const Folder = 2
  const icons = iconRequests.map((request) => {
    if (request.type === Folder) {
      return getFolderIcon({ name: request.name })
    }
    return getFileIcon({ name: request.name })
  })
  return icons
}
