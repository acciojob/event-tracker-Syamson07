import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './App.css';

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    location: '',
    start: null,
    end: null,
  });

  const handleSelectSlot = useCallback(({ start, end }) => {
    setNewEvent({
      title: '',
      location: '',
      start,
      end,
    });
    setIsOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  }, []);

  const handleAddEvent = () => {
    const eventToAdd = {
      ...newEvent,
      id: Date.now(),
    };
    setEvents([...events, eventToAdd]);
    setIsOpen(false);
    setNewEvent({
      title: '',
      location: '',
      start: null,
      end: null,
    });
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setIsEditOpen(false);
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    setIsEditOpen(false);
  };

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    if (filter === 'all') return true;
    if (filter === 'past') return event.end < now;
    if (filter === 'upcoming') return event.start >= now;
    return true;
  });

  const eventStyleGetter = (event) => {
    const now = new Date();
    let backgroundColor = '';
    if (event.end < now) {
      backgroundColor = 'rgb(222, 105, 135)'; // Past event - pink
    } else if (event.start >= now) {
      backgroundColor = 'rgb(140, 189, 76)'; // Upcoming event - green
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <div className="App">
      <h1>Event Tracker Calendar</h1>
      <div className="filter-buttons">
        <button className="btn" onClick={() => setFilter('all')}>
          All Events
        </button>
        <button className="btn" onClick={() => setFilter('past')}>
          Past Events
        </button>
        <button className="btn" onClick={() => setFilter('upcoming')}>
          Upcoming Events
        </button>
      </div>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '20px' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        defaultView="month"
      />

      {/* Add Event Popup */}
      <Popup open={isOpen} onClose={() => setIsOpen(false)} modal>
        <div className="mm-popup__box">
          <div className="mm-popup__box__header">
            <h3>Create New Event</h3>
          </div>
          <div className="mm-popup__box__body">
            <div className="form-group">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Event Location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mm-popup__box__footer">
            <div className="mm-popup__box__footer__right-space">
              <button className="mm-popup__btn" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button
                className="mm-popup__btn mm-popup__btn--primary"
                onClick={handleAddEvent}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Popup>

      {/* Edit/Delete Event Popup */}
      <Popup open={isEditOpen} onClose={() => setIsEditOpen(false)} modal>
        <div className="mm-popup__box">
          <div className="mm-popup__box__header">
            <h3>Event Options</h3>
          </div>
          <div className="mm-popup__box__body">
            <div className="form-group">
              <input
                type="text"
                placeholder="Event Title"
                value={selectedEvent?.title || ''}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Event Location"
                value={selectedEvent?.location || ''}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    location: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mm-popup__box__footer">
            <button
              className="mm-popup__btn mm-popup__btn--danger"
              onClick={handleDeleteEvent}
            >
              Delete
            </button>
            <div className="mm-popup__box__footer__right-space">
              <button
                className="mm-popup__btn"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="mm-popup__btn mm-popup__btn--primary"
                onClick={() => handleUpdateEvent(selectedEvent)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default App;