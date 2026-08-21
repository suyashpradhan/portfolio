"use client";

/* eslint-disable @next/next/no-img-element -- supplied clay artwork is pre-sized, pre-compressed, and served with responsive srcsets. */

import {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { projects } from "./projects";

type Theme = "light" | "dark";
type Tone = "tap" | "toggle" | "shift";

const toneConfig: Record<Tone, { frequency: number; duration: number; gain: number }> = {
  tap: { frequency: 132, duration: 0.055, gain: 0.024 },
  toggle: { frequency: 218, duration: 0.075, gain: 0.02 },
  shift: { frequency: 168, duration: 0.045, gain: 0.012 },
};

function WaveIcon({ active }: { active: boolean }) {
  return (
    <span className={`wave-icon ${active ? "is-active" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function ResponsiveClayImage({
  image,
  imageSmall,
  alt,
  className,
  loading = "lazy",
}: {
  image: string;
  imageSmall: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  return (
    <img
      className={className}
      src={image}
      srcSet={`${imageSmall} 720w, ${image} 1448w`}
      sizes="(max-width: 820px) 92vw, 70vw"
      alt={alt}
      width="1448"
      height="1086"
      loading={loading}
      decoding="async"
    />
  );
}

export default function Portfolio() {
  const [theme, setTheme] = useState<Theme>("light");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [heroReaction, setHeroReaction] = useState("The desk is awake.");
  const [aboutMode, setAboutMode] = useState("build");
  const projectsRef = useRef<HTMLElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(false);
  const activeProjectRef = useRef(0);
  const lastProjectRef = useRef(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const activeTheme = document.documentElement.dataset.theme as Theme | undefined;
      setTheme(activeTheme === "dark" ? "dark" : "light");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  const playTone = useCallback((tone: Tone, force = false) => {
    if (!soundRef.current && !force) return;

    const AudioContextConstructor = window.AudioContext;
    if (!audioRef.current) audioRef.current = new AudioContextConstructor();

    const context = audioRef.current;
    if (context.state === "suspended") void context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const config = toneConfig[tone];
    const now = context.currentTime;

    oscillator.type = tone === "tap" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(config.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(config.frequency * 0.72, now + config.duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(config.gain, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + config.duration + 0.01);
  }, []);

  useEffect(() => {
    const section = projectsRef.current;
    if (!section) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.matchMedia("(max-width: 820px)").matches) return;
        const rect = section.getBoundingClientRect();
        const range = Math.max(section.offsetHeight - window.innerHeight, 1);
        const progress = Math.min(1, Math.max(0, -rect.top / range));
        const nextIndex = Math.min(
          projects.length - 1,
          Math.floor(progress * projects.length),
        );
        if (nextIndex !== activeProjectRef.current) {
          activeProjectRef.current = nextIndex;
          setActiveProject(nextIndex);
        }
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (activeProject !== lastProjectRef.current) {
      playTone("shift");
      lastProjectRef.current = activeProject;
    }
  }, [activeProject, playTone]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7%" },
    );

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.92) {
        item.classList.add("is-visible");
      } else {
        observer.observe(item);
      }
    });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  const changeTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("suyash-theme", nextTheme);
    playTone("toggle");
  };

  const changeSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    soundRef.current = nextSound;
    playTone("toggle", nextSound);
  };

  const scrollToProject = (index: number) => {
    const section = projectsRef.current;
    if (!section) return;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const range = Math.max(section.offsetHeight - window.innerHeight, 1);
    const destination = sectionTop + range * (index / Math.max(projects.length - 1, 1));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: destination, behavior: reducedMotion ? "auto" : "smooth" });
    playTone("tap");
  };

  const moveHero = (event: ReactMouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--hero-x", `${x * 7}px`);
    event.currentTarget.style.setProperty("--hero-y", `${y * 6}px`);
    event.currentTarget.style.setProperty("--hero-rx", `${y * -0.9}deg`);
    event.currentTarget.style.setProperty("--hero-ry", `${x * 1.3}deg`);
    event.currentTarget.style.setProperty("--light-x", `${(x + 0.5) * 100}%`);
    event.currentTarget.style.setProperty("--light-y", `${(y + 0.5) * 100}%`);
  };

  const resetHero = (event: ReactMouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--hero-x", "0px");
    event.currentTarget.style.setProperty("--hero-y", "0px");
    event.currentTarget.style.setProperty("--hero-rx", "0deg");
    event.currentTarget.style.setProperty("--hero-ry", "0deg");
  };

  const reactToProp = (reaction: string) => {
    setHeroReaction(reaction);
    playTone("tap");
  };

  return (
    <main id="top">
      <a className="skip-link" href="#projects">
        Skip to projects
      </a>

      <header className="site-header" aria-label="Primary navigation">
        <a className="brand-mark" href="#top" aria-label="Suyash Pradhan, back to top">
          <span aria-hidden="true">S</span>
          <b>Suyash Pradhan</b>
        </a>

        <nav className="desktop-nav" aria-label="Main links">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#now">Now</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-controls">
          <button
            className="clay-toggle theme-toggle"
            type="button"
            onClick={changeTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
          >
            <span className="toggle-track" aria-hidden="true">
              <i className="toggle-bead">{theme === "light" ? "☀" : "☾"}</i>
            </span>
          </button>
          <button
            className="sound-toggle clay-icon-button"
            type="button"
            onClick={changeSound}
            aria-label={`${soundEnabled ? "Turn off" : "Turn on"} interaction sounds`}
            aria-pressed={soundEnabled}
          >
            <WaveIcon active={soundEnabled} />
          </button>
        </div>
      </header>

      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hand-note hero-note">Hey! I’m</p>
          <h1 id="hero-title">
            Suyash
            <br />
            Pradhan<span>.</span>
          </h1>
          <p className="hero-statement">
            I turn messy product problems into useful, delightful software.
          </p>
          <p className="hero-role">
            Product engineer building thoughtful web, mobile and AI-native products.
          </p>
          <div className="hero-actions">
            <a className="clay-button primary" href="#projects" onPointerDown={() => playTone("tap")}>
              Explore my work <span aria-hidden="true">↓</span>
            </a>
            <span className="tiny-copy">Made with code, curiosity and imaginary clay.</span>
          </div>
        </div>

        <figure
          className="hero-clay-stage"
          onMouseMove={moveHero}
          onMouseLeave={resetHero}
          aria-label="An interactive clay workspace"
        >
          <div className="hero-light" aria-hidden="true" />
          <picture>
            <source media="(max-width: 640px)" srcSet="/clay/1-720.webp 720w, /clay/1.webp 1122w" />
            <img
              className="hero-image"
              src="/clay/2.webp"
              srcSet="/clay/2-720.webp 720w, /clay/2.webp 1448w"
              sizes="(max-width: 640px) 82vw, (max-width: 1100px) 54vw, 48vw"
              alt="A clay version of Suyash working at a wooden desk with a laptop, books and a coffee mug"
              width="1448"
              height="1086"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
          <button
            className="hero-hotspot hotspot-cup"
            type="button"
            onClick={() => reactToProp("Coffee rotated. Productivity unchanged.")}
            aria-label="Wiggle the clay coffee cup"
          >
            <span>coffee?</span>
          </button>
          <button
            className="hero-hotspot hotspot-books"
            type="button"
            onClick={() => reactToProp("The book stack approves.")}
            aria-label="Press the clay book stack"
          >
            <span>press</span>
          </button>
          <button
            className="hero-hotspot hotspot-trophy"
            type="button"
            onClick={() => reactToProp("A tiny, unnecessary shine.")}
            aria-label="Shine the clay trophy"
          >
            <span>shine</span>
          </button>
          <figcaption className="hero-reaction" aria-live="polite">
            {heroReaction}
          </figcaption>
        </figure>
      </section>

      <section
        className="project-playground"
        id="projects"
        ref={projectsRef}
        aria-labelledby="projects-title"
        style={{ "--project-count": projects.length } as CSSProperties}
      >
        <div className="projects-sticky">
          <div className="projects-heading">
            <p className="hand-note">A few things I’ve shaped</p>
            <h2 id="projects-title">Selected work</h2>
          </div>

          <div className="project-stage" aria-live="polite">
            {projects.map((project, index) => (
              <article
                className={`project-scene ${
                  index === activeProject ? "is-active" : index < activeProject ? "is-past" : "is-future"
                }`}
                key={project.slug}
                aria-hidden={index !== activeProject}
                style={
                  {
                    "--project-accent": project.accent,
                    "--project-ink": project.ink,
                  } as CSSProperties
                }
              >
                <div className="scene-image-wrap">
                  <ResponsiveClayImage
                    image={project.image}
                    imageSmall={project.imageSmall}
                    alt={project.alt}
                    className="scene-image"
                  />
                  {project.slug === "coming-soon" && (
                    <span className="orb-glow" aria-hidden="true" />
                  )}
                </div>
                <div className="project-copy">
                  <p className="project-eyebrow">{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags" aria-label="Project tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="project-progress" aria-label="Choose a project chapter">
            <span className="project-count">
              <b>{String(activeProject + 1).padStart(2, "0")}</b>
              <i />
              {String(projects.length).padStart(2, "0")}
            </span>
            <div className="project-dots">
              {projects.map((project, index) => (
                <button
                  key={project.slug}
                  className={index === activeProject ? "is-active" : ""}
                  type="button"
                  onClick={() => scrollToProject(index)}
                  aria-label={`Show ${project.title}`}
                  aria-current={index === activeProject ? "step" : undefined}
                />
              ))}
            </div>
            <span className="scroll-nudge">scroll to turn the page</span>
          </div>
        </div>

        <div className="projects-mobile" aria-label="Selected project chapters">
          <div className="mobile-projects-heading">
            <p className="hand-note">A few things I’ve shaped</p>
            <h2>Selected work</h2>
          </div>
          {projects.map((project, index) => (
            <article
              className="mobile-project-scene"
              data-reveal
              key={project.slug}
              style={
                {
                  "--project-accent": project.accent,
                  "--project-ink": project.ink,
                } as CSSProperties
              }
            >
              <div className="mobile-project-number">{String(index + 1).padStart(2, "0")}</div>
              <ResponsiveClayImage
                image={project.image}
                imageSmall={project.imageSmall}
                alt={project.alt}
                className="mobile-project-image"
              />
              <div className="mobile-project-copy">
                <p>{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <span>{project.description}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about section-shell" id="about" aria-labelledby="about-title">
        <div className="about-image-wrap" data-reveal>
          <img
            src="/clay/5.webp"
            srcSet="/clay/5-720.webp 720w, /clay/5.webp 1254w"
            sizes="(max-width: 820px) 74vw, 32vw"
            alt="Clay Suyash thinking and looking upward"
            width="1254"
            height="1254"
            loading="lazy"
            decoding="async"
          />
          <span className="about-thought" aria-live="polite">
            {aboutMode === "build" && "make it useful"}
            {aboutMode === "listen" && "listen before shaping"}
            {aboutMode === "simplify" && "less, but better"}
          </span>
        </div>
        <div className="about-copy" data-reveal>
          <p className="hand-note">A little context</p>
          <h2 id="about-title">Engineer by title. Product person by instinct.</h2>
          <p>
            I like building the thin layer where messy systems meet humans and suddenly have to make sense.
          </p>
          <div className="about-controls" aria-label="A few working principles">
            {[
              ["build", "Build"],
              ["listen", "Listen"],
              ["simplify", "Simplify"],
            ].map(([value, label]) => (
              <button
                type="button"
                className={aboutMode === value ? "is-active" : ""}
                key={value}
                onClick={() => {
                  setAboutMode(value);
                  playTone("tap");
                }}
                aria-pressed={aboutMode === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="now section-shell" id="now" aria-labelledby="now-title">
        <div className="now-copy" data-reveal>
          <p className="hand-note">My default mode</p>
          <h2 id="now-title">Useful. Thoughtful. A little playful.</h2>
        </div>
        <div className="clay-shelf" aria-label="Three interactive clay principles" data-reveal>
          <button type="button" onClick={() => playTone("tap")}>
            <span>01</span>
            Useful
          </button>
          <button type="button" onClick={() => playTone("tap")}>
            <span>02</span>
            Clear
          </button>
          <button type="button" onClick={() => playTone("tap")}>
            <span>03</span>
            Alive
          </button>
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-character" aria-hidden="true">
          <img
            src="/clay/3.webp"
            srcSet="/clay/3-720.webp 720w, /clay/3.webp 1122w"
            sizes="(max-width: 720px) 46vw, 24vw"
            alt=""
            width="1122"
            height="1402"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="contact-copy" data-reveal>
          <p className="hand-note">Okay. Enough internet.</p>
          <h2 id="contact-title">Let’s make something useful.</h2>
          <a className="clay-button contact-button" href="#top" onPointerDown={() => playTone("tap")}>
            Back to the desk <span aria-hidden="true">↑</span>
          </a>
        </div>
        <footer>
          <span>Suyash Pradhan</span>
          <span>Product engineer</span>
        </footer>
      </section>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <a href="#projects">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Hello</a>
      </nav>
    </main>
  );
}
