import React, { useEffect, useState } from "react";
import { BiTime } from "react-icons/bi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../AuthContext";

const SubjectScheduleForm = () => {
  const initialFormState = {
    subject: "",
    customSubject: "",
    selectedDay: "",
    startTime: "",
    endTime: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [subjectInp, setSubjectInp] = useState([]);
  const userobj  = useAuth(); 
  const username = userobj.user.username;      
 

  const daysOfWeek = [
    { name: "Sunday", value: 1 },
    { name: "Monday", value: 2 },
    { name: "Tuesday", value: 3 },
    { name: "Wednesday", value: 4 },
    { name: "Thursday", value: 5 },
    { name: "Friday", value: 6 },
    { name: "Saturday", value: 7 }
  ];

  useEffect(() => {
    const fetchAllSubjects = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/ScheduleNew?username=${username}`);
        setSubjectInp(res.data.map(item => item.subject));
      } catch (e) {
        console.error("Error fetching subjects", e);
      }
    };
    fetchAllSubjects();
  
  }, []); 

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      selectedDay: day
    }));
    setErrors(prev => ({
      ...prev,
      days: ""
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject && !formData.customSubject) {
      newErrors.subject = "Please select or enter a subject";
    }
    if (!formData.selectedDay) {
      newErrors.days = "Please select a day";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Please enter a start time";
    }
    if (!formData.endTime) {
      newErrors.endTime = "Please enter an end time";
    }
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.time = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      const selectedDayObj = daysOfWeek.find(day => day.name === formData.selectedDay);
      
      const submittedData = {
        subject: formData.subject === "custom" ? formData.customSubject : formData.subject,
        day: selectedDayObj ? selectedDayObj.value : null, 
        startTime: formData.startTime,
        endTime: formData.endTime,
        username: username 
      };
  
      try {
        await axios.post("http://localhost:8800/ScheduleNew", submittedData);
        
        toast.success("New Schedule added successfully!");
        resetForm();
        
        const refreshSubjects = async () => {
          try {
            const res = await axios.get(`http://localhost:8800/ScheduleNew?username=${username}`);
            setSubjectInp(res.data.map(item => item.subject));
          } catch (e) {
            console.error("Error refreshing subjects", e);
          }
        };
        refreshSubjects();
  
      } catch (err) {
        console.error("Schedule creation error:", err);
        const errorMessage = err.response?.data?.message || "Failed to schedule subject";
        toast.error(errorMessage);
        if (err.response?.status === 400) {
          setErrors(prev => ({
            ...prev,
            form: "Please check all fields and try again"
          }));
        }
      }
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border-2 border-sky-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Schedule a Subject</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <div className="relative">
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              aria-label="Select a subject"
            >
              <option value="">Select a subject</option>
              {subjectInp.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
              <option value="custom">Custom subject</option>
            </select>
          </div>
          {formData.subject === "custom" && (
            <input
              type="text"
              name="customSubject"
              value={formData.customSubject}
              onChange={handleChange}
              placeholder="Enter custom subject"
              className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              aria-label="Enter custom subject"
            />
          )}
          {errors.subject && (
            <p className="mt-2 text-sm text-red-600" id="subject-error">
              {errors.subject}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Day of the Week</label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map(({ name }) => (
              <button
                key={name}
                type="button"
                onClick={() => handleDayToggle(name)}
                className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  formData.selectedDay === name
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-pressed={formData.selectedDay === name}
                aria-label={`Select ${name}`}
              >
                {name}
              </button>
            ))}
          </div>
          {errors.days && (
            <p className="mt-2 text-sm text-red-600" id="days-error">
              {errors.days}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiTime className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                aria-label="Select start time"
              />
            </div>
            {errors.startTime && (
              <p className="mt-2 text-sm text-red-600" id="startTime-error">
                {errors.startTime}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiTime className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                aria-label="Select end time"
              />
            </div>
            {errors.endTime && (
              <p className="mt-2 text-sm text-red-600" id="endTime-error">
                {errors.endTime}
              </p>
            )}
          </div>
        </div>

        {errors.time && (
          <p className="mt-2 text-sm text-red-600" id="time-error">
            {errors.time}
          </p>
        )}

        <div className="pt-5">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Schedule Subject
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default SubjectScheduleForm;