import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const SUbjecctCard = () => {
  const [subject, setSubject] = useState("");
  const [currentLecture, setCurrentLecture] = useState(0);
  const [totalLectures, setTotalLectures] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulating data fetching from a database
    const fetchData = async () => {
      // Replace this with actual API call
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            subject: "subject",
            currentLecture: 5,
            totalLectures: 20,
          });
        }, 1000)
      );

      setSubject(response.subject);
      setCurrentLecture(response.currentLecture);
      setTotalLectures(response.totalLectures);
    };

    fetchData();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const incrementTotalLectures = () => {
    setTotalLectures((prev) => prev + 1);
  };

  const decrementTotalLectures = () => {
    setTotalLectures((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const incrementCurrentLecture = () => {
    setCurrentLecture((prev) => (prev < totalLectures ? prev + 1 : prev));
  };

  const decrementCurrentLecture = () => {
    setCurrentLecture((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const progressPercentage = (currentLecture / totalLectures) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        aria-label="Lecture Progress Card"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{subject}</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700">
            Lecture {currentLecture} of {totalLectures}
          </span>
          <button
            onClick={toggleModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            aria-label="Toggle lecture settings"
          >
            Edit
          </button>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {progressPercentage.toFixed(1)}% Complete
        </p>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Lecture Settings</h3>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Lectures
              </label>
              <div className="flex items-center">
                <button
                  onClick={decrementTotalLectures}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                  aria-label="Decrease total lectures"
                >
                  <FaMinus />
                </button>
                <span className="bg-gray-100 text-gray-800 font-medium py-2 px-4">
                  {totalLectures}
                </span>
                <button
                  onClick={incrementTotalLectures}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                  aria-label="Increase total lectures"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Lecture
              </label>
              <div className="flex items-center">
                <button
                  onClick={decrementCurrentLecture}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                  aria-label="Decrease current lecture"
                >
                  <FaMinus />
                </button>
                <span className="bg-gray-100 text-gray-800 font-medium py-2 px-4">
                  {currentLecture}
                </span>
                <button
                  onClick={incrementCurrentLecture}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                  aria-label="Increase current lecture"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SUbjecctCard;
