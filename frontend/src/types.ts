export type EntryType = 'INCOME' | 'EXPENSE' | 'TRANSFER'

export type Entry = {
  id: number
  type: EntryType
  categoryId: number | null
  categoryName: string | null
  subcategoryId: number | null
  subcategoryName: string | null
  amount: number
  transactionAt: string
  fromAccountId: number | null
  fromAccountName: string | null
  toAccountId: number | null
  toAccountName: string | null
  memo: string | null
  createdAt: string
  updatedAt: string
}

export type EntryCreateInput = {
  type: EntryType
  categoryId?: number | null
  subcategoryId?: number | null
  amount: number
  transactionAt: string
  fromAccountId?: number | null
  toAccountId?: number | null
  memo?: string
}

export type EntryUpdateInput = EntryCreateInput

export type Account = {
  id: number
  accountGroupId: number
  accountGroupName: string
  name: string
  balance: number
  excludeFromStats: boolean
  hidden: boolean
}

export type Category = {
  id: number
  type: EntryType
  name: string
  displayOrder: number
}

export type Subcategory = {
  id: number
  categoryId: number
  categoryName: string
  name: string
  displayOrder: number
}

export type AccountGroupKind = 'CREDIT_CARD' | 'DEBIT_CARD' | 'GENERAL'

export type AccountGroup = {
  id: number
  name: string
  kind: AccountGroupKind
  createdAt: string
  updatedAt: string
}
