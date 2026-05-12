import { api } from './client'
import type { Account } from '../types'

export const accountsApi = {
  list: () => api.get<Account[]>('/accounts'),
}
