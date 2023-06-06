import TestCollector from './test'

describe('test collector', () => {
  it('returns 2 test urls', async () => {
    const collector = new TestCollector()
    const result = await collector.collect()
    expect(result.length).toBe(2)
    expect(result[0]).toBe('https://test.test.test/0123456789')
    expect(result[1]).toBe('https://test.test.test/0123456789')
  })
})