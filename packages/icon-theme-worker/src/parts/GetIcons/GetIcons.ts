import { getFileIcon, getFolderIcon, getFolderIconExpanded } from '../GetIcon/GetIcon.ts'

export interface IconRequest {
  readonly expanded?: boolean
  readonly name: string
  readonly type: number
}

export const getIcons = (iconRequests: readonly IconRequest[]): readonly string[] => {
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
