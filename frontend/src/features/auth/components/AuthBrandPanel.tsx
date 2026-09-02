import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { OweruLogo } from '@/components/navigation/OweruLogo'
import {
  authTrustPoints,
  authVisualImage,
} from '@/features/auth/data/authContent'

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-primary p-8 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-10">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        src={authVisualImage}
        alt="Elegant residential interior representing secure property access"
      />
      <div className="absolute inset-0 bg-primary/72" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-primary" />

      <div className="relative">
        <OweruLogo tone="light" />
      </div>

      <div className="relative max-w-xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 text-xs font-bold uppercase text-gold">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Secure marketplace identity
        </p>
        <h2 className="mt-5 font-display text-4xl font-bold leading-tight xl:text-5xl">
          One account for property discovery, verification and safer next steps.
        </h2>
        <p className="mt-4 max-w-lg text-base leading-7 text-primary-foreground/78">
          Sign in to continue through a marketplace experience designed around
          clearer information, accountable participants and structured records.
        </p>
        <div className="mt-7 grid gap-3">
          {authTrustPoints.map((point) => (
            <span
              className="flex items-center gap-3 text-sm font-semibold text-primary-foreground/86"
              key={point}
            >
              <CheckCircle2 className="size-4 text-gold" aria-hidden="true" />
              {point}
            </span>
          ))}
        </div>
      </div>

      <p className="relative text-xs leading-5 text-primary-foreground/58">
        OWERU Marketplace protects the frontend experience. The Django backend
        remains the authority for identity, roles and permissions.
      </p>
    </aside>
  )
}
