import { getIcons } from '../GetIcon/GetIcon.ts'
import { loadIconThemeJson } from '../GetIconThemeJson/GetIconThemeJson.ts'

export const commandMap = {
  'IconTheme.getIcons': getIcons,
  'IconTheme.getIconThemeJson': loadIconThemeJson,
}
