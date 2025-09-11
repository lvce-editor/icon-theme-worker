export interface Language {
  readonly extensionPath: string
  readonly extensions?: readonly string[]
  readonly id: string
  readonly tokenize: string
}
