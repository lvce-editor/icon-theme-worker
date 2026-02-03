export const toLowerCaseMap = (map: Readonly<Record<string, string>>): Record<string, string> => {
  return Object.fromEntries(Object.entries(map).map((entry: readonly [string, unknown]) => [entry[0].toLowerCase(), entry[1]] as const)) as Record<
    string,
    string
  >
}
