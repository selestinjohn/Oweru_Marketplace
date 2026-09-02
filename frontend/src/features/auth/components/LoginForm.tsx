import { useState } from 'react'
import type { FieldPath } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2, LockKeyhole } from 'lucide-react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthErrorAlert } from '@/features/auth/components/AuthErrorAlert'
import { AuthFormHeader } from '@/features/auth/components/AuthFormHeader'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { useLogin } from '@/features/auth/hooks/useLogin'
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/loginSchema'
import { normalizeAuthError } from '@/features/auth/utils/authErrors'
import { getSafeRedirectPath } from '@/features/auth/utils/redirects'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { PrimaryButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'

const loginFields: FieldPath<LoginFormValues>[] = [
  'email',
  'password',
  'rememberMe',
]

export function LoginForm() {
  const login = useLogin()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(loginSchema),
  })
  const isBusy = isSubmitting || login.isPending

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await login.mutateAsync({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })
      navigate(getSafeRedirectPath(searchParams.get('next')), {
        replace: true,
      })
    } catch (error) {
      const normalized = normalizeAuthError(
        error,
        "We couldn't sign you in. Check your details and try again.",
      )

      Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
        if (loginFields.includes(field as FieldPath<LoginFormValues>)) {
          setError(field as FieldPath<LoginFormValues>, {
            message,
            type: 'server',
          })
        }
      })

      setFormError(
        normalized.code === 'invalid_credentials'
          ? "We couldn't sign you in. Check your details and try again."
          : (normalized.formError ??
              'OWERU is temporarily unavailable. Please try again.'),
      )
    }
  })

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b bg-surface px-5 py-6 sm:px-7">
        <AuthFormHeader
          icon={LockKeyhole}
          title="Welcome Back"
          description="Sign in to continue to OWERU Marketplace."
        />
      </div>

      <form className="grid gap-5 p-5 sm:p-7" noValidate onSubmit={onSubmit}>
        {formError && <AuthErrorAlert message={formError} />}

        <Input
          autoComplete="email"
          error={errors.email?.message}
          label="Email address"
          placeholder="you@example.com"
          type="email"
          {...register('email')}
        />

        <PasswordField
          autoComplete="current-password"
          error={errors.password?.message}
          label="Password"
          placeholder="Enter your password"
          {...register('password')}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Checkbox label="Remember me" {...register('rememberMe')} />
          <NavLink
            className="rounded-control text-sm font-bold text-accent transition hover:text-gold-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            to={routePaths.forgotPassword}
          >
            Forgot password?
          </NavLink>
        </div>

        <PrimaryButton className="w-full" disabled={isBusy} type="submit">
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            <>
              Log in
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </PrimaryButton>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <NavLink
            className="font-bold text-accent transition hover:text-gold-hover"
            to={routePaths.register}
          >
            Create account
          </NavLink>
        </p>
      </form>
    </Card>
  )
}
