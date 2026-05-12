import { api } from './client'
import type { Entry, EntryCreateInput, EntryUpdateInput } from '../types'

export const entriesApi = {
  list: () => api.get<Entry[]>('/entries'),
  create: (input: EntryCreateInput) => api.post<Entry>('/entries', input),
  update: (id: number, input: EntryUpdateInput) =>
    api.patch<Entry>(`/entries/${id}`, input),
}
