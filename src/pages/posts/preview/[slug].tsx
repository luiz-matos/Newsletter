import { useEffect } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPost, getPostSlugs, Post } from '../../../services/posts'
import styles from '../post.module.scss'

interface PostPreviewProps {
  post: Post
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession()
  const router = useRouter()

  // A prévia é estática; quem já assina segue para o post completo
  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session, router, post.slug])

  return (
    <>
      <Head>
        <title>{`${post.title} | Edu News`}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Quer continuar lendo?
            <Link href="/">Assine agora</Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getPostSlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: { post: getPost(String(params.slug), { preview: true }) },
    revalidate: 60 * 60, // 1 hora
  }
}
