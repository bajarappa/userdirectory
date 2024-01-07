import React, { useState, useEffect } from "react";
import axios from "axios";

const Clock = ({ selectedCountry }) => {
  const [timeData, setTimeData] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [pausedUnixTime, setPausedUnixTime] = useState(null);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios.get(
          `http://worldtimeapi.org/api/timezone/${selectedCountry}`
        );
        setTimeData(response.data);

        // If pausedUnixTime is set, calculate the paused time
        if (isPaused && pausedUnixTime !== null) {
          const elapsedPausedTime = Math.floor(
            (Date.now() - pausedUnixTime) / 1000
          );
          const updatedUnixTime = Math.floor(
            timeData.unixtime + elapsedPausedTime
          );
          setTimeData({
            ...timeData,
            unixtime: updatedUnixTime,
          });
        }
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
  }, [isPaused, pausedUnixTime, selectedCountry]);

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      setPausedUnixTime(null); // Reset paused time when unpausing
    } else {
      setIsPaused(true);
      setPausedUnixTime(timeData.unixtime); // Set paused time when pausing
    }
  };

  const getDisplayTime = () => {
    return new Date(timeData.unixtime * 1000).toLocaleTimeString();
  };

  return (
    <div className="flex justify-between gap-4">
      <p>{getDisplayTime()}</p>
      <button onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</button>
    </div>
  );
};

export default Clock;
