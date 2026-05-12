import { api } from './client'
import type { Entry, EntryCreateInput } from '../types'

export const entriesApi = {
  list: () => api.get<Entry[]>('/entries'),
  create: (input: EntryCreateInput) => api.post<Entry>('/entries', input),
}
