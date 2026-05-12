import { useEffect } from 'react'
import type { Entry } from '../types'

type Props = {
  date: string
  entries: Entry[]
  onClose: () => void
}

function fmt(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

function formatDateHeader(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const wd = ['일', '월', '화', '수', '목', '금', '토'][new Date(y, m - 1, d).getDay()]
  return `${y}년 ${m}월 ${d}일 (${wd})`
}

export default function EntryList({ date, entries, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const incomeSum = entries
    .filter((e) => e.type === 'INCOME')
    .reduce((s, e) => s + e.amount, 0)
  const expenseSum = entries
    .filter((e) => e.type === 'EXPENSE')
    .reduce((s, e) => s + e.amount, 0)
  const total = incomeSum - expenseSum

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-header">
          <h2>{formatDateHeader(date)}</h2>
          <button className="dialog-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="dialog-body">
          {entries.length === 0 ? (
            <div className="entry-list-empty">기록 없음</div>
          ) : (
            <>
              <ul className="entry-items">
                {entries.map((e, i) => (
                  <li key={i} className={`entry entry-${e.type.toLowerCase()}`}>
                    <div className="entry-left">
                      <span className="entry-cat">
                        {e.category}
                        {e.subcategory ? ` · ${e.subcategory}` : ''}
                      </span>
                      {e.memo && <span className="entry-memo">{e.memo}</span>}
                    </div>
                    <span className="entry-amount">
                      {e.type === 'INCOME' ? '+' : e.type === 'EXPENSE' ? '−' : ''}
                      {fmt(e.amount)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="entry-summary">
                <span>합계</span>
                <span className={total >= 0 ? 'pos' : 'neg'}>
                  {total >= 0 ? '+' : ''}
                  {fmt(total)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="dialog-fab">
          <button
            type="button"
            className="fab fab-memo"
            aria-label="메모 입력"
            onClick={() => alert('메모 - 준비 중')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <line x1="8" y1="8" x2="16" y2="8" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="16" x2="13" y2="16" />
            </svg>
          </button>
          <button
            type="button"
            className="fab fab-add"
            aria-label="기록 추가"
            onClick={() => alert('기록 추가 - 준비 중')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
