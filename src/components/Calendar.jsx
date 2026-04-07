import React, { useState } from 'react';
import useCalendar from '../hooks/useCalendar';
import CalendarGrid from './CalendarGrid';
import { useEvents } from '../context/EventContext';
import {
  getMonthName,
  getSeasonClass,
  getMonthQuote,
  formatDateKey,
  getVideoSeason
} from '../utils/dateHelpers';
import EventModal from './EventModal';
import '../styles/calendar.css';

const Calendar = () => {
  const calendar = useCalendar();
  const eventData = useEvents();

  const { currentDate, nextMonth, prevMonth, goToToday, getDaysInMonth, getFirstDayOfMonth } = calendar;
  const { notes, addNote, deleteNote, events } = eventData;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthKey = `${year}-${month}`;

  const seasonClass = getSeasonClass(month);
  const activeVideo = getVideoSeason(month);

  const [selectedDate, setSelectedDate] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const currentNotes = notes[monthKey] || [];

  const changeMonth = (direction) => {
    setFlipDirection(direction === 'next' ? 'flip-next' : 'flip-prev');
    setIsFlipping(true);

    setTimeout(() => {
      direction === 'next' ? nextMonth() : prevMonth();
      setIsFlipping(false);
    }, 600);
  };

  const handleAddNote = (e) => {
    e.preventDefault();

    const text = noteInput.trim();
    if (!text) return;

    addNote(monthKey, text);
    setNoteInput('');
  };

  const getUpcomingEvents = () => {
    const list = [];
    const days = getDaysInMonth(year, month);

    for (let day = 1; day <= days; day++) {
      const key = formatDateKey(year, month, day);
      const dayEvents = events[key];

      if (dayEvents) {
        dayEvents.forEach(ev => {
          list.push({ ...ev, day, dateKey: key });
        });
      }
    }

    return list.slice(0, 5);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className={`wall-calendar-wrapper ${seasonClass}`}>
      
      <div className="video-backgrounds">
        <img src="/jan-apr.gif" className={`bg-vid ${activeVideo === 'jan-apr' ? 'active' : ''}`} />
        <img src="/may-aug.gif" className={`bg-vid ${activeVideo === 'may-aug' ? 'active' : ''}`} />
        <img src="/sep-dec.gif" className={`bg-vid ${activeVideo === 'sep-dec' ? 'active' : ''}`} />
        <div className="video-overlay"></div>
      </div>

      <div className="calendar-header-actions">
        <button className="today-btn" onClick={goToToday}>Today</button>
      </div>

      <div className={`wall-calendar ${isFlipping ? flipDirection : ''}`}>
        
        <div className="binder-rings">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="ring">
              <div className="ring-hole"></div>
            </div>
          ))}
        </div>

        <div className="calendar-content">
          
          <header className="calendar-header">
            <button className="nav-btn prev" onClick={() => changeMonth('prev')}>&#8592;</button>

            <div className="month-title">
              <h2>{getMonthName(month)} {year}</h2>
              <p className="month-quote">{getMonthQuote(month)}</p>
            </div>

            <button className="nav-btn next" onClick={() => changeMonth('next')}>&#8594;</button>
          </header>

          <div className="calendar-body">
            
            <CalendarGrid
              year={year}
              month={month}
              onDateClick={setSelectedDate}
              getDaysInMonth={getDaysInMonth}
              getFirstDayOfMonth={getFirstDayOfMonth}
            />

            <aside className="calendar-sidebar">
              
              <div className="sidebar-section highlights">
                <h3>This Month's Highlights</h3>

                {upcomingEvents.length ? (
                  <ul className="highlight-list">
                    {upcomingEvents.map((ev, i) => (
                      <li
                        key={i}
                        className={`highlight-item category-${ev.category}`}
                        onClick={() =>
                          setSelectedDate({
                            year,
                            month,
                            day: ev.day,
                            dateKey: ev.dateKey
                          })
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="hl-day">{ev.day}</span>
                        <span className="hl-title">{ev.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-state">No events scheduled.</p>
                )}
              </div>

              <div className="sidebar-section notes-section">
                <h3>Monthly Notes</h3>

                <ul className="notes-list">
                  {currentNotes.map(note => (
                    <li key={note.id} className="note-card">
                      <span>{note.text}</span>
                      <button
                        className="delete-note-btn"
                        onClick={() => {
                          if (window.confirm('Delete this note?')) {
                            deleteNote(monthKey, note.id);
                          }
                        }}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="add-note-form">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddNote(e)}
                    placeholder="Add a note..."
                  />
                  <button onClick={handleAddNote}>+</button>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>

      {selectedDate && (
        <EventModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default Calendar;