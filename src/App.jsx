// App.jsx
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [popupInfo, setPopupInfo] = useState({ open: false });
  const [filter, setFilter] = useState('all');

  const handleSelectSlot = ({ start }) => {
    setPopupInfo({ open: true, start, mode: 'create' });
  };

  const handleEventClick = (event) => {
    setPopupInfo({
      open: true,
      event,
      mode: 'edit'
    });
  };

  const saveEvent = (title, location) => {
    const start = popupInfo.start || popupInfo.event.start;
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const isPast = moment(start).isBefore(moment());

    const newEvent = {
      id: popupInfo.event ? popupInfo.event.id : Date.now(),
      title,
      location,
      start,
      end,
      isPast,
      bgColor: isPast ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)'
    };

    setEvents((prev) => {
      if (popupInfo.mode === 'edit') {
        return prev.map(e => e.id === popupInfo.event.id ? newEvent : e);
      } else {
        return [...prev, newEvent];
      }
    });
    setPopupInfo({ open: false });
  };

  const deleteEvent = () => {
    setEvents(events.filter(e => e.id !== popupInfo.event.id));
    setPopupInfo({ open: false });
  };

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'past') return e.isPast;
    if (filter === 'upcoming') return !e.isPast;
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>Event Tracker Calendar</h2>
      <div>
        <button className="btn" onClick={() => setFilter('all')}>All</button>
        <button className="btn" onClick={() => setFilter('past')}>Past</button>
        <button className="btn" onClick={() => setFilter('upcoming')}>Upcoming</button>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        style={{ height: 600, marginTop: 20 }}
        eventPropGetter={(event) => ({ style: { backgroundColor: event.bgColor } })}
      />

      <Popup open={popupInfo.open} closeOnDocumentClick onClose={() => setPopupInfo({ open: false })}>
        <div className="mm-popup__box">
          <div className="mm-popup__box__header">
            <h3>{popupInfo.mode === 'edit' ? 'Edit Event' : 'Create Event'}</h3>
          </div>
          <div className="mm-popup__box__content">
            <input placeholder="Event Title" defaultValue={popupInfo.event?.title || ''} id="event-title" />
            <input placeholder="Event Location" defaultValue={popupInfo.event?.location || ''} id="event-location" />
          </div>
          <div className="mm-popup__box__footer">
            {popupInfo.mode === 'edit' && (
              <button className="mm-popup__btn mm-popup__btn--danger" onClick={deleteEvent}>Delete</button>
            )}
            <div className="mm-popup__box__footer__right-space">
              <button className="mm-popup__btn mm-popup__btn--info" onClick={() => saveEvent(
                document.getElementById('event-title').value,
                document.getElementById('event-location').value
              )}>Save</button>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default App;
