import { useEffect, useState } from 'react'
import DayCell from './components/DayCell'
import EntryList from './components/EntryList'
import AddEntryDialog from './components/AddEntryDialog'
import Sidebar, { type View } from './components/Sidebar'
import { entriesApi } from './api/entries'
import type { Entry } from './types'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

type Cell = {
  year: number
  month: number
  day: number
  weekday: number
  isCurrentMonth: boolean
}

function buildCells(year: number, month: number): Cell[] {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthLast = new Date(year, month, 0).getDate()
  const cells: Cell[] = []

  for (let i = 0; i < 42; i++) {
    let y = year
    let m = month
    let d: number
    let isCurrent = false

    if (i < firstWeekday) {
      d = prevMonthLast - (firstWeekday - 1 - i)
      m = month - 1
      if (m < 0) {
        m = 11
        y--
      }
    } else if (i >= firstWeekday + daysInMonth) {
      d = i - firstWeekday - daysInMonth + 1
      m = month + 1
      if (m > 11) {
        m = 0
        y++
      }
    } else {
      d = i - firstWeekday + 1
      isCurrent = true
    }

    cells.push({ year: y, month: m, day: d, weekday: i % 7, isCurrentMonth: isCurrent })
  }
  return cells
}

function keyOf(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const VIEW_LABEL: Record<View, string> = {
  calendar: '달력',
  accounts: '자산',
  categories: '카테고리',
  stats: '통계',
  settings: '설정',
}

export default function App() {
  const today = new Date()
  const [view, setView] = useState<View>('calendar')

  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(year)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const [allEntries, setAllEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadEntries = () => {
    setLoading(true)
    setError(null)
    entriesApi
      .list()
      .then(setAllEntries)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const entriesByDate: Record<string, Entry[]> = {}
  for (const e of allEntries) {
    const date = e.transactionAt.slice(0, 10)
    if (!entriesByDate[date]) entriesByDate[date] = []
    entriesByDate[date].push(e)
  }

  const cells = buildCells(year, month)

  const prevMonth = () => {
    setSelectedDate(null)
    if (month === 0) {
      setYear(year - 1)
      setMonth(11)
    } else setMonth(month - 1)
  }
  const nextMonth = () => {
    setSelectedDate(null)
    if (month === 11) {
      setYear(year + 1)
      setMonth(0)
    } else setMonth(month + 1)
  }

  const togglePicker = () => {
    setPickerYear(year)
    setPickerOpen(!pickerOpen)
  }
  const selectFromPicker = (y: number, m: number) => {
    setSelectedDate(null)
    setYear(y)
    setMonth(m)
    setPickerOpen(false)
  }
  const goToday = () => {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
    setPickerOpen(false)
  }

  const selectedEntries = selectedDate ? (entriesByDate[selectedDate] ?? []) : []

  return (
    <div className="app-layout">
      <Sidebar active={view} onSelect={setView} />
      <main className="main-content">
        {view === 'calendar' ? (
          <>
            <header className="month-nav">
              <button onClick={prevMonth} aria-label="이전 달">
                ‹
              </button>
              <div className="month-title-wrap">
                <button type="button" className="month-title" onClick={togglePicker}>
                  {year}년 {month + 1}월
                </button>
                {pickerOpen && (
                  <div className="picker">
                    <div className="picker-year">
                      <button onClick={() => setPickerYear(pickerYear - 1)} aria-label="이전 해">
                        ‹
                      </button>
                      <span>{pickerYear}년</span>
                      <button onClick={() => setPickerYear(pickerYear + 1)} aria-label="다음 해">
                        ›
                      </button>
                    </div>
                    <div className="picker-months">
                      {Array.from({ length: 12 }, (_, i) => (
                        <button
                          key={i}
                          className={
                            'picker-month' +
                            (pickerYear === year && i === month ? ' selected' : '') +
                            (pickerYear === today.getFullYear() && i === today.getMonth()
                              ? ' today'
                              : '')
                          }
                          onClick={() => selectFromPicker(pickerYear, i)}
                        >
                          {i + 1}월
                        </button>
                      ))}
                    </div>
                    <div className="picker-footer">
                      <button className="picker-today" onClick={goToday}>
                        오늘로
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={nextMonth} aria-label="다음 달">
                ›
              </button>
            </header>

            {error && <div className="form-error">{error}</div>}
            {loading && <div className="entry-list-empty">불러오는 중...</div>}

            <div className="weekdays">
              {WEEKDAYS.map((w, i) => (
                <div key={w} className={`weekday wd-${i}`}>
                  {w}
                </div>
              ))}
            </div>

            <div className="calendar">
              {cells.map((c, i) => {
                const key = keyOf(c.year, c.month, c.day)
                const dayEntries = entriesByDate[key] ?? []
                const income = dayEntries
                  .filter((e) => e.type === 'INCOME')
                  .reduce((s, e) => s + Number(e.amount), 0)
                const expense = dayEntries
                  .filter((e) => e.type === 'EXPENSE')
                  .reduce((s, e) => s + Number(e.amount), 0)
                const isToday =
                  c.year === today.getFullYear() &&
                  c.month === today.getMonth() &&
                  c.day === today.getDate()
                return (
                  <DayCell
                    key={i}
                    day={c.day}
                    weekday={c.weekday}
                    isCurrentMonth={c.isCurrentMonth}
                    isToday={isToday}
                    isSelected={selectedDate === key}
                    income={income}
                    expense={expense}
                    onClick={() => setSelectedDate(key)}
                  />
                )
              })}
            </div>

            {selectedDate && (
              <EntryList
                date={selectedDate}
                entries={selectedEntries}
                onClose={() => setSelectedDate(null)}
                onAddClick={() => setAddDialogOpen(true)}
              />
            )}

            {addDialogOpen && selectedDate && (
              <AddEntryDialog
                initialDate={selectedDate}
                onClose={() => setAddDialogOpen(false)}
                onCreated={() => loadEntries()}
              />
            )}
          </>
        ) : (
          <div className="placeholder">
            <h2>{VIEW_LABEL[view]}</h2>
            <p>준비 중입니다.</p>
          </div>
        )}
      </main>
    </div>
  )
}
