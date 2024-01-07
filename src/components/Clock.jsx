import React, { useState, useEffect } from "react";
import axios from "axios";

const Clock = ({ selectedCountry }) => {
  const [timeData, setTimeData] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [initialTime, setInitialTime] = useState(null);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios.get(
          `http://worldtimeapi.org/api/timezone/${selectedCountry}`
        );
        setTimeData(response.data);
        setInitialTime(Date.now());
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    const interval = setInterval(() => {
      if (!isPaused) {
        fetchTime();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, selectedCountry]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getDisplayTime = () => {
    if (isPaused) {
      return timeData.utc_datetime; // Display the paused time
    } else {
      const elapsedSeconds = isPaused
        ? 0
        : Math.floor((Date.now() - initialTime) / 1000);
      const updatedUnixTime = timeData.unixtime + elapsedSeconds;

      // Handling Date object creation more gracefully
      const updatedDateTime = new Date(updatedUnixTime * 1000).toLocaleString(
        "en-US",
        { timeZone: timeData.timezone }
      );

      return updatedDateTime;
    }
  };

  return (
    <div>
      <h3>Current Time</h3>
      <p>{getDisplayTime()}</p>
      <p>Time Zone: {timeData.timezone}</p>
      <button onClick={togglePause}>{isPaused ? "Start" : "Pause"}</button>
    </div>
  );
};

export default Clock;
