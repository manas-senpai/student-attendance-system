import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaEllipsisV } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../AuthContext";


const SubjectCard = ({ subjectData, onUpdate, onDelete }) => {
  const [subject, setSubject] = useState(subjectData.subject);
  const [present, setPresent] = useState(subjectData.present);
  const [total, setTotal] = useState(subjectData.total);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuth();
  const username = user.user.username;

  const attendancePercentage = Math.round((present / total) * 100);

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 75) {
      return {
        text: 'text-emerald-700',
        bg: 'bg-emerald-100',
        progress: 'bg-emerald-500',
        border: 'border-emerald-200'
      };
    } else {
      return {
        text: 'text-rose-700',
        bg: 'bg-rose-100',
        progress: 'bg-rose-500',
        border: 'border-rose-200'
      };
    }
  };

  const statusColors = getAttendanceStatus(attendancePercentage);

  const handleIncrement = (type) => {
    if (type === "present") {
      setPresent((prev) => Math.min(prev + 1, total));
    } else {
      setTotal((prev) => prev + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === "present") {
      setPresent((prev) => Math.max(prev - 1, 0));
    } else {
      setTotal((prev) => Math.max(prev - 1, present));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updatedData = {
        subject,
        present,
        total,
        username
      };
      console.log(updatedData);
      await axios.put(
        `http://localhost:8800/update/`,
        updatedData
      );
      await onUpdate(updatedData);

      toast.success("Data updated successfully!");
      setIsMenuOpen(false);
    } catch (error) {
      if (error.response) {
        toast.error(`Update failed: ${error.response.data.message || 'Please try again'}`);
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Failed to update data. Please try again.");
      }
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8800/delete/${subject}/${username}`);
      await onDelete({ subject, username });
      toast.success("Subject deleted successfully!");
    } catch (error) {
      if (error.response) {
        toast.error(`Delete failed: ${error.response.data.message || 'Please try again'}`);
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Failed to delete subject. Please try again.");
      }
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 transition-all duration-300 hover:shadow-lg">
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{subject}</h2>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <FaEllipsisV />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Attendance</span>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors.text} ${statusColors.bg} border ${statusColors.border}`}>
              {attendancePercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className={`${statusColors.progress} h-2.5 rounded-full transition-all duration-300 ease-in-out`}
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
        </div>

        <p className="text-md text-gray-600 mb-4">
          Present/Total: {present}/{total}
        </p>

        {isMenuOpen && (
          <div className="bg-gray-100 p-4 rounded-md shadow-inner transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Present</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecrement("present")}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
                  aria-label="Decrement present"
                >
                  <FaMinus size={12} />
                </button>
                <span className="text-lg font-bold">{present}</span>
                <button
                  onClick={() => handleIncrement("present")}
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300"
                  aria-label="Increment present"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecrement("total")}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
                  aria-label="Decrement total"
                >
                  <FaMinus size={12} />
                </button>
                <span className="text-lg font-bold">{total}</span>
                <button
                  onClick={() => handleIncrement("total")}
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300"
                  aria-label="Increment total"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-1/2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Updating..." : "Submit"}
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className={`w-1/2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// export default SubjectCard;

const OverallCard = ({ subjects }) => {
  const calculateOverallPercentage = () => {
    if (subjects.length === 0) return 0;

    const totalPercentage = subjects.reduce((sum, subject) => {
      const percentage = Math.round((subject.present / subject.total) * 100);
      return sum + percentage;
    }, 0);

    return Math.round(totalPercentage / subjects.length);
  };

  const overallPercentage = calculateOverallPercentage();
  const statusColors = getAttendanceStatus(overallPercentage);

  return (
    <div className="max-w-md mx-auto bg-gray-50 rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Overall Attendance</h2>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Average Attendance</span>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors.text} ${statusColors.bg} border ${statusColors.border}`}>
              {overallPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className={`${statusColors.progress} h-2.5 rounded-full transition-all duration-300 ease-in-out`}
              style={{ width: `${overallPercentage}%` }}
            ></div>
          </div>
        </div>

        <p className="text-md text-gray-600 mb-4">
          Total Subjects: {subjects.length}
        </p>
      </div>
    </div>
  );
};

const getAttendanceStatus = (percentage) => {
  if (percentage >= 75) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-100',
      progress: 'bg-emerald-500',
      border: 'border-emerald-200'
    };
  } else {
    return {
      text: 'text-rose-700',
      bg: 'bg-rose-100',
      progress: 'bg-rose-500',
      border: 'border-rose-200'
    };
  }
};

const Percentage = ({ subjects = [], onUpdateSubject }) => {
  const [subjectsData, setSubjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuth();
  const username = user.user.username;
  useEffect(() => {
    if (subjects.length > 0) {
      setSubjectsData(subjects);
      setIsLoading(false);
    } else {
      fetchDataFromDatabase();
    }
  }, []);

  const fetchDataFromDatabase = async () => {
    try {

      const response = await axios.get(`http://localhost:8800/?username=${username}`);
      setSubjectsData(response.data);
    } catch (error) {
      toast.error("Failed to fetch subjects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubject = async (updatedData) => {
    try {
      if (onUpdateSubject) {
        await onUpdateSubject(updatedData);
      }

      setSubjectsData(prevData =>
        prevData.map(subject =>
          subject.id === updatedData.id ? updatedData : subject
        )
      );
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <OverallCard subjects={subjectsData} />
      {subjectsData.map((subject) => (
        <SubjectCard
          key={subject.id}
          subjectData={subject}
          onUpdate={handleUpdateSubject}
        />
      ))}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Percentage;