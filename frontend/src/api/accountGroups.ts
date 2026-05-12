import { api } from './client'
import type { AccountGroup, AccountGroupKind } from '../types'

export const accountGroupsApi = {
  list: () => api.get<AccountGroup[]>('/account-groups'),
  create: (body: { name: string; kind: AccountGroupKind }) =>
    api.post<AccountGroup>('/account-groups', body),
  update: (id: number, body: { name: string; kind: AccountGroupKind }) =>
    api.put<AccountGroup>(`/account-groups/${id}`, body),
  delete: (id: number) => api.delete<void>(`/account-groups/${id}`),
}
