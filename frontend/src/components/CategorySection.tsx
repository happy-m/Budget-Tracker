import { useEffect, useState } from 'react'
import { categoriesApi, subcategoriesApi } from '../api/categories'
import type { Category, EntryType, Subcategory } from '../types'

type Props = { type: EntryType }

export default function CategorySection({ type }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [subsByCategory, setSubsByCategory] = useState<Record<number, Subcategory[]>>({})
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSubName, setNewSubName] = useState<Record<number, string>>({})

  const [editingCatId, setEditingCatId] = useState<number | null>(null)
  const [editingCatName, setEditingCatName] = useState('')
  const [editingSubId, setEditingSubId] = useState<number | null>(null)
  const [editingSubName, setEditingSubName] = useState('')

  const load = async () => {
    const cats = await categoriesApi.list(type)
    setCategories(cats)
    const map: Record<number, Subcategory[]> = {}
    await Promise.all(
      cats.map(async (c) => {
        map[c.id] = await subcategoriesApi.list(c.id)
      })
    )
    setSubsByCategory(map)
  }

  useEffect(() => {
    load()
  }, [type])

  const addCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) return
    await categoriesApi.create({ type, name })
    setNewCategoryName('')
    await load()
  }

  const startEditCategory = (c: Category) => {
    setEditingCatId(c.id)
    setEditingCatName(c.name)
  }
  const submitEditCategory = async () => {
    if (editingCatId == null) return
    const original = categories.find((c) => c.id === editingCatId)
    const name = editingCatName.trim()
    setEditingCatId(null)
    if (!original || !name || name === original.name) return
    await categoriesApi.update(editingCatId, { name })
    await load()
  }
  const cancelEditCategory = () => setEditingCatId(null)

  const deleteCategory = async (c: Category) => {
    if (!window.confirm(`"${c.name}" 분류를 삭제할까요?\n소분류도 같이 삭제됩니다.`)) return
    await categoriesApi.delete(c.id)
    await load()
  }

  const moveCategory = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= categories.length) return
    const a = categories[index]
    const b = categories[target]
    await Promise.all([
      categoriesApi.update(a.id, { displayOrder: b.displayOrder }),
      categoriesApi.update(b.id, { displayOrder: a.displayOrder }),
    ])
    await load()
  }

  const addSubcategory = async (categoryId: number) => {
    const name = (newSubName[categoryId] || '').trim()
    if (!name) return
    await subcategoriesApi.create({ categoryId, name })
    setNewSubName({ ...newSubName, [categoryId]: '' })
    await load()
  }

  const startEditSubcategory = (s: Subcategory) => {
    setEditingSubId(s.id)
    setEditingSubName(s.name)
  }
  const submitEditSubcategory = async () => {
    if (editingSubId == null) return
    const all = Object.values(subsByCategory).flat()
    const original = all.find((s) => s.id === editingSubId)
    const name = editingSubName.trim()
    setEditingSubId(null)
    if (!original || !name || name === original.name) return
    await subcategoriesApi.update(editingSubId, { name })
    await load()
  }
  const cancelEditSubcategory = () => setEditingSubId(null)

  const deleteSubcategory = async (s: Subcategory) => {
    if (!window.confirm(`"${s.name}" 소분류를 삭제할까요?`)) return
    await subcategoriesApi.delete(s.id)
    await load()
  }

  const moveSubcategory = async (
    categoryId: number,
    index: number,
    direction: -1 | 1
  ) => {
    const list = subsByCategory[categoryId] ?? []
    const target = index + direction
    if (target < 0 || target >= list.length) return
    const a = list[index]
    const b = list[target]
    await Promise.all([
      subcategoriesApi.update(a.id, { displayOrder: b.displayOrder }),
      subcategoriesApi.update(b.id, { displayOrder: a.displayOrder }),
    ])
    await load()
  }

  return (
    <div className="settings-section">
      <div className="settings-add-form">
        <input
          type="text"
          placeholder="새 분류"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          maxLength={30}
        />
        <button onClick={addCategory}>추가</button>
      </div>

      {categories.map((c, ci) => (
        <div key={c.id} className="settings-block">
          <div className="settings-block-header">
            {editingCatId === c.id ? (
              <input
                type="text"
                className="inline-edit-input"
                value={editingCatName}
                onChange={(e) => setEditingCatName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitEditCategory()
                  else if (e.key === 'Escape') cancelEditCategory()
                }}
                onBlur={submitEditCategory}
                autoFocus
                maxLength={30}
              />
            ) : (
              <span className="settings-name">{c.name}</span>
            )}
            <button
              className="icon-btn"
              onClick={() => moveCategory(ci, -1)}
              disabled={ci === 0}
              aria-label="위로"
            >
              ↑
            </button>
            <button
              className="icon-btn"
              onClick={() => moveCategory(ci, 1)}
              disabled={ci === categories.length - 1}
              aria-label="아래로"
            >
              ↓
            </button>
            <button className="icon-btn" onClick={() => startEditCategory(c)}>
              편집
            </button>
            <button
              className="icon-btn icon-btn-danger"
              onClick={() => deleteCategory(c)}
            >
              삭제
            </button>
          </div>
          <div className="settings-children">
            {(subsByCategory[c.id] ?? []).map((s, si) => (
              <div key={s.id} className="settings-child-row">
                {editingSubId === s.id ? (
                  <input
                    type="text"
                    className="inline-edit-input"
                    value={editingSubName}
                    onChange={(e) => setEditingSubName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitEditSubcategory()
                      else if (e.key === 'Escape') cancelEditSubcategory()
                    }}
                    onBlur={submitEditSubcategory}
                    autoFocus
                    maxLength={30}
                  />
                ) : (
                  <span className="settings-child-name">{s.name}</span>
                )}
                <button
                  className="icon-btn"
                  onClick={() => moveSubcategory(c.id, si, -1)}
                  disabled={si === 0}
                  aria-label="위로"
                >
                  ↑
                </button>
                <button
                  className="icon-btn"
                  onClick={() => moveSubcategory(c.id, si, 1)}
                  disabled={si === (subsByCategory[c.id]?.length ?? 0) - 1}
                  aria-label="아래로"
                >
                  ↓
                </button>
                <button className="icon-btn" onClick={() => startEditSubcategory(s)}>
                  편집
                </button>
                <button
                  className="icon-btn icon-btn-danger"
                  onClick={() => deleteSubcategory(s)}
                >
                  ×
                </button>
              </div>
            ))}
            <div className="settings-add-form settings-add-child">
              <input
                type="text"
                placeholder="새 소분류"
                value={newSubName[c.id] || ''}
                onChange={(e) =>
                  setNewSubName({ ...newSubName, [c.id]: e.target.value })
                }
                onKeyDown={(e) => e.key === 'Enter' && addSubcategory(c.id)}
                maxLength={30}
              />
              <button onClick={() => addSubcategory(c.id)}>추가</button>
            </div>
          </div>
        </div>
      ))}

      {categories.length === 0 && (
        <div className="entry-list-empty">분류가 없습니다. 위에서 추가하세요.</div>
      )}
    </div>
  )
}
