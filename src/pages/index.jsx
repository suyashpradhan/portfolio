import Head from 'next/head'
import { Container } from '@/components/Container'
import { TwitterIcon, GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'

import { MapPin, Suitcase } from '@phosphor-icons/react'
import { SocialLink } from '@/components/Icons'
import { ProjectCard } from './projects'

export default function Home() {
  return (
    <>
      <Head>
        <title>Suyash Pradhan - Frontend Developer and sports enthusiast</title>
        <meta name="description" content="I’m Suyash" />
      </Head>
      <Container className="mt-10">
        <div className="max-w-3xl">
          <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            frontend developer and sports enthusiast.
          </h1>
        </div>
        <div className="max-w-2xl">
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I’m Suyash Pradhan, a multi-disciplinary frontend developer,
            passionately designing & building web-apps from concept to launch,
            for over 5 years.
          </p>

          <ul className="mt-4">
            <li className="my-1 text-base text-zinc-800 dark:text-zinc-200">
              <Suitcase className="inline" /> frontend developer @ Bureau, Inc
            </li>
            <li className="my-1 text-base text-zinc-600 dark:text-zinc-200">
              <MapPin className="inline" /> bengaluru, India
            </li>
          </ul>
          <div className="mt-4 flex gap-6 ">
            <SocialLink
              href="https://github.com/suyashpradhan"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://linkedin.com/in/suyashpradhan9"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
            <SocialLink
              href="https://twitter.com/suyashpradhan9"
              aria-label="Follow on Twitter"
              icon={TwitterIcon}
            />
          </div>
        </div>
      </Container>
      {/* <Photos /> */}

      <ProjectCard />
    </>
  )
}
