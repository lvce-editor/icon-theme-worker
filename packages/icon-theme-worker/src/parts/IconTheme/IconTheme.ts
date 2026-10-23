export interface IconTheme {
  readonly fileExtensions?: Readonly<Record<string, string>>
  readonly fileNames?: Readonly<Record<string, string>>
  readonly folderNames?: Readonly<Record<string, string>>
  readonly folderNamesExpanded?: Readonly<Record<string, string>>
  readonly iconDefinitions?: Readonly<Record<string, string>>
  readonly languageIds?: Readonly<Record<string, string>>
  readonly [key: string]: unknown
}

const isStringRecord = (value: unknown): value is Readonly<Record<string, string>> => {
  return typeof value === 'object' && value !== null && Object.values(value).every((entry) => typeof entry === 'string')
}

const getProperty = (value: object, key: string): unknown => {
  return Object.getOwnPropertyDescriptor(value, key)?.value
}

export const isIconTheme = (value: unknown): value is IconTheme => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }
  for (const key of ['fileNames', 'fileExtensions', 'folderNames', 'folderNamesExpanded', 'iconDefinitions', 'languageIds']) {
    const record = getProperty(value, key)
    if (record !== undefined && !isStringRecord(record)) {
      return false
    }
  }
  return true
}

export const parseIconTheme = (value: unknown): IconTheme => {
  if (!isIconTheme(value)) {
    throw new TypeError('Invalid icon theme JSON')
  }
  return value
}
