import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from 'react-toastify';
import { useAuth } from '../../AuthContext';

const AttendanceCard = (props) => {
    const [isPresent, setIsPresent] = useState(null);
    const user = useAuth();
    const username = user.user.username;

    const handleAttendance = (status) => {
        setIsPresent(status);
        if(status){
            const postAttendance = async () => {
                try {
                    const updatedData = {
                        ...props,
                        username 
                      };
                    await axios.post("http://localhost:8800/AttendanceCardT", updatedData);
                    toast.success("Attendance updated successfully");
                    setTimeout(() => {
                        props.onRemove(props.id);
                    }, 1000); 
                } catch (e) {
                    toast.error("Error setting attendance", e);
                }
            };
            postAttendance();
        }
        else{
            const postAttendance = async () => {
                try {
                    const updatedData = {
                        ...props,
                        username 
                      };

                    await axios.post("http://localhost:8800/AttendanceCardF", updatedData);
                    console.log(props)
                    toast.success("Attendance updated successfully");
                    setTimeout(() => {
                        props.onRemove(props.id);
                    }, 1000); 
                } catch (e) {
                    toast.error("Error setting attendance", e);
                }
            };
            postAttendance();
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl border-2 border-sky-100 overflow-hidden md:max-w-l m-4 transition-all duration-300 hover:shadow-lg">
            <div className="w-full flex justify-around items-center">
                <div className="p-1">
                    <h2 className="block mt-1 text-lg leading-tight font-medium text-black text-left">{props.subject}</h2>
                    <p className="mt-2 text-gray-500 text-left">{props.startTime} to {props.endTime}</p>
                </div>
                <div className="flex space-x-4 mb-4 mt-4 flex-col md:flex-row">
                    <button
                        onClick={() => handleAttendance(true)}
                        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${isPresent === true ? "bg-green-500 text-white" : "bg-green-100 text-green-800"} hover:bg-green-600 hover:text-white transition-colors duration-300`}
                        aria-label="Mark as present"
                    >
                        <FaCheckCircle className="mr-2" />
                        Present
                    </button>
                    <button
                        onClick={() => handleAttendance(false)}
                        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${isPresent === false ? "bg-red-500 text-white" : "bg-red-100 text-red-800"} hover:bg-red-600 hover:text-white transition-colors duration-300`}
                        aria-label="Mark as absent"
                    >
                        <FaTimesCircle className="mr-2" />
                        Absent
                    </button>
                    
                </div>
            </div>
        </div>
    );
};


const AttendanceTracker = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user  = useAuth();
    const username = user.user.username;

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/AttendanceCard?username=${username}`);
                const data = response.data.data;
                if (data.counter === 1) {
                    setAttendanceData([]);
                    setLoading(false);
                    return;
                }
    
                const dataWithIds = data.map((item, index) => ({
                    ...item,
                    id: index + 1,
                    startTime: formatTime(item.start_time),
                    endTime: formatTime(item.end_time)
                }));
                console.log(dataWithIds);
                setAttendanceData(dataWithIds);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch attendance data');
                setLoading(false);
            }
        };
        fetchAttendanceData();
    }, []);

    

    const formatTime = (timeString) => {
        try {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours));
            date.setMinutes(parseInt(minutes));
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (err) {
            return timeString;
        }
    };

    const handleRemoveCard = (id) => {
        setAttendanceData(prevData => prevData.filter(item => item.id !== id));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {attendanceData.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                    No attendance data to display
                </div>
            ) : (
                attendanceData.map((item) => (
                    <AttendanceCard
                        key={item.id}
                        id={item.id}
                        subject={item.subject}
                        startTime={item.startTime}
                        endTime={item.endTime}
                        onRemove={handleRemoveCard}
                    />
                ))
            )}
        </div>
    );
};

export default AttendanceTracker;