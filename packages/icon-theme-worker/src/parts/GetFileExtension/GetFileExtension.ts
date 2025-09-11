import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'

export const getFileExtensionIndex = (file: string): number => {
  Assert.string(file)
  return file.lastIndexOf(Character.Dot)
}

export const getNthFileExtension = (file: string, startIndex: number): number => {
  return file.lastIndexOf(Character.Dot, startIndex)
}
