import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { getMonthName } from '../utils/dateHelpers';
import '../styles/modal.css';

const EventModal = ({ date, onClose }) => {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { dateKey, year, month, day } = date;

  const dayEvents = events[dateKey] || [];

  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    time: '',
    category: 'work'
  });

  const [error, setError] = useState('');
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);

      try {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&start_date=${dateStr}&end_date=${dateStr}`
        );

        const data = await res.json();

        if (data?.daily?.time?.length) {
          setWeather({
            max: data.daily.temperature_2m_max[0],
            min: data.daily.temperature_2m_min[0],
            code: data.daily.weathercode[0]
          });
        }
      } catch (err) {
        console.error('Weather fetch failed', err);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [year, month, day]);

  const getWeatherDetails = (code, max) => {
    let extra = '';

    if (max !== undefined) {
      if (max <= 18) extra = ' Wear something warm.';
      else if (max >= 35) extra = ' Stay hydrated.';
    }

    if (code === 0) return { icon: '☀️', text: 'Clear', advice: 'Good for outdoors.' + extra };
    if (code <= 3) return { icon: '⛅', text: 'Cloudy', advice: 'Pleasant weather.' + extra };
    if (code <= 48) return { icon: '🌫️', text: 'Foggy', advice: 'Low visibility.' + extra };
    if (code <= 67) return { icon: '🌧️', text: 'Rainy', advice: 'Carry an umbrella.' + extra };
    if (code <= 77) return { icon: '❄️', text: 'Snow', advice: 'Heavy winter clothes needed.' + extra };
    if (code <= 82) return { icon: '🌦️', text: 'Showers', advice: 'Keep umbrella handy.' + extra };
    if (code >= 95) return { icon: '⛈️', text: 'Storm', advice: 'Stay indoors.' + extra };

    return { icon: '🌤️', text: 'Fair', advice: 'Enjoy your day.' + extra };
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  const handleEdit = (ev) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      description: ev.description || '',
      time: ev.time || '',
      category: ev.category || 'work'
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this event?')) return;

    deleteEvent(dateKey, id);

    if (editingEvent?.id === id) {
      setEditingEvent(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', time: '', category: 'work' });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    if (editingEvent) {
      updateEvent(dateKey, { ...editingEvent, ...form });
      setEditingEvent(null);
    } else {
      addEvent(dateKey, form);
    }

    resetForm();
  };

  const weatherInfo = weather ? getWeatherDetails(weather.code, weather.max) : null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">

        <header className="modal-header">
          <div>
            <h2>{getMonthName(month)} {day}, {year}</h2>

            {loadingWeather ? (
              <span className="weather-info">Loading weather...</span>
            ) : weather ? (
              <div>
                <span className="weather-info">
                  {weatherInfo.icon} {weather.max}°C / {weather.min}°C ({weatherInfo.text})
                </span>
                <p className="weather-advice">{weatherInfo.advice}</p>
              </div>
            ) : (
              <span className="weather-info">Weather unavailable</span>
            )}
          </div>

          <button className="close-modal-btn" onClick={onClose}>
            &times;
          </button>
        </header>

        <div className="modal-body">

          <div className="events-list-pane">
            <h3>Scheduled Events</h3>

            {dayEvents.length === 0 ? (
              <div className="empty-events-state">No events for this day.</div>
            ) : (
              <ul className="modal-events-list">
                {dayEvents.map(ev => (
                  <li key={ev.id} className={`modal-event-item category-${ev.category}`}>
                    <div>
                      <h4>{ev.title}</h4>
                      {ev.time && <span className="event-time">{ev.time}</span>}
                      {ev.description && <p className="event-desc">{ev.description}</p>}
                    </div>

                    <div className="modal-event-actions">
                      <button onClick={() => handleEdit(ev)}>✏️</button>
                      <button onClick={() => handleDelete(ev.id)}>🗑️</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="event-form-pane">
            <h3>{editingEvent ? 'Edit Event' : 'Add Event'}</h3>

            <form onSubmit={handleSubmit} className="event-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="urgent">Urgent</option>
                    <option value="leisure">Leisure</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-actions">
                {editingEvent && (
                  <button type="button" onClick={() => {
                    setEditingEvent(null);
                    resetForm();
                  }}>
                    Cancel
                  </button>
                )}

                <button type="submit">
                  {editingEvent ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventModal;