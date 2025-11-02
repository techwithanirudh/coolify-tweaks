import { corePrompt } from './core'
import { examplesPrompt } from './examples'
import { llmsPrompt } from './llms'
import { toolsPrompt } from './tools'

export const systemPrompt = ({ llms }: { llms: string }) => {
  return [corePrompt, toolsPrompt, llmsPrompt(llms), examplesPrompt]
    .join('\n\n')
    .trim()
}
