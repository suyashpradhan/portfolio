import { Container } from '@/components/Container'

export function SimpleLayout({ title, intro, children }) {
  return (
    <Container className="mt-16 sm:mt-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
          {title}
        </h1>
      </header>
      <div className="mt-12 sm:mt-12">{children}</div>
    </Container>
  )
}
