import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import styles from './styles.module.scss'

export function SubscribeButton() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    if (session.activeSubscription) {
      router.push('/posts')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/subscribe', { method: 'POST' })
      if (!response.ok) throw new Error(`Status ${response.status}`)

      const { url } = await response.json()
      window.location.assign(url)
    } catch {
      alert('Não foi possível iniciar a assinatura. Tente de novo em instantes.')
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
      disabled={isLoading}
    >
      {isLoading ? 'Aguarde...' : 'Inscreva-se'}
    </button>
  )
}
