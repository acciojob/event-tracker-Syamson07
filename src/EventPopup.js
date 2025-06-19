import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

const EventPopup = ({ selectedDate, editingEvent, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setLocation(editingEvent.location);
    } else {
      setTitle('');
      setLocation('');
    }
  }, [editingEvent]);

  const handleSave = () => {
    const newEvent = {
      id: editingEvent?.id || uuid(),
      title,
      location,
      start: editingEvent?.start || selectedDate,
      end: editingEvent?.end || selectedDate,
    };
    onSave(newEvent);
  };

  return (
    <div className="popup-content">
      <h3>{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
      <input placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Event Location" value={location} onChange={e => setLocation(e.target.value)} />

      <div className="popup-actions">
        {editingEvent && (
          <button className="mm-popup__btn--danger" onClick={onDelete}>Delete</button>
        )}
        <div className="mm-popup__box__footer__right-space">
          <button className="mm-popup__btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
