import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked, Tokens } from 'marked'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const PREVIEW_BLOCKS = 3

export interface PostSummary {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

export interface Post {
  slug: string
  title: string
  content: string
  updatedAt: string
}

function readPost(slug: string) {
  const file = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), 'utf-8')
  const { data, content } = matter(file)
  return {
    title: String(data.title),
    date: new Date(data.date),
    content,
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// Blocos de texto (parágrafos, listas, código), sem as linhas em branco
function blocksOf(markdown: string) {
  return marked.lexer(markdown).filter((token) => token.type !== 'space')
}

export function getPostSlugs() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

export function getPostSummaries(): PostSummary[] {
  return getPostSlugs()
    .map((slug) => ({ slug, ...readPost(slug) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ slug, title, date, content }) => {
      const firstParagraph = blocksOf(content).find(
        (token): token is Tokens.Paragraph => token.type === 'paragraph',
      )
      return {
        slug,
        title,
        excerpt: firstParagraph?.text ?? '',
        updatedAt: formatDate(date),
      }
    })
}

export function getPost(slug: string, { preview = false } = {}): Post {
  const { title, date, content } = readPost(slug)
  const blocks = preview ? blocksOf(content).slice(0, PREVIEW_BLOCKS) : blocksOf(content)

  return {
    slug,
    title,
    content: marked.parser(blocks) as string,
    updatedAt: formatDate(date),
  }
}
