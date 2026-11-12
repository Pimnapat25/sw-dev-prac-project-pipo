"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/*
 * Dish Orbit Carousel: the item sits on the left; changing item swings it out
 * over the top on a wide orbit while the next one swings in from the other side.
 * The two-weight title wipes out and back in, the info card and its coloured
 * rating badge cross-fade, and a pastel arc behind the scene turns and takes the
 * item's colour. Page scroll drives it (the section pins); arrows, thumbnails,
 * the side pager, arrow keys and swipes jump too.
 *
 * Local changes vs. the original snippet:
 * - the embedded base64 font was removed (fontSrc defaults to null → host font)
 * - button / tab / eyebrow labels are props so it can be reused for equipment
 * - `pinScroll` prop lets the page opt out of scroll pinning
 */

export type Dish = {
  /** The thin first title line. */
  title: string
  /** The heavy second title line. */
  subtitle: string
  /** Square image, ideally a cut-out (transparent PNG/WebP/SVG). */
  image: string
  alt?: string
  /** Small line above the title. */
  eyebrow?: string
  /** Two-line label under the thumbnail. Defaults to title + subtitle. */
  label?: string
  rating: number
  chef: string
  kitchen?: string
  description: string
  likes: number
  ingredients?: string[]
  /** Badge and band colour: hex or rgb(). */
  accent: string
}

export type DishOrbitCarouselProps = {
  dishes: Dish[]
  height?: string
  backdrop?: string
  loop?: boolean
  /** Optional woff2 URL for the display face. null = host font. */
  fontSrc?: string | null
  /** Pin the section and drive it by page scroll. */
  pinScroll?: boolean
  playLabel?: string
  orderLabel?: string
  tabLabels?: [string, string]
  eyebrowFallback?: (index: number) => string
  likesLabel?: string
  onPlay?: (dish: Dish, index: number) => void
  onOrder?: (dish: Dish, index: number) => void
  onChange?: (index: number) => void
  className?: string
}

export function wrapIndex(i: number, n: number): number {
  if (n <= 0) return 0
  return ((Math.round(i) % n) + n) % n
}

export function stepDirection(from: number, to: number, n: number): 1 | -1 {
  if (n <= 0) return 1
  const fwd = (((to - from) % n) + n) % n
  return fwd <= n - fwd ? 1 : -1
}

export function scrollSteps(n: number, loop: boolean): number {
  return Math.max(0, loop ? n : n - 1)
}

export function segmentFor(i: number, current: number, n: number, loop: boolean): number {
  return loop && i === 0 && current > n / 2 ? n : i
}

export function stripStart(index: number, n: number, visible: number): number {
  if (n <= visible) return 0
  return Math.max(0, Math.min(index - 1, n - visible))
}

export function fitSize(chars: number, max: number, width: number, em: number): number {
  return Math.min(max, width / (Math.max(1, chars) * em))
}

export function arcPath(a0: number, a1: number, cx: number, cy: number, r: number, w: number, steps = 48): string {
  const outer: string[] = []
  const inner: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45)
    const c = Math.cos(a)
    const s = Math.sin(a)
    outer.push((cx + c * (r + h)).toFixed(1) + " " + (cy + s * (r + h)).toFixed(1))
    inner.push((cx + c * (r - h)).toFixed(1) + " " + (cy + s * (r - h)).toFixed(1))
  }
  return "M" + outer.join("L") + "L" + inner.reverse().join("L") + "Z"
}

export const ARC_REST = [[50, 98], [46, 124], [60, 126], [40, 100]]
export function arcRest(index: number): number[] {
  return ARC_REST[((index % ARC_REST.length) + ARC_REST.length) % ARC_REST.length]
}

export const ARC_SWEEP = [38, 146]

const ORBIT_X = 299
const ORBIT_Y = -450
const ORBIT_R = 650
const SCROLL_PER_DISH = 0.7
const SWING = 50
const ITEM = 118
const VISIBLE = 4

const FONT = "dsh-face"

const CSS =
  ".dsh-trk{position:relative;width:100%}" +
  ".dsh-root{position:sticky;top:0;overflow:hidden;width:100%;background:var(--color-background);color:var(--color-foreground);" +
  "font-family:" + FONT + ",var(--font-sans),ui-sans-serif,system-ui,sans-serif;container-type:inline-size;-webkit-tap-highlight-color:transparent}" +
  ".dsh-root *{box-sizing:border-box}" +
  ".dsh-bd{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;pointer-events:none}" +
  ".dsh-wash{position:absolute;inset:0;background:color-mix(in oklab,var(--color-background) 38%,transparent);pointer-events:none}" +
  ".dsh-dim{position:absolute;inset:0;background:var(--color-background);mix-blend-mode:multiply;opacity:.72;pointer-events:none}" +
  ".dsh-root:focus-visible{outline:2px solid var(--color-pink-dark);outline-offset:-4px}" +
  ".dsh-canvas{position:absolute;left:50%;top:50%;width:960px;height:520px;transform:translate(-50%,-50%) scale(var(--dsh-s,1));transform-origin:50% 50%}" +
  ".dsh-arc{position:absolute;left:0;top:0;width:960px;height:520px;overflow:visible;pointer-events:none}" +
  ".dsh-btn{appearance:none;border:0;background:none;color:inherit;font:inherit;padding:0;margin:0;cursor:pointer}" +
  ".dsh-btn:focus-visible{outline:2px solid var(--color-pink-dark);outline-offset:3px;border-radius:10px}" +
  ".dsh-ico{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}" +
  ".dsh-pager{position:absolute;left:76px;top:172px;display:flex;flex-direction:column;align-items:center;gap:7px}" +
  ".dsh-dot{width:14px;height:10px;display:grid;place-items:center;transition:height .45s cubic-bezier(.3,.7,.2,1)}" +
  ".dsh-dot i{display:block;width:3px;height:3px;border-radius:3px;background:var(--color-foreground);opacity:.45;transition:height .45s cubic-bezier(.3,.7,.2,1),opacity .3s}" +
  ".dsh-dot[aria-current] i{height:22px;opacity:.9}" +
  ".dsh-dot[aria-current]{height:26px}" +
  ".dsh-plates{position:absolute;left:130px;top:82px;width:245px;height:245px;touch-action:pan-y}" +
  ".dsh-orbit{position:absolute;inset:0;transform-origin:69% -217%;visibility:hidden;will-change:transform}" +
  ".dsh-orbit>img{display:block;width:245px;height:245px;max-width:none;object-fit:contain;user-select:none;-webkit-user-drag:none;" +
  "filter:drop-shadow(0 16px 22px rgba(0,0,0,.2)) drop-shadow(0 3px 5px rgba(0,0,0,.12))}" +
  ".dsh-head{position:absolute;left:388px;top:96px;width:330px;height:150px}" +
  ".dsh-hd{position:absolute;inset:0;visibility:hidden}" +
  ".dsh-eye{font-size:12.5px;font-weight:600;letter-spacing:.01em;margin:0 0 4px 2px}" +
  ".dsh-t1,.dsh-t2{display:block;white-space:nowrap;line-height:1;text-transform:uppercase;margin:0}" +
  ".dsh-t1{font-weight:200;letter-spacing:-.015em;margin-top:6px}" +
  ".dsh-t2{font-weight:800;letter-spacing:-.025em;margin-top:6px;color:color-mix(in oklab,var(--color-foreground) 86%,transparent)}" +
  ".dsh-acts{position:absolute;left:396px;top:280px;display:flex;gap:44px;font-size:12.5px;font-weight:500}" +
  ".dsh-acts .dsh-btn{display:flex;align-items:center;gap:9px;padding:4px 0}" +
  ".dsh-acts .dsh-ico{width:13px;height:13px}" +
  ".dsh-acts .dsh-fill{fill:currentColor;stroke:none}" +
  ".dsh-card{position:absolute;left:722px;top:137px;width:223px;padding:18px 20px 20px;border-radius:20px;" +
  "background:color-mix(in oklab,var(--color-background) 72%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);" +
  "box-shadow:0 1px 0 color-mix(in oklab,var(--color-foreground) 6%,transparent) inset,0 18px 40px -24px rgba(0,0,0,.25)}" +
  ".dsh-tabs{display:flex;justify-content:space-between;padding:0 6px 0 20px;font-size:12px;margin-bottom:20px}" +
  ".dsh-tab{color:var(--color-grey);font-weight:500;padding:3px 0}" +
  ".dsh-tab[aria-selected=true]{color:var(--color-foreground);font-weight:600}" +
  ".dsh-bodies{display:grid}" +
  ".dsh-body{grid-area:1/1;visibility:hidden}" +
  ".dsh-rate{position:relative;height:62px;margin:0 0 14px 6px}" +
  ".dsh-badge{position:absolute;left:0;top:0;width:46px;height:62px;border-radius:10px}" +
  ".dsh-badge svg{position:absolute;left:17px;bottom:9px;width:12px;height:12px;fill:var(--color-foreground);opacity:.8}" +
  ".dsh-num{position:absolute;left:10px;top:4px;font-size:36px;font-weight:700;letter-spacing:-.04em;line-height:1}" +
  ".dsh-chef{font-size:19px;font-weight:600;letter-spacing:-.01em;margin:0}" +
  ".dsh-kit{font-size:10.5px;color:var(--color-grey);margin:3px 0 12px}" +
  ".dsh-desc{font-size:12.5px;line-height:1.38;margin:0;min-height:52px}" +
  ".dsh-ing{display:flex;flex-wrap:wrap;gap:5px;margin:0;padding:0;list-style:none;min-height:52px}" +
  ".dsh-ing li{font-size:11px;padding:4px 9px;border-radius:99px;background:color-mix(in oklab,var(--color-foreground) 7%,transparent)}" +
  ".dsh-react{display:flex;gap:12px;margin-top:20px}" +
  ".dsh-like{display:flex;align-items:center;gap:8px;height:34px;padding:0 14px 0 10px;border-radius:99px;font-size:10.5px;" +
  "background:color-mix(in oklab,var(--color-foreground) 6%,transparent);transition:background .25s}" +
  ".dsh-strip{position:absolute;left:130px;top:362px;width:550px;height:122px;display:flex;align-items:center}" +
  ".dsh-arrow{width:36px;height:36px;display:grid;place-items:center;flex:none}" +
  ".dsh-arrow svg{width:12px;height:16px;fill:currentColor}" +
  ".dsh-win{position:relative;width:" + ITEM * VISIBLE + "px;height:122px;overflow:hidden;flex:none;margin:0 2px;" +
  "-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}" +
  ".dsh-track{position:absolute;left:0;top:0;display:flex;transition:transform .6s cubic-bezier(.65,0,.35,1)}" +
  ".dsh-th{width:" + ITEM + "px;height:122px;display:flex;justify-content:center;padding-top:3px}" +
  ".dsh-th .dsh-btn{width:80px;height:116px;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:7px;padding-top:9px;transition:background .45s}" +
  ".dsh-th .dsh-btn[aria-current]{background:color-mix(in oklab,var(--color-background) 62%,transparent);box-shadow:0 10px 24px -16px rgba(0,0,0,.3)}" +
  ".dsh-th img{width:56px;height:56px;max-width:none;object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,.18));transition:transform .45s}" +
  ".dsh-th .dsh-btn[aria-current] img{transform:scale(1.06)}" +
  ".dsh-th span{font-size:10px;line-height:1.25;text-align:center;font-weight:500;color:color-mix(in oklab,var(--color-foreground) 78%,transparent);max-width:78px}" +
  ".dsh-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  "@container (max-width:639px){" +
  ".dsh-canvas{position:relative;left:auto;top:auto;width:100%;height:auto;transform:none;display:flex;flex-direction:column;align-items:center;padding:14px 16px 18px}" +
  ".dsh-arc{width:200%;height:auto;left:-60%;top:-30px}" +
  ".dsh-pager{left:14px;top:150px}" +
  ".dsh-plates{position:relative;left:auto;top:auto;width:min(52vw,32svh);height:min(52vw,32svh);margin-top:0}" +
  ".dsh-orbit>img{width:100%;height:100%}" +
  ".dsh-head{position:relative;left:auto;top:auto;width:100%;height:132px;margin-top:10px}" +
  ".dsh-hd{text-align:center;transform:scale(.78);transform-origin:50% 0}" +
  ".dsh-acts{position:relative;left:auto;top:auto;margin-top:4px}" +
  ".dsh-card{position:relative;left:auto;top:auto;width:100%;max-width:420px;margin-top:12px}" +
  ".dsh-strip{display:none}" +
  "}" +
  "@media (prefers-reduced-motion:reduce){.dsh-track,.dsh-dot,.dsh-dot i,.dsh-th .dsh-btn,.dsh-th img,.dsh-like{transition:none}}"

const HIDE_1 = "inset(0% 0% 0% 100%)"
const HIDE_2 = "inset(0% 100% 0% 0%)"
const SHOW = "inset(0% 0% 0% 0%)"

const Icon = {
  play: <svg className="dsh-ico dsh-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5v17l14-8.5z" /></svg>,
  order: <svg className="dsh-ico dsh-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5 3 15h18zM3 18h18v2.5H3z" /></svg>,
  up: <svg className="dsh-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v10H3.5V10zM7 10l4-7c1.6 0 2.6 1.2 2.2 2.8L12.6 9H19a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.7 20H7" /></svg>,
}

export function DishOrbitCarousel({
  dishes,
  height = "100svh",
  backdrop,
  loop = true,
  fontSrc = null,
  pinScroll = true,
  playLabel = "Play video",
  orderLabel = "Order food",
  tabLabels = ["Overview", "Ingredients"],
  eyebrowFallback = (i) => "#" + (i + 1) + " Most loved",
  likesLabel = "likes",
  onPlay,
  onOrder,
  onChange,
  className,
}: DishOrbitCarouselProps) {
  const n = dishes.length
  const [index, setIndex] = useState(0)
  const [tab, setTab] = useState(0)
  const [liked, setLiked] = useState({} as Record<number, boolean>)

  const trackRef = useRef(null as HTMLDivElement | null)
  const rootRef = useRef(null as HTMLDivElement | null)
  const stRef = useRef(null as ScrollTrigger | null)
  const segRef = useRef(0)
  const indexRef = useRef(0)
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  const orbits = useRef([] as (HTMLDivElement | null)[])
  const heads = useRef([] as (HTMLDivElement | null)[])
  const bodies = useRef([] as (HTMLDivElement | null)[])
  const arcRef = useRef(null as SVGPathElement | null)
  const arc = useRef({ a0: 0, a1: 0 })
  const shown = useRef(-1)
  const dirRef = useRef(1 as 1 | -1)
  const tlRef = useRef(null as gsap.core.Timeline | null)
  const reducedRef = useRef(false)
  const swipe = useRef(null as { x: number; y: number } | null)

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const fit = () => {
      el.style.setProperty("--dsh-s", String(Math.min(el.clientWidth / 960, el.clientHeight / 520, 1.6)))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => (reducedRef.current = mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  useLayoutEffect(() => {
    const from = shown.current
    const to = index
    const parts = (i: number) => {
      const head = heads.current[i]
      return {
        orbit: orbits.current[i],
        head,
        eye: head && head.querySelector(".dsh-eye"),
        t1: head && head.querySelector(".dsh-t1"),
        t2: head && head.querySelector(".dsh-t2"),
        body: bodies.current[i],
      }
    }
    const drawArc = () => arcRef.current?.setAttribute("d", arcPath(arc.current.a0, arc.current.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118))
    const rest = arcRest(to)
    const tint = dishes[to] ? dishes[to].accent : "transparent"
    if (tlRef.current) tlRef.current.progress(1).kill()
    const b = parts(to)
    if (from === -1 || from === to || reducedRef.current) {
      for (let i = 0; i < n; i++) if (i !== to) {
        const p = parts(i)
        gsap.set([p.orbit, p.head, p.body], { autoAlpha: 0 })
      }
      gsap.set([b.orbit, b.head, b.body, b.eye], { autoAlpha: 1, rotation: 0, y: 0 })
      gsap.set(b.t1, { clipPath: SHOW })
      gsap.set(b.t2, { clipPath: SHOW })
      arc.current.a0 = rest[0]
      arc.current.a1 = rest[1]
      drawArc()
      if (arcRef.current) gsap.set(arcRef.current, { fill: tint })
      shown.current = to
      return
    }
    const a = parts(from)
    const d = dirRef.current
    const tl = gsap.timeline({ onComplete: () => { tlRef.current = null } })
    tlRef.current = tl
    tl.to(a.orbit, { rotation: SWING * d, duration: 0.62, ease: "power2.in" }, 0)
      .set(a.orbit, { autoAlpha: 0, rotation: 0 }, 0.62)
      .fromTo(b.orbit, { autoAlpha: 1, rotation: -SWING * d }, { rotation: 0, duration: 0.95, ease: "power3.out" }, 0.3)
    tl.to(a.t1, { clipPath: HIDE_1, duration: 0.42, ease: "power2.in" }, 0)
      .to(a.t2, { clipPath: HIDE_2, duration: 0.42, ease: "power2.in" }, 0.06)
      .to(a.eye, { autoAlpha: 0, duration: 0.25 }, 0)
      .set(a.head, { autoAlpha: 0 }, 0.5)
      .set(b.head, { autoAlpha: 1 }, 0.5)
      .fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.55)
      .fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.55)
      .fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.62)
    tl.to(a.body, { autoAlpha: 0, y: -6, duration: 0.3, ease: "power1.in" }, 0.05)
      .set(b.body, { autoAlpha: 1, y: 0 }, 0.4)
    if (b.body) tl.fromTo(b.body.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0.4)
    tl.to(arc.current, { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: 0.6, ease: "power2.inOut", onUpdate: drawArc }, 0)
      .to(arc.current, { a0: rest[0], a1: rest[1], duration: 0.85, ease: "power3.out", onUpdate: drawArc }, 0.6)
    if (arcRef.current) tl.to(arcRef.current, { fill: tint, duration: 1.1, ease: "power1.inOut" }, 0.1)
    shown.current = to
  }, [index, n, dishes])

  useEffect(() => () => { tlRef.current?.kill() }, [])

  const select = (next: number, dir: 1 | -1) => {
    if (next === indexRef.current) return
    dirRef.current = dir
    indexRef.current = next
    setIndex(next)
    onChangeRef.current?.(next)
  }

  const steps = pinScroll ? scrollSteps(n, loop) : 0
  useEffect(() => {
    const track = trackRef.current
    if (!track || steps < 1) return
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      snap: { snapTo: 1 / steps, duration: { min: 0.3, max: 0.8 }, delay: 0.08, ease: "power2.inOut" },
      onUpdate: (self) => {
        if (loop && self.progress >= 1 && self.direction > 0) {
          segRef.current = 0
          self.scroll(self.start + 1)
          select(0, 1)
          return
        }
        const seg = Math.round(self.progress * steps)
        if (seg === segRef.current) return
        const dir = seg > segRef.current ? 1 : -1
        segRef.current = seg
        select(wrapIndex(seg, n), dir)
      },
    })
    stRef.current = trigger
    return () => {
      trigger.kill()
      stRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, loop, n])

  const go = (to: number, dir?: 1 | -1) => {
    if (n < 2) return
    const next = wrapIndex(to, n)
    if (next === index) return
    const st = stRef.current
    const y = st ? st.scroll() : 0
    if (st && y >= st.start - 1 && y <= st.end + 1) {
      const seg = segmentFor(next, segRef.current, n, loop)
      segRef.current = seg
      st.scroll(st.start + ((st.end - st.start) * seg) / steps)
    }
    select(next, dir ?? stepDirection(index, next, n))
  }
  const step = (d: 1 | -1) => go(index + d, d)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1) }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1) }
  }
  const onPointerDown = (e: React.PointerEvent) => { swipe.current = { x: e.clientX, y: e.clientY } }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s) return
    const dx = e.clientX - s.x
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) step(dx < 0 ? 1 : -1)
  }

  const start = stripStart(index, n, VISIBLE)
  const dish = dishes[index]

  return (
    <div ref={trackRef} className={"dsh-trk" + (className ? " " + className : "")} style={{ height: "calc(" + height + " * " + (1 + steps * SCROLL_PER_DISH) + ")" }}>
      <div ref={rootRef} className="dsh-root" style={{ height }} role="region" aria-roledescription="carousel" aria-label="Featured" tabIndex={0} onKeyDown={onKeyDown}>
        <style>
          {(fontSrc ? "@font-face{font-family:" + FONT + ";src:url(" + fontSrc + ") format('woff2');font-weight:100 900;font-display:swap}" : "") + CSS}
        </style>
        {backdrop ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="dsh-bd" src={backdrop} alt="" width={1200} height={900} />
        ) : null}
        {backdrop ? <div className="dsh-dim" /> : null}
        {backdrop ? <div className="dsh-wash" /> : null}

        <div className="dsh-canvas">
          <svg className="dsh-arc" viewBox="0 0 960 520" aria-hidden="true">
            <path ref={arcRef} style={{ opacity: 0.34 }} />
          </svg>

          <div className="dsh-pager" role="tablist" aria-label="Choose an item">
            {dishes.map((d, i) => (
              <button key={i} type="button" role="tab" className="dsh-btn dsh-dot" aria-selected={i === index}
                aria-current={i === index ? "true" : undefined} aria-label={d.title + " " + d.subtitle} onClick={() => go(i)}>
                <i />
              </button>
            ))}
          </div>

          <div className="dsh-plates" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)}>
            {dishes.map((d, i) => (
              <div key={i} ref={(el) => { orbits.current[i] = el }} className="dsh-orbit" aria-hidden={i !== index}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.image} alt={d.alt ?? d.title + " " + d.subtitle} width={245} height={245} draggable={false} />
              </div>
            ))}
          </div>

          <div className="dsh-head" aria-live="polite">
            {dishes.map((d, i) => (
              <div key={i} ref={(el) => { heads.current[i] = el }} className="dsh-hd" aria-hidden={i !== index}>
                <p className="dsh-eye">{d.eyebrow ?? eyebrowFallback(i)}</p>
                <h2 style={{ margin: 0, font: "inherit" }}>
                  <span className="dsh-t1" style={{ fontSize: fitSize(d.title.length, 56, 330, 0.56) + "px" }}>{d.title}</span>
                  <span className="dsh-t2" style={{ fontSize: fitSize(d.subtitle.length, 62, 320, 0.64) + "px" }}>{d.subtitle}</span>
                </h2>
              </div>
            ))}
          </div>

          <div className="dsh-acts">
            {onPlay ? <button type="button" className="dsh-btn" onClick={() => dish && onPlay(dish, index)}>{Icon.play}{playLabel}</button> : null}
            {onOrder ? <button type="button" className="dsh-btn" onClick={() => dish && onOrder(dish, index)}>{Icon.order}{orderLabel}</button> : null}
          </div>

          <div className="dsh-card">
            <div className="dsh-tabs" role="tablist" aria-label="Details">
              {tabLabels.map((t, ti) => (
                <button key={t} type="button" role="tab" className="dsh-btn dsh-tab" aria-selected={tab === ti} onClick={() => setTab(ti)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="dsh-bodies">
              {dishes.map((d, i) => (
                <div key={i} ref={(el) => { bodies.current[i] = el }} className="dsh-body" aria-hidden={i !== index}>
                  <div className="dsh-rate">
                    <div className="dsh-badge" style={{ background: d.accent }} />
                    <span className="dsh-num">{d.rating.toLocaleString("en-US")}</span>
                  </div>
                  <p className="dsh-chef">{d.chef}</p>
                  <p className="dsh-kit">{d.kitchen ?? " "}</p>
                  {tab === 0 || !d.ingredients?.length ? (
                    <p className="dsh-desc">{d.description}</p>
                  ) : (
                    <ul className="dsh-ing">{d.ingredients.map((x) => <li key={x}>{x}</li>)}</ul>
                  )}
                  <div className="dsh-react">
                    <button type="button" className="dsh-btn dsh-like" aria-pressed={!!liked[i]} tabIndex={i === index ? 0 : -1}
                      onClick={() => setLiked((s) => ({ ...s, [i]: !s[i] }))}>
                      {Icon.up}{d.likes + (liked[i] ? 1 : 0)} {likesLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dsh-strip">
            <button type="button" className="dsh-btn dsh-arrow" aria-label="Previous" onClick={() => step(-1)}>
              <svg viewBox="0 0 12 16" aria-hidden="true"><path d="M11 0v16L0 8z" /></svg>
            </button>
            <div className="dsh-win">
              <div className="dsh-track" style={{ transform: "translateX(" + -start * ITEM + "px)" }}>
                {dishes.map((d, i) => (
                  <div key={i} className="dsh-th">
                    <button type="button" className="dsh-btn" aria-current={i === index ? "true" : undefined} onClick={() => go(i)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.image} alt="" width={56} height={56} draggable={false} />
                      <span>{d.label ?? d.title + " " + d.subtitle}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button type="button" className="dsh-btn dsh-arrow" aria-label="Next" onClick={() => step(1)}>
              <svg viewBox="0 0 12 16" aria-hidden="true"><path d="M1 0v16l11-8z" /></svg>
            </button>
          </div>
        </div>
        <p className="dsh-sr" aria-live="polite">{dish ? "Item " + (index + 1) + " of " + n + ": " + dish.title + " " + dish.subtitle : ""}</p>
      </div>
    </div>
  )
}

export default DishOrbitCarousel
