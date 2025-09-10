import { getFileIcon, getFolderIcon, getIcons } from '../GetIcon/GetIcon.ts'
import { loadIconThemeJson } from '../GetIconThemeJson/GetIconThemeJson.ts'

export const commandMap = {
  'IconTheme.getFileIcon': getFileIcon,
  'IconTheme.getFolderIcon': getFolderIcon,
  'IconTheme.getIcons': getIcons,
  'IconTheme.getIconThemeJson': loadIconThemeJson,
}
