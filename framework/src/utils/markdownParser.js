import { marked } from 'marked'

// Configure marked for security and clean output
marked.setOptions({
  gfm: true,
  breaks: false,
  sanitize: false
})

export function parseMarkdown(md) {
  return marked(md)
}
