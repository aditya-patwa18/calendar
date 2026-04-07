import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useLocalStorage('calendar-events', {});
  const [notes, setNotes] = useLocalStorage('calendar-notes', {});
  const [theme, setTheme] = useLocalStorage('calendar-theme', 'light');

  // EVENTS

  const addEvent = (dateKey, event) => {
    const item = { ...event, id: Date.now().toString() };

    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), item],
    }));
  };

  const updateEvent = (dateKey, updated) => {
    const list = (events[dateKey] || []).map(ev =>
      ev.id === updated.id ? updated : ev
    );

    setEvents(prev => ({
      ...prev,
      [dateKey]: list,
    }));
  };

  const deleteEvent = (dateKey, id) => {
    const list = (events[dateKey] || []).filter(ev => ev.id !== id);

    setEvents(prev => ({
      ...prev,
      [dateKey]: list,
    }));
  };

  // NOTES

  const addNote = (monthKey, text) => {
    const note = { id: Date.now().toString(), text };

    setNotes(prev => ({
      ...prev,
      [monthKey]: [...(prev[monthKey] || []), note],
    }));
  };

  const updateNote = (monthKey, id, text) => {
    const list = (notes[monthKey] || []).map(note =>
      note.id === id ? { ...note, text } : note
    );

    setNotes(prev => ({
      ...prev,
      [monthKey]: list,
    }));
  };

  const deleteNote = (monthKey, id) => {
    const list = (notes[monthKey] || []).filter(note => note.id !== id);

    setNotes(prev => ({
      ...prev,
      [monthKey]: list,
    }));
  };

  // THEME

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
  }, [theme]);

  return (
    <EventContext.Provider
      value={{
        events,
        notes,
        theme,
        addEvent,
        updateEvent,
        deleteEvent,
        addNote,
        updateNote,
        deleteNote,
        toggleTheme,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);