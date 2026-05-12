export type EntryType = 'INCOME' | 'EXPENSE' | 'TRANSFER'

export type Entry = {
  type: EntryType
  amount: number
  category?: string
  subcategory?: string
  memo?: string
}
