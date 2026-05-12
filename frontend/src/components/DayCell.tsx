type Props = {
  day: number
  weekday: number
  isCurrentMonth: boolean
  isToday?: boolean
  isSelected?: boolean
  income: number
  expense: number
  onClick?: () => void
}

function fmt(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export default function DayCell({
  day,
  weekday,
  isCurrentMonth,
  isToday,
  isSelected,
  income,
  expense,
  onClick,
}: Props) {
  const hasData = income !== 0 || expense !== 0
  const total = income - expense

  return (
    <button
      type="button"
      className={
        'day-cell' +
        (isCurrentMonth ? '' : ' other-month') +
        (isToday ? ' today' : '') +
        (isSelected ? ' selected' : '')
      }
      onClick={onClick}
    >
      <div className={`day-num wd-${weekday}`}>{day}</div>
      {isCurrentMonth && hasData && (
        <div className="amounts">
          {income > 0 && <div className="amount income">+{fmt(income)}</div>}
          {expense > 0 && <div className="amount expense">-{fmt(expense)}</div>}
          <div className="amount total">
            {total >= 0 ? '+' : ''}
            {fmt(total)}
          </div>
        </div>
      )}
    </button>
  )
}
