export const getAbsoluteIconPath = (iconTheme: any, icon: string, baseUrl: string): string => {
  if (!iconTheme) {
    return ''
  }
  const result = iconTheme.iconDefinitions[icon]
  if (result && baseUrl) {
    return `${baseUrl}${result}`
  }
  return ''
}
