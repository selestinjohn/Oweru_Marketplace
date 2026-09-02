import { useMutation } from '@tanstack/react-query'
import { documentsService } from '@/services/api/documents.service'
import { queryKeys } from '@/services/query/queryKeys'

type DownloadDocumentInput = {
  documentId: string
  fileName: string
}

export function useSecureDocumentDownload() {
  return useMutation({
    mutationKey: queryKeys.documents.download('secure-document'),
    mutationFn: async ({ documentId, fileName }: DownloadDocumentInput) => {
      const blob = await documentsService.download(documentId)
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')

      anchor.href = url
      anchor.download = sanitizeFileName(fileName)
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)
    },
  })
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '')
}
