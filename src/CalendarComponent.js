// src/CalendarComponent.js
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;
    setEvents([
      ...events,
      {
        ...newEvent,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
      },
    ]);
    setNewEvent({ title: "", start: "", end: "" });
    setOpen(false);
  };

  return (
    <div>
      <button className="btn" onClick={() => setOpen(true)}>Add Event</button>

      <Popup open={open} onClose={() => setOpen(false)} modal>
        <div className="modal">
          <h3>Add New Event</h3>
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) =>
              setNewEvent({ ...newEvent, start: e.target.value })
            }
          />
          <input
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) =>
              setNewEvent({ ...newEvent, end: e.target.value })
            }
          />
          <button className="btn" onClick={handleAddEvent}>Add Event</button>
        </div>
      </Popup>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
      />
    </div>
  );
};

export default CalendarComponent;
