import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const ToggleTable = () => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [schedule, setSchedule] = useState({
    Monday: [
      { id: 1, subject: "Mathematics", startTime: "09:00", endTime: "10:30" },
      { id: 2, subject: "Physics", startTime: "11:00", endTime: "12:30" },
      { id: 3, subject: "Chemistry", startTime: "14:00", endTime: "15:30" },
    ],
    Tuesday: [
      { id: 1, subject: "English", startTime: "09:00", endTime: "10:30" },
      { id: 2, subject: "History", startTime: "11:00", endTime: "12:30" },
      { id: 3, subject: "Geography", startTime: "14:00", endTime: "15:30" },
    ],
    // Add schedules for other days here
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [errors, setErrors] = useState({});

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const handleEditEvent = (event) => {
    setEditingEvent({ ...event });
  };

  const handleUpdateEvent = () => {
    if (validateEvent(editingEvent)) {
      const updatedSchedule = { ...schedule };
      const eventIndex = updatedSchedule[selectedDay].findIndex((e) => e.id === editingEvent.id);
      updatedSchedule[selectedDay][eventIndex] = editingEvent;
      setSchedule(updatedSchedule);
      setEditingEvent(null);
      setErrors({});
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setErrors({});
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedSchedule = { ...schedule };
      updatedSchedule[selectedDay] = updatedSchedule[selectedDay].filter((e) => e.id !== eventId);
      setSchedule(updatedSchedule);
    }
  };

  const validateEvent = (event) => {
    const newErrors = {};
    if (!event.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(event.startTime)) {
      newErrors.startTime = "Invalid start time format (HH:MM)";
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(event.endTime)) {
      newErrors.endTime = "Invalid end time format (HH:MM)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Schedule Management</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Day:</h2>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => handleDayChange(day)}
              className={`px-4 py-2 rounded-full ${
                selectedDay === day
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 hover:bg-indigo-100"
              } transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">{selectedDay}'s Schedule</h2>
        <div className="space-y-4">
          {schedule[selectedDay]?.map((event) => (
            <div
              key={event.id}
              className="bg-gray-50 p-4 rounded-md hover:shadow-md transition-shadow duration-200 ease-in-out"
            >
              {editingEvent && editingEvent.id === event.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingEvent.subject}
                    onChange={(e) => setEditingEvent({ ...editingEvent, subject: e.target.value })}
                    className={`w-full p-2 border rounded ${errors.subject ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Subject"
                  />
                  {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingEvent.startTime}
                      onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                      className={`w-1/2 p-2 border rounded ${errors.startTime ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Start Time (HH:MM)"
                    />
                    <input
                      type="text"
                      value={editingEvent.endTime}
                      onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                      className={`w-1/2 p-2 border rounded ${errors.endTime ? "border-red-500" : "border-gray-300"}`}
                      placeholder="End Time (HH:MM)"
                    />
                  </div>
                  {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}
                  {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime}</p>}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleUpdateEvent}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      aria-label="Save changes"
                    >
                      <FiCheck className="inline-block mr-1" /> Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                      aria-label="Cancel editing"
                    >
                      <FiX className="inline-block mr-1" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{event.subject}</h3>
                    <p className="text-gray-600">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-500 hover:text-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      aria-label={`Edit ${event.subject}`}
                    >
                      <FiEdit2 className="inline-block" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      aria-label={`Delete ${event.subject}`}
                    >
                      <FiTrash2 className="inline-block" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToggleTable;