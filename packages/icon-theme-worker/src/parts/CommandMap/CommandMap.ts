import { getFileIcon, getFolderIcon, getIcons } from '../GetIcon/GetIcon.ts'
import { getIconThemeJson } from '../GetIconThemeJson/GetIconThemeJson.ts'

export const commandMap = {
  'IconTheme.getIcons': getIcons,
  'IconTheme.getFileIcon': getFileIcon,
  'IconTheme.getFolderIcon': getFolderIcon,
  'IconTheme.getIconThemeJson': getIconThemeJson,
}
