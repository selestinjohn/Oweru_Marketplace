import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { usePageTitle } from '@/hooks/usePageTitle'

export function RegisterPage() {
  usePageTitle('Create account')

  return <RegisterForm />
}
