import { useState } from 'react'
import DayCell from './components/DayCell'
import EntryList from './components/EntryList'
import Sidebar, { type View } from './components/Sidebar'
import type { Entry } from './types'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function buildDummyEntries(year: number, month: number): Record<string, Entry[]> {
  const mm = String(month + 1).padStart(2, '0')
  return {
    [`${year}-${mm}-05`]: [
      { type: 'EXPENSE', amount: 15000, category: '식비', subcategory: '점심', memo: '김치찌개' },
    ],
    [`${year}-${mm}-12`]: [
      { type: 'INCOME', amount: 100000, category: '용돈', memo: '엄마' },
      { type: 'EXPENSE', amount: 50000, category: '식비', subcategory: '저녁', memo: '회식' },
    ],
    [`${year}-${mm}-15`]: [
      { type: 'INCOME', amount: 3000000, category: '월급', subcategory: '본업', memo: `${month + 1}월분` },
    ],
    [`${year}-${mm}-20`]: [
      { type: 'EXPENSE', amount: 50000, category: '주거비', subcategory: '관리비' },
      { type: 'EXPENSE', amount: 30000, category: '교통비', subcategory: '주유' },
    ],
    [`${year}-${mm}-25`]: [
      { type: 'INCOME', amount: 50000, category: '부수입' },
      { type: 'EXPENSE', amount: 120000, category: '쇼핑', memo: '신발' },
    ],
  }
}

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

  const cells = buildCells(year, month)
  const entriesByDate = buildDummyEntries(year, month)

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
                  .reduce((s, e) => s + e.amount, 0)
                const expense = dayEntries
                  .filter((e) => e.type === 'EXPENSE')
                  .reduce((s, e) => s + e.amount, 0)
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
