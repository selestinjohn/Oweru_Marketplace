import { z } from 'zod'

export const findingSchema = z.object({
  description: z
    .string()
    .trim()
    .min(12, 'Describe the finding clearly enough for review.'),
  severity: z.enum(['INFORMATIONAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  title: z.string().trim().min(3, 'Enter a finding title.'),
  verification_check: z.string().optional(),
})

export const decisionSchema = z
  .object({
    expires_at: z.string().optional(),
    outcome: z.enum(['APPROVED', 'REJECTED']),
    summary: z.string().trim().min(12, 'Enter a clear decision summary.'),
  })
  .refine(
    (value) => {
      if (!value.expires_at) {
        return true
      }

      return new Date(value.expires_at) > new Date()
    },
    {
      message: 'Expiry date must be in the future.',
      path: ['expires_at'],
    },
  )

export const evidenceAttachmentSchema = z.object({
  evidence: z.string().min(1, 'Select evidence from this property.'),
  relevance_note: z
    .string()
    .trim()
    .min(8, 'Explain why this evidence is relevant.')
    .optional()
    .or(z.literal('')),
})

export type FindingFormValues = z.infer<typeof findingSchema>
export type DecisionFormValues = z.infer<typeof decisionSchema>
export type EvidenceAttachmentFormValues = z.infer<
  typeof evidenceAttachmentSchema
>
