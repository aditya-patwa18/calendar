import React from 'react';
import DayCell from './DayCell';
import { formatDateKey } from '../utils/dateHelpers';

const CalendarGrid = ({
  year,
  month,
  onDateClick,
  getDaysInMonth,
  getFirstDayOfMonth
}) => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const totalDays = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const cells = [];

  for (let i = 0; i < startDay; i++) {
    cells.push(
      <div key={`empty-${i}`} className="empty-cell" />
    );
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateKey = formatDateKey(year, month, day);

    cells.push(
      <DayCell
        key={dateKey}
        day={day}
        dateKey={dateKey}
        year={year}
        month={month}
        onClick={() =>
          onDateClick({ year, month, day, dateKey })
        }
      />
    );
  }

  return (
    <div className="calendar-grid-container">
      <div className="weekdays-header">
        {weekdays.map(label => (
          <div key={label} className="weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {cells}
      </div>
    </div>
  );
};

export default CalendarGrid;