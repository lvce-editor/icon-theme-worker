import { initializeRendererProcess } from '../InitializeRendererProcess/InitializeRendererProcess.ts'

export const initialize = async (): Promise<void> => {
  await initializeRendererProcess()
}
