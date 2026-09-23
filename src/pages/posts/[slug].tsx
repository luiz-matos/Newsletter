import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import Head from 'next/head'
import { authOptions } from '../api/auth/[...nextauth]'
import { getPost, getPostSlugs, Post as PostData } from '../../services/posts'
import styles from './post.module.scss'

interface PostProps {
  post: PostData
}

export default function Post({ post }: PostProps) {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const slug = String(params.slug)
  if (!getPostSlugs().includes(slug)) {
    return { notFound: true }
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.activeSubscription) {
    return {
      redirect: { destination: `/posts/preview/${slug}`, permanent: false },
    }
  }

  return {
    props: { post: getPost(slug) },
  }
}
