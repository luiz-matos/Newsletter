import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getPostSummaries, PostSummary } from '../../services/posts'
import styles from './styles.module.scss'

interface PostsProps {
  posts: PostSummary[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Edu News</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { posts: getPostSummaries() },
  }
}
