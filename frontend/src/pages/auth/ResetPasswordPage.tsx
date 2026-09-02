import { ArrowLeft, KeyRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { AuthFormHeader } from '@/features/auth/components/AuthFormHeader'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { OutlineButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { usePageTitle } from '@/hooks/usePageTitle'

export function ResetPasswordPage() {
  usePageTitle('Reset password')

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b bg-surface px-5 py-6 sm:px-7">
        <AuthFormHeader
          icon={KeyRound}
          title="Create a new password"
          description="This route is ready for token-based reset integration once the backend reset contract is available."
        />
      </div>

      <div className="grid gap-5 p-5 sm:p-7">
        <PasswordField
          autoComplete="new-password"
          disabled
          label="New password"
          placeholder="Create a new password"
        />
        <PasswordField
          autoComplete="new-password"
          disabled
          label="Confirm password"
          placeholder="Confirm new password"
          helperText="Reset tokens are never stored in application storage."
        />
        <OutlineButton disabled type="button">
          Update password
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
