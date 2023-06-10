import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import Image from 'next/image'
import avatarImage from '@/images/profile.jpeg'
import { Container } from './Container'

function Avatar({ large = false, className, ...props }) {
  return (
    <Link
      href="/"
      aria-label="Home"
      className={clsx(className, 'pointer-events-auto')}
      {...props}
    >
      <Image
        src={avatarImage}
        alt="Profile"
        sizes={large ? '4rem' : '2.25rem'}
        className={clsx(
          'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
          large ? 'h-16 w-16' : 'h-9 w-9'
        )}
        priority
      />
    </Link>
  )
}

function NavItem({ href, children }) {
  let isActive = useRouter().pathname === href

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'relative block px-3 py-2 transition',
          isActive
            ? 'text-blue-700 dark:text-blue-600'
            : 'hover:text-blue-700 dark:hover:text-blue-600'
        )}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0" />
        )}
      </Link>
    </li>
  )
}

function Navigation(props) {
  return (
    <nav {...props}>
      <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <NavItem href="/about">about</NavItem>
        <NavItem href="https://suyashpradhan.hashnode.dev">blog</NavItem>
        <NavItem href="/projects">projects</NavItem>
      </ul>
    </nav>
  )
}

export function Header() {
  return (
    <>
      <Container className="mt-10">
        <div className="flex w-full items-center">
          <Avatar large className="block h-16 w-16 origin-left" />
          <Navigation className="pointer-events-auto " />
        </div>
      </Container>
    </>
  )
}
