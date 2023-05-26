import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai'
import { AxiosResponse } from 'axios'

export const DEFAULT_MODEL = 'gpt-3.5-turbo'
export const STRONGEST_MODEL = 'gpt-4'
export const MODELS = [DEFAULT_MODEL, STRONGEST_MODEL]
export type Model = 'gpt-4' | 'gpt-3.5-turbo';

export async function one_shot(prompt: string, model: Model = DEFAULT_MODEL, temperature = 0.4) {
  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }))

  if(process.env.NODE_ENV === 'development') {
    console.log()
    console.log('model', model)
    console.log('<prompt> ---------------')
    console.log(prompt)
    console.log('<prompt> ---------------')
    console.log()
  }

  const result = await openai.createChatCompletion({
    messages: [{ role: 'user', content: prompt }], 
    model: model,
    temperature
  })

  return top_choice(result as AxiosResponse<CreateChatCompletionResponse, any>)
}

export async function multi_shot(messages: ChatCompletionRequestMessage[], model: Model = DEFAULT_MODEL, temperature = 0.4) {
  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }))

  if(process.env.NODE_ENV === 'development') {
    console.log()
    console.log('model', model)
    console.log('<prompt> ---------------')
    messages.forEach(message => {
      console.log(`${message.role}: ${message.content}`)
    })
    console.log('<prompt> ---------------')
    console.log()
  }

  const result = await openai.createChatCompletion({
    messages,
    model: model,
    temperature
  })

  return top_choice(result as AxiosResponse<CreateChatCompletionResponse, any>)
}

export function top_choice(response: AxiosResponse<CreateChatCompletionResponse, any>) {
  if(!response.data.choices.length) throw '!choices'
  const content = response.data.choices[0].message?.content
  if(!content) throw '!content'
  return content
}

export async function moderated(user_prompt: string) {
  if(!user_prompt) return false
  try {
    const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }))
    const result = await openai.createModeration({input: user_prompt})
    return result.data.results[0].flagged
  } catch {
    return false
  }
}