import { ArrowLeft, Mail } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { AuthFormHeader } from '@/features/auth/components/AuthFormHeader'
import { Input } from '@/components/ui/Input'
import { OutlineButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { usePageTitle } from '@/hooks/usePageTitle'

export function ForgotPasswordPage() {
  usePageTitle('Forgot password')

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b bg-surface px-5 py-6 sm:px-7">
        <AuthFormHeader
          icon={Mail}
          title="Reset access"
          description="Password reset delivery is prepared in the UI and will connect when the OWERU auth endpoint is available."
        />
      </div>

      <div className="grid gap-5 p-5 sm:p-7">
        <Input
          disabled
          label="Email address"
          placeholder="you@example.com"
          type="email"
          helperText="API integration pending. No reset email is sent from this shell."
        />
        <OutlineButton disabled type="button">
          Send reset instructions
        </OutlineButton>
        <NavLink
          className="inline-flex items-center gap-2 text-sm font-bold text-accent transition hover:text-gold-hover"
          to={routePaths.login}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to login
        </NavLink>
      </div>
    </Card>
  )
}
