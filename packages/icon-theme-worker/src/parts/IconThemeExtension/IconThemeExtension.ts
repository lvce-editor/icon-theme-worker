export interface IconThemeContribution {
  readonly id: string
  readonly path: string
}

export interface IconThemeExtension {
  readonly disabled?: boolean
  readonly iconThemes?: readonly IconThemeContribution[]
  readonly id?: string
  readonly path?: string
  readonly uri?: string
}
