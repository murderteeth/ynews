import { nanoid } from 'nanoid'
import { Collector } from '../route'

export default class TestCollector implements Collector {
  // for test, generate test urls with random ids
  // for real collectors, you would poll a source for new articles
  async collect() {
    const ids = Array.from({ length: 2 }, () => nanoid())
    const articleUrls = ids.map(id => `https://test.test.test/${id}`)
    return articleUrls
  }
}