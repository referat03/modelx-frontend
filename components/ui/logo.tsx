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
 * The source asset is already a self-contained black square with the "X"
 * carved into it, so we render it directly with rounded corners — no outer
 * colored wrapper — to avoid a "logo inside a box" double-layer look.
 */
export function Logo({
  size = 36,
  className,
  alt = 'ModelX',
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/modelx-logo-mark.png"
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn('shrink-0 rounded-lg object-contain', className)}
      style={{ width: size, height: size }}
    />
  )
}
