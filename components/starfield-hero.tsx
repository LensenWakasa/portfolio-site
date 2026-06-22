"use client"

import { useEffect, useRef } from "react"

type Star = {
  x: number
  y: number
  r: number
  baseAlpha: number
  twinkle: number
  speed: number
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let stars: Star[] = []
    let raf = 0
    let width = 0
    let height = 0

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.floor((width * height) / 6000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.004,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      for (const s of stars) {
        s.twinkle += s.speed
        const alpha = s.baseAlpha + Math.sin(s.twinkle) * 0.25
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 237, 214, ${Math.max(0, alpha)})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    if (reduceMotion) {
      draw()
      cancelAnimationFrame(raf)
    } else {
      draw()
    }

    window.addEventListener("resize", resize)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
