import React from 'react';
import { useEvents } from '../context/EventContext';
import { isToday } from '../utils/dateHelpers';

const DayCell = ({ day, dateKey, year, month, onClick }) => {
  const { events } = useEvents();

  const dayEvents = events[dateKey] || [];

  const isTodayCell = isToday(year, month, day);
  const hasEvents = dayEvents.length > 0;

  const className = [
    'day-cell',
    isTodayCell ? 'today' : '',
    hasEvents ? 'has-events' : ''
  ].join(' ').trim();

  return (
    <div className={className} onClick={onClick}>
      <div className="day-number">{day}</div>

      <div className="events-container">
        {dayEvents.slice(0, 3).map(event => (
          <div
            key={event.id}
            className={`event-badge category-${event.category}`}
            title={event.title}
          >
            {event.title}
          </div>
        ))}

        {dayEvents.length > 3 && (
          <div className="more-events">
            +{dayEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;