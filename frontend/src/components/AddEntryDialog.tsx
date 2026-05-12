import { useEffect, useMemo, useState } from 'react'
import { entriesApi } from '../api/entries'
import { accountsApi } from '../api/accounts'
import { accountGroupsApi } from '../api/accountGroups'
import { categoriesApi, subcategoriesApi } from '../api/categories'
import type {
  Account,
  AccountGroup,
  Category,
  Entry,
  EntryType,
  Subcategory,
} from '../types'

type Props = {
  initialDate: string
  entry?: Entry
  onClose: () => void
  onSaved: () => void
}

function defaultDateTime(date: string): string {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `${date}T${hh}:${mm}`
}

const TYPE_LABEL: Record<EntryType, string> = {
  EXPENSE: '지출',
  INCOME: '수입',
  TRANSFER: '이체',
}

export default function AddEntryDialog({ initialDate, entry, onClose, onSaved }: Props) {
  const isEdit = !!entry

  const [type, setType] = useState<EntryType>(entry?.type ?? 'EXPENSE')
  const [amount, setAmount] = useState(
    entry ? Number(entry.amount).toLocaleString('ko-KR') : ''
  )
  const [transactionAt, setTransactionAt] = useState(
    entry ? entry.transactionAt.slice(0, 16) : defaultDateTime(initialDate)
  )
  const [categoryId, setCategoryId] = useState<number | null>(entry?.categoryId ?? null)
  const [subcategoryId, setSubcategoryId] = useState<number | null>(
    entry?.subcategoryId ?? null
  )
  const [fromGroupId, setFromGroupId] = useState<number | null>(null)
  const [fromAccountId, setFromAccountId] = useState<number | null>(
    entry?.fromAccountId ?? null
  )
  const [toGroupId, setToGroupId] = useState<number | null>(null)
  const [toAccountId, setToAccountId] = useState<number | null>(entry?.toAccountId ?? null)
  const [memo, setMemo] = useState(entry?.memo ?? '')

  const [accounts, setAccounts] = useState<Account[]>([])
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    accountsApi
      .list()
      .then((data) => {
        setAccounts(data)
        if (entry?.fromAccountId != null) {
          const a = data.find((x) => x.id === entry.fromAccountId)
          if (a) setFromGroupId(a.accountGroupId)
        }
        if (entry?.toAccountId != null) {
          const a = data.find((x) => x.id === entry.toAccountId)
          if (a) setToGroupId(a.accountGroupId)
        }
      })
      .catch((e) => setError(String(e)))
    accountGroupsApi.list().then(setAccountGroups).catch((e) => setError(String(e)))
  }, [])

  useEffect(() => {
    if (type === 'TRANSFER') {
      setCategories([])
      return
    }
    categoriesApi.list(type).then(setCategories).catch((e) => setError(String(e)))
  }, [type])

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([])
      return
    }
    subcategoriesApi.list(categoryId).then(setSubcategories).catch((e) => setError(String(e)))
  }, [categoryId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const fromAccountOptions = useMemo(
    () => accounts.filter((a) => a.accountGroupId === fromGroupId),
    [accounts, fromGroupId]
  )
  const toAccountOptions = useMemo(
    () => accounts.filter((a) => a.accountGroupId === toGroupId),
    [accounts, toGroupId]
  )

  const changeType = (t: EntryType) => {
    setType(t)
    setCategoryId(null)
    setSubcategoryId(null)
  }

  const changeCategory = (id: number | null) => {
    setCategoryId(id)
    setSubcategoryId(null)
  }

  const changeFromGroup = (id: number | null) => {
    setFromGroupId(id)
    setFromAccountId(null)
  }
  const changeToGroup = (id: number | null) => {
    setToGroupId(id)
    setToAccountId(null)
  }

  const submit = async () => {
    setError(null)
    const amt = Number(amount.replace(/,/g, ''))
    if (!amt || amt <= 0) {
      setError('금액을 입력하세요')
      return
    }
    const payload = {
      type,
      categoryId: type === 'TRANSFER' ? null : categoryId,
      subcategoryId: type === 'TRANSFER' ? null : subcategoryId,
      amount: amt,
      transactionAt,
      fromAccountId: type === 'INCOME' ? null : fromAccountId,
      toAccountId: type === 'EXPENSE' ? null : toAccountId,
      memo: memo || undefined,
    }
    setSubmitting(true)
    try {
      if (isEdit && entry) {
        await entriesApi.update(entry.id, payload)
      } else {
        await entriesApi.create(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      setError(String(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog form-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{isEdit ? '기록 편집' : '기록 추가'}</h2>
          <button className="dialog-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="dialog-body">
          <div className="form-row">
            <label>종류</label>
            <div className="type-tabs">
              {(['EXPENSE', 'INCOME', 'TRANSFER'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={'type-tab' + (type === t ? ' active' : '')}
                  onClick={() => changeType(t)}
                >
                  {TYPE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label>일시</label>
            <input
              type="datetime-local"
              value={transactionAt}
              onChange={(e) => setTransactionAt(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>금액</label>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, '')
                setAmount(raw ? Number(raw).toLocaleString('ko-KR') : '')
              }}
              placeholder="0"
            />
          </div>

          {(type === 'EXPENSE' || type === 'TRANSFER') && (
            <div className="form-row">
              <label>{type === 'EXPENSE' ? '자산' : '출금 자산'}</label>
              <div className="cascading-selects">
                <select
                  value={fromGroupId ?? ''}
                  onChange={(e) =>
                    changeFromGroup(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">자산 그룹 선택</option>
                  {accountGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <select
                  value={fromAccountId ?? ''}
                  onChange={(e) =>
                    setFromAccountId(e.target.value ? Number(e.target.value) : null)
                  }
                  disabled={!fromGroupId || fromAccountOptions.length === 0}
                >
                  <option value="">자산 선택</option>
                  {fromAccountOptions.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {(type === 'INCOME' || type === 'TRANSFER') && (
            <div className="form-row">
              <label>{type === 'INCOME' ? '자산' : '입금 자산'}</label>
              <div className="cascading-selects">
                <select
                  value={toGroupId ?? ''}
                  onChange={(e) =>
                    changeToGroup(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">자산 그룹 선택</option>
                  {accountGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <select
                  value={toAccountId ?? ''}
                  onChange={(e) =>
                    setToAccountId(e.target.value ? Number(e.target.value) : null)
                  }
                  disabled={!toGroupId || toAccountOptions.length === 0}
                >
                  <option value="">자산 선택</option>
                  {toAccountOptions.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {type !== 'TRANSFER' && (
            <div className="form-row">
              <label>분류</label>
              <div className="cascading-selects">
                <select
                  value={categoryId ?? ''}
                  onChange={(e) =>
                    changeCategory(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">분류 선택</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={subcategoryId ?? ''}
                  onChange={(e) =>
                    setSubcategoryId(e.target.value ? Number(e.target.value) : null)
                  }
                  disabled={!categoryId || subcategories.length === 0}
                >
                  <option value="">소분류</option>
                  {subcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-row">
            <label>메모</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder=""
              maxLength={200}
            />
          </div>

          {error && <div className="form-error">{error}</div>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
