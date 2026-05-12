import { useEffect, useState } from 'react'
import { accountGroupsApi } from '../api/accountGroups'
import { accountsApi } from '../api/accounts'
import type { Account, AccountGroup, AccountGroupKind } from '../types'

const KIND_LABEL: Record<AccountGroupKind, string> = {
  CREDIT_CARD: '신용카드',
  DEBIT_CARD: '체크카드',
  GENERAL: '일반',
}

export default function AccountSection() {
  const [groups, setGroups] = useState<AccountGroup[]>([])
  const [accountsByGroup, setAccountsByGroup] = useState<Record<number, Account[]>>({})

  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupKind, setNewGroupKind] = useState<AccountGroupKind>('GENERAL')

  const [newAccountName, setNewAccountName] = useState<Record<number, string>>({})
  const [newAccountBalance, setNewAccountBalance] = useState<Record<number, string>>({})

  const [editingGroupId, setEditingGroupId] = useState<number | null>(null)
  const [editingGroupName, setEditingGroupName] = useState('')
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null)
  const [editingAccountName, setEditingAccountName] = useState('')

  const load = async () => {
    const [grps, allAccounts] = await Promise.all([
      accountGroupsApi.list(),
      accountsApi.list(),
    ])
    setGroups(grps)
    const map: Record<number, Account[]> = {}
    for (const g of grps) map[g.id] = []
    for (const a of allAccounts) {
      if (map[a.accountGroupId]) map[a.accountGroupId].push(a)
    }
    setAccountsByGroup(map)
  }

  useEffect(() => {
    load()
  }, [])

  const addGroup = async () => {
    const name = newGroupName.trim()
    if (!name) return
    await accountGroupsApi.create({ name, kind: newGroupKind })
    setNewGroupName('')
    await load()
  }

  const startEditGroup = (g: AccountGroup) => {
    setEditingGroupId(g.id)
    setEditingGroupName(g.name)
  }
  const submitEditGroup = async () => {
    if (editingGroupId == null) return
    const original = groups.find((g) => g.id === editingGroupId)
    const name = editingGroupName.trim()
    setEditingGroupId(null)
    if (!original || !name || name === original.name) return
    await accountGroupsApi.update(editingGroupId, { name, kind: original.kind })
    await load()
  }
  const cancelEditGroup = () => setEditingGroupId(null)

  const deleteGroup = async (g: AccountGroup) => {
    if (!window.confirm(`"${g.name}" 그룹을 삭제할까요?\n속한 자산도 같이 삭제됩니다.`))
      return
    await accountGroupsApi.delete(g.id)
    await load()
  }

  const addAccount = async (groupId: number) => {
    const name = (newAccountName[groupId] || '').trim()
    if (!name) return
    const balanceStr = newAccountBalance[groupId] || '0'
    const balance = Number(balanceStr) || 0
    await accountsApi.create({ accountGroupId: groupId, name, balance })
    setNewAccountName({ ...newAccountName, [groupId]: '' })
    setNewAccountBalance({ ...newAccountBalance, [groupId]: '' })
    await load()
  }

  const startEditAccount = (a: Account) => {
    setEditingAccountId(a.id)
    setEditingAccountName(a.name)
  }
  const submitEditAccount = async () => {
    if (editingAccountId == null) return
    const all = Object.values(accountsByGroup).flat()
    const original = all.find((a) => a.id === editingAccountId)
    const name = editingAccountName.trim()
    setEditingAccountId(null)
    if (!original || !name || name === original.name) return
    await accountsApi.update(editingAccountId, { name })
    await load()
  }
  const cancelEditAccount = () => setEditingAccountId(null)

  const deleteAccount = async (a: Account) => {
    if (!window.confirm(`"${a.name}" 자산을 삭제할까요?`)) return
    await accountsApi.delete(a.id)
    await load()
  }

  return (
    <div className="settings-section">
      <div className="settings-add-form">
        <input
          type="text"
          placeholder="새 자산 그룹"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGroup()}
          maxLength={30}
        />
        <select
          value={newGroupKind}
          onChange={(e) => setNewGroupKind(e.target.value as AccountGroupKind)}
        >
          <option value="GENERAL">일반</option>
          <option value="CREDIT_CARD">신용카드</option>
          <option value="DEBIT_CARD">체크카드</option>
        </select>
        <button onClick={addGroup}>추가</button>
      </div>

      {groups.map((g) => (
        <div key={g.id} className="settings-block">
          <div className="settings-block-header">
            {editingGroupId === g.id ? (
              <input
                type="text"
                className="inline-edit-input"
                value={editingGroupName}
                onChange={(e) => setEditingGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitEditGroup()
                  else if (e.key === 'Escape') cancelEditGroup()
                }}
                onBlur={submitEditGroup}
                autoFocus
                maxLength={30}
              />
            ) : (
              <span className="settings-name">{g.name}</span>
            )}
            <span className="settings-badge">{KIND_LABEL[g.kind]}</span>
            <button className="icon-btn" onClick={() => startEditGroup(g)}>
              편집
            </button>
            <button className="icon-btn icon-btn-danger" onClick={() => deleteGroup(g)}>
              삭제
            </button>
          </div>
          <div className="settings-children">
            {accountsByGroup[g.id]?.map((a) => (
              <div key={a.id} className="settings-child-row">
                {editingAccountId === a.id ? (
                  <input
                    type="text"
                    className="inline-edit-input"
                    value={editingAccountName}
                    onChange={(e) => setEditingAccountName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitEditAccount()
                      else if (e.key === 'Escape') cancelEditAccount()
                    }}
                    onBlur={submitEditAccount}
                    autoFocus
                    maxLength={50}
                  />
                ) : (
                  <span className="settings-child-name">{a.name}</span>
                )}
                <span className="settings-child-balance">
                  {Number(a.balance).toLocaleString('ko-KR')}원
                </span>
                <button className="icon-btn" onClick={() => startEditAccount(a)}>
                  편집
                </button>
                <button
                  className="icon-btn icon-btn-danger"
                  onClick={() => deleteAccount(a)}
                >
                  ×
                </button>
              </div>
            ))}
            <div className="settings-add-form settings-add-child">
              <input
                type="text"
                placeholder="자산 이름"
                value={newAccountName[g.id] || ''}
                onChange={(e) =>
                  setNewAccountName({ ...newAccountName, [g.id]: e.target.value })
                }
                maxLength={50}
              />
              <input
                type="number"
                placeholder="초기 잔액"
                value={newAccountBalance[g.id] || ''}
                onChange={(e) =>
                  setNewAccountBalance({ ...newAccountBalance, [g.id]: e.target.value })
                }
              />
              <button onClick={() => addAccount(g.id)}>추가</button>
            </div>
          </div>
        </div>
      ))}

      {groups.length === 0 && (
        <div className="entry-list-empty">자산 그룹이 없습니다. 위에서 추가하세요.</div>
      )}
    </div>
  )
}
