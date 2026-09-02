export function formatCurrency(value: number, currency = 'TZS') {
  return new Intl.NumberFormat('en-TZ', {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-TZ').format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-TZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function titleCase(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
