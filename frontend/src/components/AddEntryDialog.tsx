import { useEffect, useState } from 'react'
import { entriesApi } from '../api/entries'
import { accountsApi } from '../api/accounts'
import { categoriesApi, subcategoriesApi } from '../api/categories'
import type { Account, Category, EntryType, Subcategory } from '../types'

type Props = {
  initialDate: string
  onClose: () => void
  onCreated: () => void
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

export default function AddEntryDialog({ initialDate, onClose, onCreated }: Props) {
  const [type, setType] = useState<EntryType>('EXPENSE')
  const [amount, setAmount] = useState('')
  const [transactionAt, setTransactionAt] = useState(defaultDateTime(initialDate))
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null)
  const [fromAccountId, setFromAccountId] = useState<number | null>(null)
  const [toAccountId, setToAccountId] = useState<number | null>(null)
  const [memo, setMemo] = useState('')

  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    accountsApi.list().then(setAccounts).catch((e) => setError(String(e)))
  }, [])

  useEffect(() => {
    setCategoryId(null)
    setSubcategoryId(null)
    if (type === 'TRANSFER') {
      setCategories([])
      return
    }
    categoriesApi.list(type).then(setCategories).catch((e) => setError(String(e)))
  }, [type])

  useEffect(() => {
    setSubcategoryId(null)
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

  const submit = async () => {
    setError(null)
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      setError('금액을 입력하세요')
      return
    }
    setSubmitting(true)
    try {
      await entriesApi.create({
        type,
        categoryId: type === 'TRANSFER' ? null : categoryId,
        subcategoryId: type === 'TRANSFER' ? null : subcategoryId,
        amount: amt,
        transactionAt,
        fromAccountId: type === 'INCOME' ? null : fromAccountId,
        toAccountId: type === 'EXPENSE' ? null : toAccountId,
        memo: memo || undefined,
      })
      onCreated()
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
          <h2>기록 추가</h2>
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
                  onClick={() => setType(t)}
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
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>

          {(type === 'EXPENSE' || type === 'TRANSFER') && (
            <div className="form-row">
              <label>{type === 'EXPENSE' ? '자산' : '출금 자산'}</label>
              <select
                value={fromAccountId ?? ''}
                onChange={(e) =>
                  setFromAccountId(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">선택</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.accountGroupName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {(type === 'INCOME' || type === 'TRANSFER') && (
            <div className="form-row">
              <label>{type === 'INCOME' ? '자산' : '입금 자산'}</label>
              <select
                value={toAccountId ?? ''}
                onChange={(e) =>
                  setToAccountId(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">선택</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.accountGroupName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {type !== 'TRANSFER' && (
            <>
              <div className="form-row">
                <label>분류</label>
                <select
                  value={categoryId ?? ''}
                  onChange={(e) =>
                    setCategoryId(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">선택</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {categoryId && subcategories.length > 0 && (
                <div className="form-row">
                  <label>소분류 (선택)</label>
                  <select
                    value={subcategoryId ?? ''}
                    onChange={(e) =>
                      setSubcategoryId(e.target.value ? Number(e.target.value) : null)
                    }
                  >
                    <option value="">선택 안 함</option>
                    {subcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div className="form-row">
            <label>메모 (선택)</label>
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
