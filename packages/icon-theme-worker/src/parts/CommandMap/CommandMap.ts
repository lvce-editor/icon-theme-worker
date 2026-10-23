import { getFileIcon, getFolderIcon } from '../GetIcon/GetIcon.ts'
import { getIcons } from '../GetIcons/GetIcons.ts'
import { loadIconThemeJson } from '../GetIconThemeJson/GetIconThemeJson.ts'
import { handleMessagePort } from '../HandleMessagePort/HandleMessagePort.ts'
import { addLanguages } from '../Languages/Languages.ts'

export const commandMap = {
  'IconTheme.addLanguages': addLanguages,
  'IconTheme.getFileIcon': getFileIcon,
  'IconTheme.getFolderIcon': getFolderIcon,
  'IconTheme.getIcons': getIcons,
  'IconTheme.getIconThemeJson': loadIconThemeJson,
  'IconTheme.handleMessagePort': handleMessagePort,
}
