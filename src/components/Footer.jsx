import Link from 'next/link'

import { Container } from '@/components/Container'
import { Code, Heart } from '@phosphor-icons/react'

export function Footer() {
  return (
    <footer className="mt-28">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-8 pt-10 dark:border-zinc-700/40">
          <Container.Inner>
            <div className="flex flex-col items-center justify-center sm:flex-row">
              <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">
                &copy; 2023 made with <Heart className="inline " /> &{' '}
                <Code className="inline" /> by Suyash Pradhan <br />
                All rights reserved.
              </p>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  )
}
