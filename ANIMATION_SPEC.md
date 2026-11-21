# Animation Spec — paulinegrevet.com Reference Audit
> Audited from live HTML/CSS/JS source (curl). Date: 2026-11-21.
> Modern equivalents in Framer Motion / CSS are noted in the last column.

## Libraries Found in Reference (2014 stack)
| Library | Version | Purpose | 2026 Equivalent |
|---|---|---|---|
| jQuery | ~1.x | DOM + events | React state/refs |
| Bootstrap | 3 | Grid + navbar collapse | Tailwind CSS |
| animate.css | — | CSS keyframe library | Framer Motion variants |
| Waypoints.js | — | Scroll-trigger | Framer Motion `whileInView` |
| jQuery One Page Nav | — | Active nav highlight + smooth scroll | Custom `useScrollSpy` hook |
| Owl Carousel | — | Logo/client strip carousel | CSS marquee or Framer Motion drag |
| Skrollr | — | Parallax on desktop only (disabled on touch) | Framer Motion `useScroll` + `useTransform` |
| Magnific Popup | — | Lightbox / project modal | Custom accessible modal (Framer Motion AnimatePresence) |
| jQuery skillbar | — | Animated width bars triggered by waypoint | Framer Motion `animate` on `whileInView` |
| jQuery Tubular | — | YouTube video background in hero | CSS gradient + subtle animated blob (no video needed) |
| Superslides | — | Full-screen slideshow | Static hero with entrance animation |
| Modernizr | 2.6.2 | Touch detection (disable parallax/skillbar on mobile) | `useReducedMotion()` + CSS media queries |
| Font Awesome | 4 | Icons | lucide-react |
| Montserrat + Open Sans | Google Fonts | Typography | Inter + Playfair Display |

---

## Full Animation Inventory

| Element | Trigger | Effect | Duration | Easing | Delay / Stagger | Mobile behavior | 2026 Implementation |
|---|---|---|---|---|---|---|---|
| **Preloader** | Page load | Full-screen overlay (#fff), name + spinner.gif centered; fades out on `window.load` | fadeOut 800ms | linear | After all assets loaded | Same (overlay always shown) | Fixed overlay div, opacity 0→1 of content; fade out on `useEffect` after mount |
| **Navbar — initial** | Load | Transparent bg, white text, 20px padding, name in bordered box | — | — | — | Immediately collapses to `top-nav-collapse` on mobile | `bg-transparent` initial state |
| **Navbar — scrolled** | `scrollY > 50` | Adds `.top-nav-collapse`: bg `#F9F9F9`, `padding 0`, border-bottom, text turns black | transition: background 500ms + padding 500ms ease-in-out | ease-in-out | 0 | Always in collapsed state | Tailwind class swap on scroll, `transition-all duration-500` |
| **Navbar — active link** | Scroll spy (onePageNav, threshold 0.5) | `border-bottom: 3px solid white` (transparent), `3px solid black` (scrolled) | transition 1s ease-in-out | ease-in-out | — | Hidden on mobile | useScrollSpy → pill bg instead of underline |
| **Navbar — mobile menu** | Hamburger click | Bootstrap collapse (height 0 → auto, no animation) | instant | — | — | The norm | Framer Motion height animate |
| **Logo / brand name** | Load | `.company .border` has `transition: all 1s ease-in-out` (color change white→black on scroll) | 1s | ease-in-out | — | Same | CSS transition |
| **Hero — container** | Window load | `slideDownHead`: starts at `top: -500px, opacity:0` → animates to `top:0, opacity:1` in 500ms with 500ms delay | 500ms | easeOutCubic | 500ms delay | Same | Framer Motion initial/animate with delay |
| **Hero — h1** | After hero slides in | Fades in: `opacity: 0 → 1` in 500ms | 500ms | linear | After container finishes | Same | Framer Motion stagger child |
| **Hero — h3 (subtitle)** | After h1 | Fades in: `opacity: 0 → 1` in 300ms | 300ms | linear | After h1 finishes | Same | Framer Motion stagger child |
| **Hero — background** | Load | YouTube video background (via Tubular); on touch devices: static image `img/bg-head-1.jpg` | — | — | — | Static image | Animated gradient + floating blobs |
| **Hero — scroll indicator** | Idle | Pulsing "scroll down" arrow (implied, present in HTML onclick) | — | — | — | Same | Framer Motion bounce loop |
| **What I Do cards — background icon** | Scroll into view (waypoint at 80% viewport) | `.animated` elements: `data-animation="fadeInLeft"` applied with `data-animation-delay` (0ms, 200ms) | animate.css default ~1s | ease | 0ms, 200ms stagger | Disabled (`.animated` just made visible) | Framer Motion `whileInView` staggerChildren |
| **Skills section — skillbar** | Scroll into view (waypoint, triggerOnce, offset: windowHeight - elementHeight) | Width animates from 0 → data-percent over 2000ms | 2000ms | jQuery default (swing) | None | Disabled; CSS sets width immediately | Framer Motion `animate` `scaleX` or `width` on `inView`, `duration: 2` |
| **Clients / logo strip** | Load | Owl Carousel with 5 logo images; `fadeInUp` animation with 200–600ms stagger per logo | animate.css ~600ms | ease | 200ms increments | Carousel still active | CSS marquee (auto-scroll) or Framer motion carousel |
| **Logo hover** | Hover | Implied: opacity/filter change (standard Owl Carousel hover) | 300ms | ease | — | No hover on touch | CSS `hover:opacity-100 hover:scale-110 transition` |
| **Portfolio grid** | Load | Custom JS filter (not Isotope): `.portfolio-link` items; inactive items get `opacity:0.2, scale(0.9)` over 500ms | 500ms | ease-in-out | — | Same | Category filter with Framer Motion layout animation |
| **Portfolio card — hover image** | Hover | `img`: scale(1.3) rotate(3deg) over **3400ms** (yes, very slow zoom), opacity 0.6 | 3400ms | ease | — | No hover | `whileHover` scale(1.05), faster at 400ms |
| **Portfolio card — hover overlay** | Hover | `.info` slides from `top: 220px, opacity:0` → `top:120px, opacity:1` over 400ms | 400ms | ease | — | Active state used instead | Framer motion overlay animate |
| **Portfolio — project open** | Click | Magnific Popup lightbox: overlay fades in, content fades/scales in | ~400ms | ease | — | Same | AnimatePresence modal, scale 0.97→1 + opacity |
| **Timeline (CV)** | Static | Two-column alternating layout (Bootstrap grid); items alternate left/right; centre vertical line (3px, `#eee`); circle badges (50px, colored); NO animated line draw — static | — | — | — | Single column | Timeline with scroll-reveal per item; static vertical line |
| **Timeline items** | Scroll (implied via `.animated` class check) | `fadeInUp` on each panel | ~600ms | ease | Staggered | Static on mobile | Framer Motion `whileInView` stagger |
| **Call-to-action / Hire banner** | Static | Dark `#2F3238` background, white text; no animation | — | — | — | Same | Gradient bg + subtle pulse on badge |
| **Contact form — submit** | Click | Button text changes to spinning FA cog + "SENDING", disabled; on success/error: reverts to checkmark + "SUBMIT"; response HTML injected | ~instant state change | — | — | Same | React state machine: idle→loading→success/error |
| **Back-to-top button** | ScrollY > threshold | Not found in source (may be in colorscheme or init JS) | — | — | — | — | Fixed button, opacity 0→1 on scroll, smooth scroll |
| **Section dividers** | Static | SVG triangle divider between sections (see `#clients` SVG path) | — | — | — | Same | CSS clip-path or SVG wave |
| **Social icons — hover** | Hover | `rotate(360deg)` on icon container over 500ms, inner FA icon `scale(1.8)` over 300ms | 500ms / 300ms | ease | — | No hover | `whileHover: { rotate: 360 }` |
| **Smooth scroll** | Nav link click | `$.scrollTo` with 750ms `easeOutExpo` | 750ms | easeOutExpo (cubic-bezier) | — | Same | CSS `scroll-behavior: smooth` + JS `scrollIntoView` |

---

## CSS Keyframes Found
animate.css is loaded but custom `@keyframes` are **not** in `main.css`. All named animations (`fadeInUp`, `fadeInLeft`, etc.) come from `animate.css`.

Key CSS transitions in `main.css`:
```css
/* Navbar */
transition: background 500ms ease-in-out, padding 500ms ease-in-out;

/* Logo border (navbar brand) */
transition: all 1s ease-in-out;

/* Nav links */
transition: all 1s ease-in-out;
transition: border-bottom-color 1s ease-in-out;  /* active indicator */

/* General links */
transition: color 500ms ease 0s;

/* Buttons */
transition: all 500ms ease 0s;

/* Social icons */
transition: all 500ms ease 0s;    /* container */
transition: all 300ms ease 0s;    /* icon inside */

/* Portfolio card image (slow ken-burns zoom) */
transition: all 3400ms ease 0s;

/* Portfolio overlay */
transition: all 400ms ease 0s;

/* Portfolio inactive filter */
transition: all 500ms ease-in-out;

/* Skillbar fill */
transition: width 2000ms + background-color 400ms linear;

/* Carousel fade */
transition: opacity 500ms ease-in-out;
```

---

## Mobile Differences
1. Navbar always in collapsed/solid state (no transparent phase)
2. `top-nav-collapse` class added immediately on `width <= 768`
3. Skillbar animation **disabled** on Android/iOS — widths set via CSS instantly
4. `scrollAnim` / waypoint animations **disabled** on mobile — `.animated` elements just made visible immediately
5. Skrollr parallax **disabled** on touch devices (Modernizr.touch check)
6. Hero video background replaced with static image on touch
7. Social icon hover effects don't fire on touch

---

## Section Structure (HTML order)
```
#preloader          → Full-screen loading overlay
nav.navbar          → Sticky top nav
#head               → Full-screen hero (video bg + photo + name + title)
#welcome            → About + skills bars + facts table
#offers             → "What I do" — 3 feature cards
#clients            → Logo carousel strip (SVG triangle divider above)
#cv                 → Timeline CV (alternating two-column)
#portfolio          → Project grid with filter + lightbox
[callToAction]      → Hire-me dark banner
#contact            → Contact form + map
footer              → Footer
```

---

## 2026 Modernization Decisions
| Original | Problem | 2026 Replacement |
|---|---|---|
| jQuery + Bootstrap 3 | Heavy, legacy | React + Tailwind |
| animate.css + Waypoints | CSS class injection, no React | Framer Motion `whileInView` |
| Owl Carousel | jQuery plugin | CSS marquee / Framer drag |
| Magnific Popup | jQuery lightbox | AnimatePresence accessible modal |
| Skillbar jQuery plugin | Fake percentages, jQuery | Framer Motion + proficiency labels |
| Skrollr parallax | Desktop-only, heavy | Framer Motion `useScroll`+`useTransform` (subtle) |
| YouTube video hero | Privacy, heavy, flash-era | Animated gradient + floating blobs |
| PHP contact form | Requires server | Web3Forms (serverless) |
| `scrollTo` with easeOutExpo | jQuery | CSS `scroll-behavior: smooth` |
| `rotate(360deg)` on social icons | Tacky | Subtle `scale(1.1)` on hover |
| Static line in timeline | No animation | SVG line draw on scroll with Framer Motion pathLength |
| SVG triangle section dividers | Awkward | CSS clip-path wave dividers |
