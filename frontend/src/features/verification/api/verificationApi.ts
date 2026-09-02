import { apiEndpoints } from '@/services/api/endpoints'
import { httpClient } from '@/services/api/httpClient'
import type {
  AddVerificationCheckPayload,
  AddVerificationFindingPayload,
  AssignVerificationPayload,
  AttachVerificationEvidencePayload,
  CreateVerificationPayload,
  DecideVerificationPayload,
  VerificationCheck,
  VerificationDetails,
  VerificationEvidence,
  VerificationFinding,
  VerificationRecord,
} from '@/features/verification/types/verification.types'

export const verificationApi = {
  async list() {
    const response = await httpClient.get<VerificationRecord[]>(
      apiEndpoints.verifications.list,
    )
    return response.data
  },

  async detail(verificationId: string) {
    const response = await httpClient.get<VerificationRecord>(
      apiEndpoints.verifications.detail(verificationId),
    )
    return response.data
  },

  async request(payload: CreateVerificationPayload) {
    const response = await httpClient.post<VerificationRecord>(
      apiEndpoints.verifications.list,
      payload,
    )
    return response.data
  },

  async assign(verificationId: string, payload: AssignVerificationPayload) {
    const response = await httpClient.post<VerificationRecord>(
      apiEndpoints.verifications.assign(verificationId),
      payload,
    )
    return response.data
  },

  async start(verificationId: string) {
    const response = await httpClient.post<VerificationRecord>(
      apiEndpoints.verifications.start(verificationId),
    )
    return response.data
  },

  async submit(verificationId: string) {
    const response = await httpClient.post<VerificationRecord>(
      apiEndpoints.verifications.submit(verificationId),
    )
    return response.data
  },

  async decide(verificationId: string, payload: DecideVerificationPayload) {
    const response = await httpClient.post<VerificationRecord>(
      apiEndpoints.verifications.decision(verificationId),
      payload,
    )
    return response.data
  },

  async addCheck(verificationId: string, payload: AddVerificationCheckPayload) {
    const response = await httpClient.post<VerificationCheck>(
      apiEndpoints.verifications.checks(verificationId),
      payload,
    )
    return response.data
  },

  async addFinding(
    verificationId: string,
    payload: AddVerificationFindingPayload,
  ) {
    const response = await httpClient.post<VerificationFinding>(
      apiEndpoints.verifications.findings(verificationId),
      payload,
    )
    return response.data
  },

  async attachEvidence(
    verificationId: string,
    payload: AttachVerificationEvidencePayload,
  ) {
    const response = await httpClient.post<VerificationEvidence>(
      apiEndpoints.verifications.evidence(verificationId),
      payload,
    )
    return response.data
  },
}

export type VerificationApiDetails = VerificationDetails
