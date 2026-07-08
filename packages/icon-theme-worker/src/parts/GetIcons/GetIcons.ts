import { getFileIcon, getFolderIcon, getFolderIconExpanded } from '../GetIcon/GetIcon.ts'

export const getIcons = (iconRequests: readonly any[]): readonly string[] => {
  const Folder = 2
  const icons = iconRequests.map((request) => {
    if (request.type === Folder) {
      if (request.expanded) {
        return getFolderIconExpanded({ name: request.name })
      }
      return getFolderIcon({ name: request.name })
    }
    return getFileIcon({ name: request.name })
  })
  return icons
}
