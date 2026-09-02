import { useState } from 'react'
import type { FieldPath } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2, UserPlus } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthErrorAlert } from '@/features/auth/components/AuthErrorAlert'
import { AuthFormHeader } from '@/features/auth/components/AuthFormHeader'
import { AuthSuccessState } from '@/features/auth/components/AuthSuccessState'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { useRegister } from '@/features/auth/hooks/useRegister'
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/schemas/registerSchema'
import { normalizeAuthError } from '@/features/auth/utils/authErrors'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { PrimaryButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'

const registerFields: FieldPath<RegisterFormValues>[] = [
  'displayName',
  'email',
  'phoneNumber',
  'password',
  'confirmPassword',
  'termsAccepted',
]

export function RegisterForm() {
  const registerMutation = useRegister()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [createdWithoutSession, setCreatedWithoutSession] = useState(false)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      confirmPassword: '',
      displayName: '',
      email: '',
      password: '',
      phoneNumber: '',
      termsAccepted: false,
    },
    resolver: zodResolver(registerSchema),
  })
  const isBusy = isSubmitting || registerMutation.isPending

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      const session = await registerMutation.mutateAsync({
        display_name: values.displayName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        phone_number: values.phoneNumber?.trim() || undefined,
      })

      if (session.tokens) {
        navigate(routePaths.onboarding, { replace: true })
      } else {
        setCreatedWithoutSession(true)
      }
    } catch (error) {
      const normalized = normalizeAuthError(
        error,
        'We could not create your account. Check your details and try again.',
      )

      Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
        if (registerFields.includes(field as FieldPath<RegisterFormValues>)) {
          setError(field as FieldPath<RegisterFormValues>, {
            message,
            type: 'server',
          })
        }
      })

      setFormError(
        normalized.formError ??
          'OWERU is temporarily unavailable. Please try again.',
      )
    }
  })

  if (createdWithoutSession) {
    return (
      <AuthSuccessState
        title="Account created"
        message="Your OWERU account has been created. Continue to login when the backend requires a separate sign-in step."
      />
    )
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b bg-surface px-5 py-6 sm:px-7">
        <AuthFormHeader
          icon={UserPlus}
          title="Create Your Account"
          description="Join OWERU Marketplace and start discovering trusted property opportunities."
        />
      </div>

      <form className="grid gap-5 p-5 sm:p-7" noValidate onSubmit={onSubmit}>
        {formError && <AuthErrorAlert message={formError} />}

        <Input
          autoComplete="name"
          error={errors.displayName?.message}
          label="Full name"
          placeholder="Enter your full name"
          {...register('displayName')}
        />

        <Input
          autoComplete="email"
          error={errors.email?.message}
          label="Email address"
          placeholder="you@example.com"
          type="email"
          {...register('email')}
        />

        <Input
          autoComplete="tel"
          error={errors.phoneNumber?.message}
          helperText="Optional, for account and viewing coordination."
          label="Phone number"
          placeholder="+255 700 000 000"
          type="tel"
          {...register('phoneNumber')}
        />

        <PasswordField
          autoComplete="new-password"
          error={errors.password?.message}
          helperText="Use at least 8 characters."
          label="Password"
          placeholder="Create a password"
          {...register('password')}
        />

        <PasswordField
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          label="Confirm password"
          placeholder="Confirm your password"
          {...register('confirmPassword')}
        />

        <div className="grid gap-2">
          <Checkbox
            aria-invalid={Boolean(errors.termsAccepted)}
            label="I accept OWERU Marketplace account terms."
            {...register('termsAccepted')}
          />
          <p
            className={
              errors.termsAccepted
                ? 'text-xs text-danger'
                : 'text-xs leading-5 text-muted-foreground'
            }
          >
            {errors.termsAccepted?.message ??
              'Formal legal pages can be linked here when finalized; this acknowledgement is not sent to the current backend contract.'}
          </p>
        </div>

        <PrimaryButton className="w-full" disabled={isBusy} type="submit">
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Creating account...
            </>
          ) : (
            <>
              Sign up
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </PrimaryButton>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <NavLink
            className="font-bold text-accent transition hover:text-gold-hover"
            to={routePaths.login}
          >
            Log in
          </NavLink>
        </p>
      </form>
    </Card>
  )
}
