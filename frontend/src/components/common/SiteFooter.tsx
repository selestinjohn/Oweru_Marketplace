import { Link } from 'react-router-dom'
import { OweruLogo } from '@/components/navigation/OweruLogo'
import { routePaths } from '@/constants/routes'

const footerColumns = [
  {
    links: [
      { label: 'Properties', to: routePaths.properties },
      { label: 'For Sale', to: `${routePaths.properties}?transactionType=sale` },
      { label: 'For Rent', to: `${routePaths.properties}?transactionType=rent` },
      { label: 'Land', to: `${routePaths.properties}?propertyType=land` },
    ],
    title: 'Marketplace',
  },
  {
    links: [
      { label: 'Verify', to: '/#verify' },
      { label: 'Professionals', to: '/#services' },
    ],
    title: 'Services',
  },
  {
    links: [
      { label: 'About', to: '/#why-oweru' },
      { label: 'Resources', to: '/#how-it-works' },
      { label: 'Contact', to: '/#cta' },
    ],
    title: 'Company',
  },
  {
    links: [
      { label: 'Log in', to: routePaths.login },
      { label: 'Sign up', to: routePaths.register },
      { label: 'Privacy', to: '/#privacy' },
      { label: 'Terms', to: '/#terms' },
    ],
    title: 'Account',
  },
] as const

function FooterLink({
  label,
  to,
}: {
  label: string
  to: string
}) {
  const className =
    'text-sm text-primary-foreground/68 transition hover:text-gold'

  if (to.startsWith('/#')) {
    return (
      <a className={className} href={to}>
        {label}
      </a>
    )
  }

  return (
    <Link className={className} to={to}>
      {label}
    </Link>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto grid w-full max-w-[1380px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_2fr] lg:px-8">
        <div>
          <Link
            className="inline-flex rounded-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            to={routePaths.home}
          >
            <OweruLogo tone="light" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/68">
            A trusted marketplace for discovering verified property
            opportunities, professional support, and clearer transaction
            workflows across Tanzania.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="font-display text-base font-bold">{column.title}</h2>
              <ul className="mt-3 grid gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink label={link.label} to={link.to} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-3 px-4 py-5 text-sm text-primary-foreground/58 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {new Date().getFullYear()} OWERU Marketplace.</p>
          <p>Secure. Verified. Trusted Real Estate Transactions.</p>
        </div>
      </div>
    </footer>
  )
}
