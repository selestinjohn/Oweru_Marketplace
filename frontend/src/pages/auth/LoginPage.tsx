import { LoginForm } from '@/features/auth/components/LoginForm'
import { usePageTitle } from '@/hooks/usePageTitle'

export function LoginPage() {
  usePageTitle('Log in')

  return <LoginForm />
}
