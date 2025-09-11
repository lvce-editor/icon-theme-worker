import { getFileIcon, getFolderIcon, getIcons } from '../GetIcon/GetIcon.ts'
import { loadIconThemeJson } from '../GetIconThemeJson/GetIconThemeJson.ts'
import { addLanguages } from '../Languages/Languages.ts'

export const commandMap = {
  'IconTheme.addLanguages': addLanguages,
  'IconTheme.getFileIcon': getFileIcon,
  'IconTheme.getFolderIcon': getFolderIcon,
  'IconTheme.getIcons': getIcons,
  'IconTheme.getIconThemeJson': loadIconThemeJson,
}
