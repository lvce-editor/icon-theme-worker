import { measureMemory } from '@lvce-editor/measure-memory'
import { instantiations, instantiationsPath, playwrightPath, threshold, workerPath } from './measureMemoryConfig.ts'

const main = async () => {
  await measureMemory({
    playwrightPath,
    workerPath,
    threshold,
    instantiations,
    instantiationsPath,
  })
}

main()
