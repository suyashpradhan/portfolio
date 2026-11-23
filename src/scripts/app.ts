// All client behaviour lives here. Listeners are attached once, at the document
// level, so they keep working across client-side page swaps without re-binding.

import { navigate } from "astro:transitions/client";
import { play, setSound, soundEnabled } from "./sound";

const root = document.documentElement;
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Theme ---------- */

function applyTheme(next: "light" | "dark") {
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", next === "dark" ? "#1c1814" : "#f6f0e6");
}

function toggleTheme(origin?: HTMLElement) {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  play(next === "dark" ? "off" : "on");

  if (!document.startViewTransition || reduceMotion()) return applyTheme(next);

  // Grow the new theme out of the button (or the centre of the screen) as a circle.
  const r = origin?.getBoundingClientRect();
  const x = r ? r.left + r.width / 2 : innerWidth / 2;
  const y = r ? r.top + r.height / 2 : innerHeight / 2;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  root.classList.add("theme-vt");
  const vt = document.startViewTransition(() => applyTheme(next));
  vt.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
  vt.finished.finally(() => root.classList.remove("theme-vt"));
}

/* ---------- Sound ---------- */

function toggleSound() {
  const on = !soundEnabled();
  setSound(on);
  play(on ? "on" : "off", true);
}

/* ---------- Copy email ---------- */

async function copy(btn: HTMLElement) {
  const text = btn.dataset.copy;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    location.href = `mailto:${text}`;
    return;
  }
  play("pop");
  btn.setAttribute("data-copied", "");
  btn.setAttribute("aria-label", "Copied");
  setTimeout(() => {
    btn.removeAttribute("data-copied");
    btn.setAttribute("aria-label", "Copy email address");
  }, 1600);
}

/* ---------- Command palette ---------- */

const pal = () => document.getElementById("palette") as HTMLDialogElement | null;
const palInput = () => pal()?.querySelector<HTMLInputElement>("input");
const palItems = () =>
  Array.from(pal()?.querySelectorAll<HTMLElement>("[data-cmd]:not([hidden])") ?? []);

function openPalette() {
  const d = pal();
  if (!d || d.open) return;
  const input = palInput()!;
  input.value = "";
  filterPalette("");
  d.showModal();
  input.focus();
  play("open");
}

function closePalette() {
  pal()?.close();
}

function setActive(i: number) {
  const items = palItems();
  if (!items.length) return;
  const idx = (i + items.length) % items.length;
  items.forEach((el, n) => el.setAttribute("aria-selected", String(n === idx)));
  items[idx].scrollIntoView({ block: "nearest" });
  palInput()?.setAttribute("aria-activedescendant", items[idx].id);
}

function activeIndex() {
  return palItems().findIndex((el) => el.getAttribute("aria-selected") === "true");
}

function filterPalette(q: string) {
  const d = pal();
  if (!d) return;
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  d.querySelectorAll<HTMLElement>("[data-cmd]").forEach((el) => {
    const hay = (el.dataset.keywords + " " + el.textContent).toLowerCase();
    el.hidden = !terms.every((t) => hay.includes(t));
  });
  d.querySelectorAll<HTMLElement>("[data-group]").forEach((g) => {
    g.hidden = !g.querySelector("[data-cmd]:not([hidden])");
  });
  const empty = d.querySelector<HTMLElement>("[data-empty]");
  if (empty) empty.hidden = palItems().length > 0;
  setActive(0);
}

function runCommand(el: HTMLElement) {
  const { cmd, arg } = el.dataset;
  closePalette();
  switch (cmd) {
    case "go":
      play("tap");
      navigate(arg!);
      break;
    case "open":
      play("tap");
      window.open(arg, "_blank", "noopener");
      break;
    case "theme":
      toggleTheme();
      break;
    case "sound":
      toggleSound();
      break;
    case "copy": {
      const btn = document.createElement("button");
      btn.dataset.copy = arg;
      copy(btn);
      break;
    }
  }
}

/* ---------- Delegated events ---------- */

document.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;

  const action = t.closest<HTMLElement>("[data-action]");
  if (action) {
    const a = action.dataset.action;
    if (a === "theme") return toggleTheme(action);
    if (a === "sound") return toggleSound();
    if (a === "palette") return openPalette();
    if (a === "copy") return copy(action);
  }

  const cmd = t.closest<HTMLElement>("[data-cmd]");
  if (cmd) return runCommand(cmd);

  // Click on the dimmed backdrop closes the palette.
  if (t instanceof HTMLDialogElement && t.id === "palette") return closePalette();

  if (t.closest("summary")) return play("tick");
  if (t.closest("a[href]")) play("tap");
});

document.addEventListener("keydown", (e) => {
  const typing = (e.target as HTMLElement).closest("input, textarea, [contenteditable]");
  const d = pal();

  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    return d?.open ? closePalette() : openPalette();
  }
  if (!d?.open) {
    if (e.key === "/" && !typing) {
      e.preventDefault();
      openPalette();
    }
    return;
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    setActive(activeIndex() + (e.key === "ArrowDown" ? 1 : -1));
    play("tick");
  } else if (e.key === "Enter") {
    e.preventDefault();
    const el = palItems()[activeIndex()];
    if (el) runCommand(el);
  }
});

document.addEventListener("input", (e) => {
  const t = e.target as HTMLElement;
  if (t.closest("#palette")) filterPalette((t as HTMLInputElement).value);
});

document.addEventListener("mousemove", (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>("#palette [data-cmd]");
  if (el && el.getAttribute("aria-selected") !== "true") setActive(palItems().indexOf(el));
});

/* ---------- Per-page setup ---------- */

let clock: number | undefined;

document.addEventListener("astro:page-load", () => {
  root.dataset.sound = soundEnabled() ? "on" : "off";

  // Shortcut hints say Ctrl instead of ⌘ off Apple devices.
  if (!/Mac|iPhone|iPad/.test(navigator.userAgent)) {
    document.querySelectorAll("kbd").forEach((k) => {
      if (k.textContent === "⌘") k.textContent = "Ctrl";
    });
  }

  // Local time in the footer.
  clearInterval(clock);
  const host = document.querySelector<HTMLElement>("[data-tz]");
  const out = host?.querySelector<HTMLElement>("[data-clock]");
  if (host && out) {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: host.dataset.tz,
    });
    const tick = () => (out.textContent = fmt.format(new Date()));
    tick();
    clock = window.setInterval(tick, 15_000);
  }

  // Arriving at /work#company opens that role.
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (target instanceof HTMLDetailsElement) {
    target.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }
});
