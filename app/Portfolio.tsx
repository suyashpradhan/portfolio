"use client";

/* eslint-disable @next/next/no-img-element -- clay artwork is pre-sized, compressed, and served with responsive srcsets. */

import {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { projects } from "./projects";

type Theme = "light" | "dark";
type Tone = "tap" | "toggle" | "shift";

// Add the real destinations here when they are ready. Empty values render as
// honest, styled placeholders instead of dead or misleading links.
const PORTFOLIO_LINKS = {
  blogs: "",
  resume: "",
  github: "",
  twitter: "",
  linkedin: "",
  productHunt: "",
};

const toneConfig: Record<Tone, { frequency: number; duration: number; gain: number }> = {
  tap: { frequency: 142, duration: 0.085, gain: 0.04 },
  toggle: { frequency: 238, duration: 0.12, gain: 0.038 },
  shift: { frequency: 176, duration: 0.07, gain: 0.022 },
};

const avatarMessages = [
  "Hey — glad you made it.",
  "I like turning ambiguity into something useful.",
  "The laptop has the work. I’ll be right here.",
] as const;

const projectGuideCopy = [
  "A story should feel held, not filed.",
  "Capture first. Structure second.",
  "A useful library remembers where things belong.",
  "Complex systems still need human-scale steps.",
  "The next useful problem is already on the desk.",
] as const;

const projectGuidePoses = [
  "/clay/avatar-wave-v3.webp",
  "/clay/avatar-neutral-v3.webp",
  "/clay/avatar-neutral-v3.webp",
  "/clay/avatar-neutral-v3.webp",
  "/clay/avatar-wave-v3.webp",
] as const;

const aboutModes = {
  prototype: {
    label: "Prototype",
    thought: "make the idea touchable",
    title: "I make the unclear tangible early.",
    description:
      "A working slice reveals more than a long debate. I prototype the riskiest part first, then let real use sharpen the direction.",
  },
  listen: {
    label: "Listen",
    thought: "find the real friction",
    title: "I look for the problem behind the request.",
    description:
      "I use customer behavior, support signals and team context to understand what is actually getting in someone’s way.",
  },
  simplify: {
    label: "Simplify",
    thought: "remove a step",
    title: "I reduce the distance between intent and outcome.",
    description:
      "I remove unnecessary states, language and abstraction until the product feels calm without becoming simplistic.",
  },
} as const;

type AboutMode = keyof typeof aboutModes;

const skillGroups = {
  engineering: {
    eyebrow: "Build systems",
    title: "Product engineering",
    description:
      "I care about maintainable foundations, but I measure them by how quickly a team can learn and ship.",
    skills: ["React & Next.js", "TypeScript", "Frontend architecture", "Web & mobile products"],
  },
  ai: {
    eyebrow: "Shape intelligence",
    title: "AI-native building",
    description:
      "I work on the product layer around models: useful workflows, understandable states and feedback loops that improve trust.",
    skills: ["LLM product patterns", "Agent workflows", "Rapid prototyping", "Evaluation thinking"],
  },
  craft: {
    eyebrow: "Make it human",
    title: "Product craft",
    description:
      "I bridge engineering and design so that interaction, language and system behavior feel like one considered experience.",
    skills: ["Interaction design", "Design systems", "Systems thinking", "Experimentation"],
  },
} as const;

type SkillGroup = keyof typeof skillGroups;

const contributionModes = {
  useful: {
    label: "Ship useful",
    title: "A real outcome, not a polished demo.",
    description: "I bias toward the smallest complete thing that can solve a real problem and teach us what to do next.",
  },
  clear: {
    label: "Make clear",
    title: "Fewer decisions for the person using it.",
    description: "I turn complicated systems into flows, language and states that people can understand without a manual.",
  },
  alive: {
    label: "Add life",
    title: "Personality in service of feedback.",
    description: "I use motion and play when they clarify an action, reward curiosity or make a product easier to remember.",
  },
} as const;

type ContributionMode = keyof typeof contributionModes;

const readingList = [
  {
    title: "The Creative Act",
    author: "Rick Rubin",
    note: "A reminder to notice more before trying to produce more.",
  },
  {
    title: "Build",
    author: "Tony Fadell",
    note: "Product judgement, hard-earned patterns and the useful mess behind shipping.",
  },
  {
    title: "Endure",
    author: "Alex Hutchinson",
    note: "How perception, physiology and patience shape the edge of performance.",
  },
] as const;

const trainingModes = {
  tennis: { label: "Tennis", detail: "Footwork, timing and learning to reset after every point." },
  running: { label: "Running", detail: "Building an aerobic base one unglamorous, repeatable week at a time." },
  strength: { label: "Strength", detail: "Durability for work, sport and the long game." },
  swimming: { label: "Swimming", detail: "Practising calm technique when the environment pushes back." },
  hyrox: { label: "HYROX", detail: "The next concrete test: engine, strength and transitions under fatigue." },
  ironman: { label: "Ironman", detail: "The long-term mission—and a good reason to keep showing up now." },
} as const;

type TrainingMode = keyof typeof trainingModes;

function WaveIcon({ active }: { active: boolean }) {
  return (
    <span className={`wave-icon ${active ? "is-active" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function ReadyLink({
  href,
  label,
  mark,
  className = "",
}: {
  href: string;
  label: string;
  mark?: string;
  className?: string;
}) {
  const contents = (
    <>
      {mark && <span className="ready-link-mark" aria-hidden="true">{mark}</span>}
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {contents}
      </a>
    );
  }

  return (
    <span
      className={`${className} is-placeholder`}
      role="link"
      aria-disabled="true"
      tabIndex={0}
      title={`${label} link is ready to connect`}
    >
      {contents}
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
      srcSet={`${imageSmall} 720w, ${image} 1536w`}
      sizes="(max-width: 820px) 92vw, 70vw"
      alt={alt}
      width="1536"
      height="1086"
      loading={loading}
      decoding="async"
    />
  );
}

function ProjectSignal({ slug }: { slug: string }) {
  if (slug === "kahaani") {
    return (
      <div className="project-signal signal-story" aria-hidden="true">
        <div className="signal-person"><i /><i /></div>
        <div className="signal-wave">{[1, 2, 3, 4, 5, 6, 7].map((bar) => <i key={bar} />)}</div>
        <div className="signal-transcript"><i /><i /><i /><span>saved with care</span></div>
      </div>
    );
  }

  if (slug === "voice-notes") {
    return (
      <div className="project-signal signal-action" aria-hidden="true">
        <div className="signal-mic">●</div>
        <div className="signal-wave">{[1, 2, 3, 4, 5].map((bar) => <i key={bar} />)}</div>
        <b>→</b>
        <div className="signal-checks"><i /><i /><i /></div>
      </div>
    );
  }

  if (slug === "visual-library") {
    return (
      <div className="project-signal signal-library" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((tile) => <i key={tile}><span /></i>)}
        <b>Everything, findable.</b>
      </div>
    );
  }

  if (slug === "epfo") {
    return (
      <div className="project-signal signal-steps" aria-hidden="true">
        <div className="signal-document"><i /><i /><i /></div>
        <div className="signal-step-line"><i /><i /><i /><i /></div>
        <span>one clear step at a time</span>
      </div>
    );
  }

  return (
    <div className="project-signal signal-next" aria-hidden="true">
      <i /><i /><i />
      <span>still shaping</span>
    </div>
  );
}

export default function Portfolio() {
  const [theme, setTheme] = useState<Theme>("light");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [avatarMessage, setAvatarMessage] = useState(0);
  const [aboutMode, setAboutMode] = useState<AboutMode>("prototype");
  const [activeSkill, setActiveSkill] = useState<SkillGroup>("engineering");
  const [activeContribution, setActiveContribution] = useState<ContributionMode>("useful");
  const [activeBook, setActiveBook] = useState(0);
  const [activeTraining, setActiveTraining] = useState<TrainingMode>("tennis");
  const pageRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const projectStageRef = useRef<HTMLDivElement>(null);
  const projectDragRef = useRef({ active: false, startX: 0, currentX: 0 });
  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(false);
  const activeProjectRef = useRef(0);
  const lastProjectRef = useRef(0);
  const heroFrameRef = useRef(0);
  const cursorFrameRef = useRef(0);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const heroPointerRef = useRef<{
    target: HTMLElement;
    clientX: number;
    clientY: number;
  } | null>(null);

  const currentAbout = aboutModes[aboutMode];
  const currentSkill = skillGroups[activeSkill];
  const currentContribution = contributionModes[activeContribution];
  const currentTraining = trainingModes[activeTraining];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const activeTheme = document.documentElement.dataset.theme as Theme | undefined;
      setTheme(activeTheme === "dark" ? "dark" : "light");
      setSoundEnabled(window.localStorage.getItem("suyash-sound") === "on");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(heroFrameRef.current);
    cancelAnimationFrame(cursorFrameRef.current);
  }, []);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  const playTone = useCallback((tone: Tone, force = false) => {
    if (!soundRef.current && !force) return;

    if (!audioRef.current) audioRef.current = new AudioContext();
    const context = audioRef.current;
    if (context.state === "suspended") void context.resume();

    const config = toneConfig[tone];
    const master = context.createGain();
    const now = context.currentTime;
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(config.gain, now + 0.009);
    master.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);
    master.connect(context.destination);

    [1, 1.52].forEach((ratio, index) => {
      const oscillator = context.createOscillator();
      const voice = context.createGain();
      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(config.frequency * ratio, now);
      oscillator.frequency.exponentialRampToValueAtTime(
        config.frequency * ratio * 0.7,
        now + config.duration,
      );
      voice.gain.value = index === 0 ? 0.78 : 0.22;
      oscillator.connect(voice);
      voice.connect(master);
      oscillator.start(now);
      oscillator.stop(now + config.duration + 0.02);
    });
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cursor = cursorRef.current;
    if (!cursor || !finePointer.matches || reducedMotion.matches) return;

    document.body.classList.add("has-clay-cursor");
    let nextX = -40;
    let nextY = -40;

    const paintCursor = () => {
      cursorFrameRef.current = 0;
      cursor.style.setProperty("--cursor-x", `${nextX}px`);
      cursor.style.setProperty("--cursor-y", `${nextY}px`);
    };
    const moveCursor = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      cursor.classList.add("is-visible");
      cursor.classList.toggle(
        "is-interactive",
        event.target instanceof Element && Boolean(event.target.closest("a, button, [role='link']")),
      );
      if (!cursorFrameRef.current) cursorFrameRef.current = requestAnimationFrame(paintCursor);
    };
    const pressCursor = () => cursor.classList.add("is-pressed");
    const releaseCursor = () => cursor.classList.remove("is-pressed");
    const hideCursor = () => cursor.classList.remove("is-visible");

    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerdown", pressCursor, { passive: true });
    window.addEventListener("pointerup", releaseCursor, { passive: true });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    return () => {
      cancelAnimationFrame(cursorFrameRef.current);
      document.body.classList.remove("has-clay-cursor");
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerdown", pressCursor);
      window.removeEventListener("pointerup", releaseCursor);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let revert = () => {};

    void import("gsap").then(
      ({ gsap }) => {
        if (disposed) return;

        const context = gsap.context(() => {
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro
            .from(".simple-hero-intro > *", {
              y: 22,
              opacity: 0,
              duration: 0.66,
              stagger: 0.07,
              clearProps: "transform,opacity",
            })
            .from(
              ".simple-hero-avatar",
              { y: 32, scale: 0.94, opacity: 0, duration: 0.72, clearProps: "transform,opacity" },
              "-=0.4",
            )
            .from(
              ".simple-project-door",
              { y: 12, opacity: 0, duration: 0.48, clearProps: "transform,opacity" },
              "-=0.3",
            );

          revert = () => context.revert();
        }, page);
      },
    );

    return () => {
      disposed = true;
      revert();
    };
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
        const chapterPosition = progress * projects.length;
        const nextIndex = Math.min(projects.length - 1, Math.floor(chapterPosition));
        const chapterProgress = Math.min(1, Math.max(0, chapterPosition - nextIndex));
        section.style.setProperty("--chapter-progress", chapterProgress.toFixed(3));
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
    if (reducedMotion.matches || !window.IntersectionObserver) return;

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
      if (item.getBoundingClientRect().top < window.innerHeight * 0.92) item.classList.add("is-visible");
      else observer.observe(item);
    });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    const allowed = window.matchMedia("(min-width: 821px) and (prefers-reduced-motion: no-preference)");
    if (!allowed.matches) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
          const amount = Math.max(-1, Math.min(1, distance)) * -14;
          element.style.setProperty("--parallax-y", `${amount.toFixed(2)}px`);
        });
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
    window.localStorage.setItem("suyash-sound", nextSound ? "on" : "off");
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
    heroPointerRef.current = {
      target: event.currentTarget,
      clientX: event.clientX,
      clientY: event.clientY,
    };
    if (heroFrameRef.current) return;

    heroFrameRef.current = requestAnimationFrame(() => {
      heroFrameRef.current = 0;
      const pointer = heroPointerRef.current;
      if (!pointer) return;
      const bounds = pointer.target.getBoundingClientRect();
      const x = (pointer.clientX - bounds.left) / bounds.width - 0.5;
      const y = (pointer.clientY - bounds.top) / bounds.height - 0.5;
      pointer.target.style.setProperty("--world-x", `${x * 8}px`);
      pointer.target.style.setProperty("--world-y", `${y * 7}px`);
      pointer.target.style.setProperty("--light-x", `${(x + 0.5) * 100}%`);
      pointer.target.style.setProperty("--light-y", `${(y + 0.5) * 100}%`);

      pointer.target.querySelectorAll<HTMLElement>(".hero-object").forEach((object) => {
        const hotspotBounds = object.getBoundingClientRect();
        const distance = Math.hypot(
          pointer.clientX - (hotspotBounds.left + hotspotBounds.width / 2),
          pointer.clientY - (hotspotBounds.top + hotspotBounds.height / 2),
        );
        object.style.setProperty("--near", Math.max(0, 1 - distance / 180).toFixed(3));
      });
    });
  };

  const resetHero = (event: ReactMouseEvent<HTMLElement>) => {
    cancelAnimationFrame(heroFrameRef.current);
    heroFrameRef.current = 0;
    heroPointerRef.current = null;
    ["--world-x", "--world-y"].forEach((property) =>
      event.currentTarget.style.setProperty(property, "0px"),
    );
    event.currentTarget.style.setProperty("--light-x", "50%");
    event.currentTarget.style.setProperty("--light-y", "40%");
    event.currentTarget.querySelectorAll<HTMLElement>(".hero-object").forEach((object) =>
      object.style.setProperty("--near", "0"),
    );
  };

  const reactToAvatar = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    setAvatarMessage((current) => (current + 1) % avatarMessages.length);
    playTone("tap");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      button.classList.add("is-waving");
      window.setTimeout(() => button.classList.remove("is-waving"), 760);
      button.animate(
        [
          { transform: "scale(1, 1) rotate(0deg)" },
          { transform: "scale(0.94, 0.9) rotate(-1deg)", offset: 0.2 },
          { transform: "scale(1.025, 1.04) rotate(1deg)", offset: 0.56 },
          { transform: "scale(1, 1) rotate(0deg)" },
        ],
        { duration: 520, easing: "cubic-bezier(0.2, 0.82, 0.24, 1.08)" },
      );
    }
  };

  const startProjectDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    projectDragRef.current = { active: true, startX: event.clientX, currentX: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  };

  const moveProjectDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!projectDragRef.current.active) return;
    projectDragRef.current.currentX = event.clientX;
    const delta = Math.max(-88, Math.min(88, event.clientX - projectDragRef.current.startX));
    event.currentTarget.style.setProperty("--drag-x", `${delta}px`);
  };

  const endProjectDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!projectDragRef.current.active) return;
    const delta = projectDragRef.current.currentX - projectDragRef.current.startX;
    projectDragRef.current.active = false;
    event.currentTarget.classList.remove("is-dragging");
    event.currentTarget.style.setProperty("--drag-x", "0px");
    if (Math.abs(delta) < 46) return;
    const next = delta < 0 ? activeProject + 1 : activeProject - 1;
    scrollToProject(Math.max(0, Math.min(projects.length - 1, next)));
  };

  return (
    <main id="top" ref={pageRef}>
      <span className="clay-cursor" ref={cursorRef} aria-hidden="true" />
      <a className="skip-link" href="#projects">Skip to projects</a>

      <header className="site-header" aria-label="Primary navigation">
        <a className="brand-mark" href="#top" aria-label="Suyash Pradhan, back to top">
          <span aria-hidden="true">S</span>
          <b>Suyash Pradhan</b>
        </a>

        <nav className="desktop-nav" aria-label="Main links">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#reading">Reading</a>
          <ReadyLink href={PORTFOLIO_LINKS.blogs} label="Blogs" className="nav-ready-link" />
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
          <div className="sound-control">
            <button
              className="sound-toggle clay-icon-button"
              type="button"
              onClick={changeSound}
              aria-label={`${soundEnabled ? "Turn off" : "Turn on"} interaction sounds`}
              aria-pressed={soundEnabled}
            >
              <WaveIcon active={soundEnabled} />
            </button>
            <span className="sound-label" aria-live="polite">sound {soundEnabled ? "on" : "off"}</span>
          </div>
        </div>
      </header>

      <section className="hero hero-world simple-hero" aria-labelledby="hero-title">
        <div className="simple-hero-scene" onMouseMove={moveHero} onMouseLeave={resetHero}>
          <div className="hero-atmosphere" aria-hidden="true">
            <i className="atmosphere-orb orb-one" />
            <i className="atmosphere-orb orb-two" />
            <i className="atmosphere-squiggle">~</i>
          </div>

          <div className="simple-hero-intro">
            <p className="hero-signature">Suyash Pradhan · Product Engineer</p>
            <h1 id="hero-title">
              I make complex products
              <span> clear, useful and alive.</span>
            </h1>
            <p>I work where product judgement, interaction design and dependable engineering meet.</p>
          </div>

          <div className="simple-hero-avatar">
            <span className="simple-avatar-shadow" aria-hidden="true" />
            <button
              className="hero-avatar-button"
              type="button"
              onClick={reactToAvatar}
              aria-label="Ask clay Suyash for another thought"
            >
              <img className="avatar-pose pose-neutral" src="/clay/avatar-neutral-v3.webp" alt="Clay Suyash" width="520" height="650" loading="eager" fetchPriority="high" />
              <img className="avatar-pose pose-wave" src="/clay/avatar-wave-v3.webp" alt="" width="520" height="650" loading="eager" />
              <span className="avatar-whisper" aria-live="polite" key={avatarMessage}>
                {avatarMessages[avatarMessage]}
              </span>
            </button>
          </div>

          <a
            className="hero-object simple-project-door"
            href="#projects"
            onPointerDown={() => playTone("tap")}
            aria-label="View selected projects"
          >
            <img src="/clay/hero-laptop.webp" alt="" width="640" height="480" loading="eager" />
            <span><small>Selected work</small><b>Open the laptop <i aria-hidden="true">→</i></b></span>
          </a>
        </div>
      </section>

      <section
        className="project-playground screen-projects"
        id="projects"
        ref={projectsRef}
        aria-labelledby="projects-title"
        style={{ "--project-count": projects.length, "--chapter-progress": 0 } as CSSProperties}
      >
        <div className="projects-sticky project-theatre">
          <div className="project-screen-toolbar" aria-hidden="true">
            <span className="screen-window-dots"><i /><i /><i /></span>
            <span>suyash.work / projects / {projects[activeProject].slug}</span>
            <span>interactive workspace</span>
          </div>
          <header className="project-theatre-heading">
            <div>
              <p className="hand-note">You made it inside</p>
              <h2 id="projects-title">Selected work</h2>
            </div>
            <div className="project-guide" aria-live="polite">
              <img src={projectGuidePoses[activeProject]} alt="" width="520" height="650" />
              <p key={activeProject}>{projectGuideCopy[activeProject]}</p>
            </div>
            <p>Scroll, drag or use the dock to move through the work.</p>
          </header>

          <div
            className="project-stage"
            ref={projectStageRef}
            aria-live="polite"
            onPointerDown={startProjectDrag}
            onPointerMove={moveProjectDrag}
            onPointerUp={endProjectDrag}
            onPointerCancel={endProjectDrag}
          >
            <div className="project-backdrop-title" aria-hidden="true" key={projects[activeProject].slug}>
              {projects[activeProject].title}
            </div>
            {projects.map((project, index) => (
              <article
                className={`project-scene ${index === activeProject ? "is-active" : index < activeProject ? "is-past" : "is-future"}`}
                key={project.slug}
                aria-hidden={index !== activeProject}
                style={{
                  "--project-accent": project.accent,
                  "--project-ink": project.ink,
                  "--project-focus": project.objectPosition,
                  "--project-scale": project.imageScale,
                } as CSSProperties}
              >
                <span className="project-scene-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="scene-image-wrap">
                  <ResponsiveClayImage image={project.image} imageSmall={project.imageSmall} alt={project.alt} className="scene-image" />
                  <span className="screen-image-shade" aria-hidden="true" />
                  {project.slug === "coming-soon" && <span className="orb-glow" aria-hidden="true" />}
                </div>
                <div className="project-interface-panel">
                  <span>Product signal</span>
                  <ProjectSignal slug={project.slug} />
                </div>
                <div className="project-copy">
                  <p className="project-eyebrow">{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags" aria-label="Project tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="project-progress" aria-label="Choose a project chapter">
            <button
              className="project-step-button is-previous"
              type="button"
              onClick={() => scrollToProject(Math.max(0, activeProject - 1))}
              disabled={activeProject === 0}
              aria-label="Previous project"
            >
              ←
            </button>
            <span className="project-count">
              <b className="count-step" key={activeProject}>{String(activeProject + 1).padStart(2, "0")}</b>
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
            <button
              className="project-step-button is-next"
              type="button"
              onClick={() => scrollToProject(Math.min(projects.length - 1, activeProject + 1))}
              disabled={activeProject === projects.length - 1}
              aria-label="Next project"
            >
              →
            </button>
          </div>

          <div className="project-chapter-strip" aria-label="Project chapters">
            {projects.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                className={index === activeProject ? "is-active" : ""}
                onClick={() => scrollToProject(index)}
                aria-current={index === activeProject ? "step" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {project.title}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-mobile" aria-label="Selected project chapters">
          <div className="mobile-projects-heading">
            <p className="hand-note">You made it inside</p>
            <h2>Project chapters</h2>
          </div>
          {projects.map((project, index) => (
            <article
              className="mobile-project-scene"
              data-reveal
              key={project.slug}
              style={{
                "--project-accent": project.accent,
                "--project-ink": project.ink,
                "--project-focus": project.objectPosition,
                "--project-scale": project.imageScale,
              } as CSSProperties}
            >
              <div className="mobile-project-number">{String(index + 1).padStart(2, "0")}</div>
              <ResponsiveClayImage image={project.image} imageSmall={project.imageSmall} alt={project.alt} className="mobile-project-image" />
              <div className="mobile-project-signal"><ProjectSignal slug={project.slug} /></div>
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
        <div className="about-image-wrap" data-reveal data-parallax>
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
          <span className="about-thought" aria-live="polite" key={aboutMode}>{currentAbout.thought}</span>
        </div>
        <div className="about-copy" data-reveal>
          <p className="hand-note">A little more context</p>
          <h2 id="about-title">Engineer by title. Product person by instinct.</h2>
          <div className="about-summary">
            <p>I work at the boundary between an idea and the person who eventually has to use it. That means translating vague goals into product decisions, interfaces and reliable software.</p>
            <p>My best work happens when engineering, design and product thinking stay in the same conversation—from the first rough prototype through the details that make it feel finished.</p>
          </div>
          <p className="control-prompt">Choose a principle to see how it changes the work.</p>
          <div className="about-controls" aria-label="Choose a working principle">
            {(Object.keys(aboutModes) as AboutMode[]).map((value) => (
              <button
                type="button"
                className={aboutMode === value ? "is-active" : ""}
                key={value}
                onClick={() => { setAboutMode(value); playTone("tap"); }}
                aria-pressed={aboutMode === value}
              >
                {aboutModes[value].label}
              </button>
            ))}
          </div>
          <div className="about-detail" aria-live="polite" key={aboutMode}>
            <h3>{currentAbout.title}</h3>
            <p>{currentAbout.description}</p>
          </div>
        </div>
      </section>

      <section className="skills section-shell" id="skills" aria-labelledby="skills-title">
        <div className="skills-copy" data-reveal>
          <p className="hand-note">What I’m sharpening</p>
          <h2 id="skills-title">Tools change. The craft stays.</h2>
          <p>I’m a product engineer who likes owning the connective tissue: the system, the interface and the judgement between them.</p>
          <div className="skill-detail" key={activeSkill} aria-live="polite">
            <span>{currentSkill.eyebrow}</span>
            <h3>{currentSkill.title}</h3>
            <p>{currentSkill.description}</p>
            <ul>
              {currentSkill.skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        </div>
        <div className="skill-workbench" data-skill={activeSkill} data-reveal aria-label="Skill groups">
          {(Object.keys(skillGroups) as SkillGroup[]).map((group, index) => (
            <button
              type="button"
              key={group}
              className={activeSkill === group ? "is-active" : ""}
              onClick={() => { setActiveSkill(group); playTone("tap"); }}
              aria-pressed={activeSkill === group}
            >
              <span>0{index + 1}</span>
              <b>{skillGroups[group].title}</b>
              <small>{skillGroups[group].eyebrow}</small>
            </button>
          ))}
          <div className="skill-tools" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
      </section>

      <section className="now section-shell" id="approach" aria-labelledby="approach-title">
        <div className="now-copy" data-reveal>
          <p className="hand-note">What I bring to a team</p>
          <h2 id="approach-title">Useful first. Clear always. Playful when it helps.</h2>
          <div className="contribution-detail" key={activeContribution} aria-live="polite">
            <h3>{currentContribution.title}</h3>
            <p>{currentContribution.description}</p>
          </div>
        </div>
        <div className="clay-shelf" aria-label="Choose a product outcome" data-reveal>
          {(Object.keys(contributionModes) as ContributionMode[]).map((mode, index) => (
            <button
              type="button"
              key={mode}
              className={activeContribution === mode ? "is-active" : ""}
              onClick={() => { setActiveContribution(mode); playTone("tap"); }}
              aria-pressed={activeContribution === mode}
            >
              <span>0{index + 1}</span>
              {contributionModes[mode].label}
            </button>
          ))}
        </div>
      </section>

      <section className="reading section-shell" id="reading" aria-labelledby="reading-title">
        <div className="reading-visual" data-reveal data-parallax data-book={activeBook}>
          <picture>
            <source media="(max-width: 720px)" srcSet="/clay/reading-720.webp" />
            <img
              src="/clay/reading.webp"
              srcSet="/clay/reading-720.webp 720w, /clay/reading.webp 1448w"
              sizes="(max-width: 820px) 92vw, 52vw"
              alt="Clay Suyash reading in a warm chair beside a stack of books"
              width="1448"
              height="1086"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <span className="reading-bookmark" aria-hidden="true" />
        </div>
        <div className="reading-copy" data-reveal>
          <p className="hand-note">Currently on the desk</p>
          <h2 id="reading-title">Ideas I’m carrying around.</h2>
          <p>Reading is where product thoughts, creative practice and endurance training keep borrowing from each other.</p>
          <div className="reading-list" aria-label="Books currently on the desk">
            {readingList.map((book, index) => (
              <button
                type="button"
                key={book.title}
                className={activeBook === index ? "is-active" : ""}
                onClick={() => { setActiveBook(index); playTone("tap"); }}
                aria-pressed={activeBook === index}
              >
                <span>0{index + 1}</span>
                <b>{book.title}</b>
                <small>{book.author}</small>
              </button>
            ))}
          </div>
          <blockquote key={activeBook} aria-live="polite">{readingList[activeBook].note}</blockquote>
        </div>
      </section>

      <section className="life section-shell" id="beyond-work" aria-labelledby="life-title">
        <div className="life-stage" data-reveal data-parallax data-training={activeTraining}>
          <picture>
            <source media="(max-width: 720px)" srcSet="/clay/training-720.webp" />
            <img
              src="/clay/training.webp"
              srcSet="/clay/training-720.webp 720w, /clay/training.webp 1536w"
              sizes="(max-width: 820px) 92vw, 88vw"
              alt="Clay Suyash lacing a running shoe beside tennis, swimming and strength equipment"
              width="1536"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <div className="life-copy">
            <p className="hand-note">Away from the keyboard</p>
            <h2 id="life-title">Training for a bigger engine.</h2>
            <p>Tennis, running, strength and swimming keep me honest about repetition. HYROX is the near-term test. Ironman is the long game.</p>
            <div className="training-controls" aria-label="Choose a training thread">
              {(Object.keys(trainingModes) as TrainingMode[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  className={activeTraining === mode ? "is-active" : ""}
                  onClick={() => { setActiveTraining(mode); playTone("tap"); }}
                  aria-pressed={activeTraining === mode}
                >
                  {trainingModes[mode].label}
                </button>
              ))}
            </div>
            <div className="training-detail" key={activeTraining} aria-live="polite">
              <b>{currentTraining.label}</b>
              <span>{currentTraining.detail}</span>
            </div>
          </div>
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
          <p className="contact-intro">Resume and social destinations are ready to connect when you are.</p>
          <div className="contact-actions">
            <ReadyLink href={PORTFOLIO_LINKS.resume} label="Resume" mark="↓" className="clay-button resume-button" />
            <a className="clay-button contact-button" href="#top" onPointerDown={() => playTone("tap")}>
              Back to the desk <span className="hand-arrow arrow-up" aria-hidden="true">↑</span>
            </a>
          </div>
          <div className="social-row" aria-label="Social profiles ready to connect">
            <ReadyLink href={PORTFOLIO_LINKS.github} label="GitHub" mark="GH" className="social-link" />
            <ReadyLink href={PORTFOLIO_LINKS.twitter} label="Twitter" mark="X" className="social-link" />
            <ReadyLink href={PORTFOLIO_LINKS.linkedin} label="LinkedIn" mark="in" className="social-link" />
            <ReadyLink href={PORTFOLIO_LINKS.productHunt} label="Product Hunt" mark="P" className="social-link" />
          </div>
        </div>
        <footer>
          <span>Suyash Pradhan</span>
          <span>Product engineer · training for the long game</span>
        </footer>
      </section>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <a href="#projects">Work</a>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <ReadyLink href={PORTFOLIO_LINKS.blogs} label="Blogs" className="mobile-ready-link" />
        <a href="#contact">Hello</a>
      </nav>
    </main>
  );
}
