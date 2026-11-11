/** The Desktop renders a manual `/compress` record as a divider instead of the
 *  backend's two-line report. This parses that report; anything it cannot read
 *  keeps the generic slash-status rendering, so a wording change upstream
 *  degrades to plain text instead of dropping the record. */
export interface CompactionOutput {
  /** "12 → 8" — messages before and after. */
  messages?: string
  /** "~7,727 → ~6,903" — request size before and after. */
  tokens?: string
}

const MESSAGES_RE = /Compressed:\s*(\d[\d,]*)\s*→\s*(\d[\d,]*)\s*messages/i
const TOKENS_RE = /request size:\s*(~?[\d,]+)\s*→\s*(~?[\d,]+)\s*tokens/i

export function parseCompactionOutput(output: string): CompactionOutput | null {
  const messages = output.match(MESSAGES_RE)
  const tokens = output.match(TOKENS_RE)

  if (!messages && !tokens) {
    return null
  }

  return {
    ...(messages ? { messages: `${messages[1]} → ${messages[2]}` } : {}),
    ...(tokens ? { tokens: `${tokens[1]} → ${tokens[2]}` } : {})
  }
}
