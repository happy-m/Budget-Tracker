import { api } from './client'
import type { Account } from '../types'

type CreateBody = {
  accountGroupId: number
  name: string
  balance?: number
}

type UpdateBody = {
  accountGroupId?: number
  name?: string
  balance?: number
  excludeFromStats?: boolean
  hidden?: boolean
}

export const accountsApi = {
  list: () => api.get<Account[]>('/accounts'),
  create: (body: CreateBody) => api.post<Account>('/accounts', body),
  update: (id: number, body: UpdateBody) => api.patch<Account>(`/accounts/${id}`, body),
  delete: (id: number) => api.delete<void>(`/accounts/${id}`),
}
