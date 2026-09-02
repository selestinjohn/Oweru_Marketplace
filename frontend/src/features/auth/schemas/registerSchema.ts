import { z } from 'zod'

const phoneSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || /^\+?[0-9\s()-]{7,20}$/.test(value),
    'Enter a valid phone number',
  )

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, 'Enter your full name'),
    email: z.email('Enter a valid email address'),
    phoneNumber: phoneSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    termsAccepted: z.boolean().refine((value) => value, {
      message: 'Accept the account terms to continue',
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
