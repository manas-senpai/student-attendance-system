import React, { useEffect, useState } from "react";
import { FiClock, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContext";

const TodaysSchedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(getCurrentDayNumber());
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth(); 
  
  function getCurrentDayNumber() {
    const today = new Date();
    let day = today.getDay() + 1; 
    return day;
  }

  const dayMapping = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday"
  };

  useEffect(() => {
    fetchAllEvents();
  }, [selectedDay]); 

  const fetchAllEvents = async () => {
    
    try {
      const res = await axios.get(`http://localhost:8800/TodaysSchedule`, {
        params: {
          day: selectedDay,
          username: user.username 
        }
      });
      setEvents(res.data);
    } catch (e) {
      console.error("Error fetching events", e);
    }
};

  const handleDelete = async (event) => {
    if (!event || isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      const response = await axios.delete('http://localhost:8800/TodaysSchedule', {
        data: {
          subject: event.subject,
          day: selectedDay,
          start_time: event.start_time
        }
      });

      if (response.status === 200) {
        toast.success("Successfully deleted")
        const updatedEvents = events.filter(e => 
          !(e.subject === event.subject && 
            e.start_time === event.start_time)
        );
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg border-2 border-sky-100">
      <div className="mb-6">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(Number(e.target.value))}
          className="w-full p-2 rounded-md border-2 border-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {Object.entries(dayMapping).map(([value, day]) => (
            <option key={value} value={value}>
              {day}
            </option>
          ))}
        </select>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {dayMapping[selectedDay]}'s Events
      </h1>
      
      {events.length === 0 ? (
        <p className="text-center text-gray-600">No events scheduled for this day</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event, index) => (
            <Event 
              key={`${event.subject}-${event.start_time}-${index}`}
              event={event} 
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const Event = ({ event, onDelete, isDeleting }) => {
  return (
    <li className="bg-gray-50 p-4 rounded-md transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-400 border-2 border-sky-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
          {event.subject}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-gray-600">
            <FiClock className="mr-2" />
            <span>
              <time>{event.start_time}</time> - <time>{event.end_time}</time>
            </span>
          </div>
          <button
            onClick={() => onDelete(event)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 disabled:text-gray-400 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
            title="Delete event"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodaysSchedule;