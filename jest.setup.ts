// nanoid isn't compatible with jest
// so we mock it here
// https://github.com/ai/nanoid/issues/395#issuecomment-1458166963
jest.mock('nanoid', () => { return {
  nanoid : () => '0123456789'
} })