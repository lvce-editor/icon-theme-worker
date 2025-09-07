import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

export const getIconThemeJson = async (iconThemeId: any): Promise<any> => {
  return ExtensionHostWorker.invoke('IconTheme.getJson', iconThemeId)
}
