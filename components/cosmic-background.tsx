'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  twinkleSpeed: number
  twinklePhase: number
}

interface Planet {
  x: number
  y: number
  size: number
  color: string
  speed: number
  active: boolean
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const planetRef = useRef<Planet | null>(null)
  const animationRef = useRef<number>(0)
  const lastPlanetTime = useRef<number>(0)

  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = []
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }
    starsRef.current = stars
  }, [])

  const createPlanet = useCallback((width: number, height: number): Planet => {
    const isSun = Math.random() > 0.5
    return {
      x: -100,
      y: Math.random() * height * 0.6 + height * 0.1,
      size: Math.random() * 40 + 30,
      color: isSun ? 'rgba(255, 200, 100, 0.15)' : 'rgba(139, 92, 246, 0.12)',
      speed: Math.random() * 0.3 + 0.2,
      active: true,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars(canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const animate = (time: number) => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update stars
      starsRef.current.forEach((star) => {
        // Twinkle effect
        star.twinklePhase += star.twinkleSpeed
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7
        const currentOpacity = star.opacity * twinkle

        // Draw star with purple tint
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${currentOpacity})`
        ctx.fill()

        // Add glow effect for larger stars
        if (star.size > 1.5) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 2
          )
          gradient.addColorStop(0, `rgba(139, 92, 246, ${currentOpacity * 0.3})`)
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // Move star upward
        star.y -= star.speed

        // Reset star if it goes off screen
        if (star.y < -10) {
          star.y = canvas.height + 10
          star.x = Math.random() * canvas.width
        }
      })

      // Handle planet/sun
      if (time - lastPlanetTime.current > 30000 && !planetRef.current?.active) {
        planetRef.current = createPlanet(canvas.width, canvas.height)
        lastPlanetTime.current = time
      }

      if (planetRef.current?.active) {
        const planet = planetRef.current

        // Draw planet with glow
        const gradient = ctx.createRadialGradient(
          planet.x, planet.y, 0,
          planet.x, planet.y, planet.size * 2
        )
        gradient.addColorStop(0, planet.color)
        gradient.addColorStop(0.5, planet.color.replace(/[\d.]+\)$/, '0.05)'))
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2)
        ctx.fillStyle = planet.color
        ctx.fill()

        // Move planet
        planet.x += planet.speed

        // Deactivate if off screen
        if (planet.x > canvas.width + 100) {
          planet.active = false
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initStars, createPlanet])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
