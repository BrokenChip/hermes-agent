import { describe, expect, it } from 'vitest'

import { parseCompactionOutput } from './compaction-output'

const CANONICAL = [
  'Compressed: 12 → 8 messages',
  'Approx request size: ~7,727 → ~6,903 tokens',
  'Note: fewer messages can still raise this estimate when compression rewrites the tail'
].join('\n')

describe('parseCompactionOutput', () => {
  it('reads the counts and the request-size pair', () => {
    expect(parseCompactionOutput(CANONICAL)).toEqual({ messages: '12 → 8', tokens: '~7,727 → ~6,903' })
  })

  it('keeps the counts when the token line is absent', () => {
    expect(parseCompactionOutput('Compressed: 6 → 4 messages')).toEqual({ messages: '6 → 4' })
  })

  it('reads a token line without a counts line', () => {
    expect(parseCompactionOutput('Approx request size: ~6,113 → ~5,794 tokens')).toEqual({
      tokens: '~6,113 → ~5,794'
    })
  })

  it('returns null for output this divider has no business styling', () => {
    expect(parseCompactionOutput('model → kimi-k2.6')).toBeNull()
    expect(parseCompactionOutput('')).toBeNull()
  })
})
