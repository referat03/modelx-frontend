export interface TokenPackage {
  id: string
  name: string
  tokens: number
  price: number
  isPopular?: boolean
}

export const tokenPackages: TokenPackage[] = [
  { id: 'small', name: '100 токенов', tokens: 100, price: 199 },
  { id: 'medium', name: '500 токенов', tokens: 500, price: 899, isPopular: true },
  { id: 'large', name: '1000 токенов', tokens: 1000, price: 1490 },
]

export function formatTokensPrice(price: number): string {
  return `${price} ₽`
}

export function getPackageById(id: string): TokenPackage | undefined {
  return tokenPackages.find(pkg => pkg.id === id)
}
