/**
 * Single source of truth for token packages.
 *
 * Every UI surface that renders token-package cards (landing page section,
 * /buy-tokens page, purchase confirmation modal, profile balance, admin
 * tokens page) MUST consume this array directly — no local copies, no
 * hardcoded title overrides. If a name, token amount, price, badge, or
 * description is changed here, it propagates everywhere automatically.
 */
export interface TokenPackage {
  id: string
  /** Friendly display name shown on every card and inside purchase modals. */
  name: string
  /** Long-form description used in card bodies. Tokens count is interpolated
   *  through {tokens} so we keep one definition aligned with `tokens`. */
  description: string
  tokens: number
  price: number
  isPopular?: boolean
}

export const tokenPackages: TokenPackage[] = [
  {
    id: 'small',
    name: 'Мини',
    description: '100 токенов для использования в чате с AI-моделями',
    tokens: 100,
    price: 199,
  },
  {
    id: 'medium',
    name: 'Средний',
    description: '500 токенов для использования в чате с AI-моделями',
    tokens: 500,
    price: 899,
    isPopular: true,
  },
  {
    id: 'large',
    name: 'Большой',
    description: '1000 токенов для использования в чате с AI-моделями',
    tokens: 1000,
    price: 1490,
  },
]

export function formatTokensPrice(price: number): string {
  return `${price} ₽`
}

export function getPackageById(id: string): TokenPackage | undefined {
  return tokenPackages.find(pkg => pkg.id === id)
}
