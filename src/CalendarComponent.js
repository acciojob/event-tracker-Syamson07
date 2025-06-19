import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popup from 'reactjs-popup';
import './styles.css';
import EventPopup from './EventPopup';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filter, setFilter] = useState('all');

  const openPopup = ({ start }) => setSelectedDate(start);
  const closePopup = () => {
    setSelectedDate(null);
    setEditingEvent(null);
  };

  const saveEvent = (newEvent) => {
    setEvents(prev =>
      editingEvent
        ? prev.map(ev => (ev.id === editingEvent.id ? { ...ev, ...newEvent } : ev))
        : [...prev, newEvent]
    );
    closePopup();
  };

  const deleteEvent = () => {
    setEvents(prev => prev.filter(ev => ev.id !== editingEvent.id));
    closePopup();
  };

  const getFilteredEvents = () => {
    const now = new Date();
    if (filter === 'past') return events.filter(ev => ev.start < now);
    if (filter === 'upcoming') return events.filter(ev => ev.start >= now);
    return events;
  };

  return (
    <div className="calendar-container">
      <div className="filter-btns">
        <button className="btn" onClick={() => setFilter('all')}>All</button>
        <button className="btn" onClick={() => setFilter('past')}>Past</button>
        <button className="btn" onClick={() => setFilter('upcoming')}>Upcoming</button>
        <button
          className="btn"
          data-cy="create-event"
          onClick={() => setSelectedDate(new Date())}
        >
          Create Event
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={getFilteredEvents()}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 500 }}
        onSelectSlot={openPopup}
        onSelectEvent={event => setEditingEvent(event)}
        eventPropGetter={event => {
          const isPast = event.start < new Date();
          return {
            style: {
              backgroundColor: isPast ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)',
              borderRadius: '6px',
              color: 'white',
            },
          };
        }}
      />

      {(selectedDate || editingEvent) && (
        <Popup open modal onClose={closePopup}>
          <EventPopup
            selectedDate={selectedDate}
            editingEvent={editingEvent}
            onSave={saveEvent}
            onDelete={deleteEvent}
            onClose={closePopup}
          />
        </Popup>
      )}
    </div>
  );
};

export default CalendarComponent;
