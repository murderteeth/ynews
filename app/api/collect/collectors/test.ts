import { nanoid } from 'nanoid'
import { Collector } from '../route'

export default {
  async collect() {
    const ids = Array.from({ length: 2 }, () => nanoid())
    const articleUrls = ids.map(id => `https://test.test.test/${id}`)
    return articleUrls
  }
} as Collector