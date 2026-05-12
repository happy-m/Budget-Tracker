import { useState } from 'react'
import CategorySection from './CategorySection'
import AccountSection from './AccountSection'

type SubPage = 'income' | 'expense' | 'accounts'

const ITEMS: { id: SubPage; label: string; description: string }[] = [
  { id: 'income', label: '수입 분류', description: '월급, 부수입 등 수입 항목 관리' },
  { id: 'expense', label: '지출 분류', description: '식비, 교통비 등 지출 항목 관리' },
  { id: 'accounts', label: '자산', description: '계좌, 카드 등 자산 그룹/항목 관리' },
]

const PAGE_TITLE: Record<SubPage, string> = {
  income: '수입 분류',
  expense: '지출 분류',
  accounts: '자산',
}

export default function SettingsView() {
  const [subPage, setSubPage] = useState<SubPage | null>(null)

  if (subPage === null) {
    return (
      <div className="settings-view">
        <h1>설정</h1>
        <div className="settings-list">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              className="settings-list-item"
              onClick={() => setSubPage(item.id)}
            >
              <div className="settings-list-item-text">
                <span className="settings-list-item-label">{item.label}</span>
                <span className="settings-list-item-desc">{item.description}</span>
              </div>
              <span className="settings-list-item-arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="settings-view">
      <div className="settings-detail-header">
        <button
          type="button"
          className="settings-back"
          onClick={() => setSubPage(null)}
          aria-label="뒤로"
        >
          ‹
        </button>
        <h1>{PAGE_TITLE[subPage]}</h1>
      </div>
      {subPage === 'income' && <CategorySection type="INCOME" />}
      {subPage === 'expense' && <CategorySection type="EXPENSE" />}
      {subPage === 'accounts' && <AccountSection />}
    </div>
  )
}
