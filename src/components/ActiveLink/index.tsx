import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactNode
  activeClassName: string
}

export function ActiveLink({ children, activeClassName, ...props }: ActiveLinkProps) {
  const { asPath } = useRouter()
  const href = String(props.href)
  const isActive = href === '/' ? asPath === '/' : asPath.startsWith(href)

  return (
    <Link {...props} className={isActive ? activeClassName : undefined}>
      {children}
    </Link>
  )
}
