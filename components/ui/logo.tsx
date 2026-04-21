import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** Rendered size in px (width = height). Defaults to 36 (h-9 w-9). */
  size?: number
  /** Extra classes applied to the wrapper (e.g. to override rounding / margins). */
  className?: string
  /** Accessible label for screen readers. */
  alt?: string
  /** Prioritize loading (used in above-the-fold headers). */
  priority?: boolean
}

/**
 * ModelX brand mark.
 * The source SVG already has its own black background with the "X" mark cut
 * into it, so it's rendered as a self-contained square with rounded corners
 * to match the rest of the UI's visual language.
 */
export function Logo({
  size = 36,
  className,
  alt = 'ModelX',
  priority = false,
}: LogoProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-foreground',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/modelx-logo-mark.svg"
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </span>
  )
}
