import React, { useState, useEffect, useRef, useCallback } from 'react';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TIME_SLOTS = HOURS.flatMap(hour => [0, 30].map(minutes => `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`));
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CLASS_TYPES = ['Math', 'Science', 'English', 'History', 'Art'];

const initialSchedule = DAYS.map(day => ({
  day,
  slots: TIME_SLOTS.map(time => ({
    time,
    isAvailable: false,
    isBooked: Math.random() < 0.2,
    classType: CLASS_TYPES[Math.floor(Math.random() * CLASS_TYPES.length)]
  }))
}));

const MemoizedSlot = React.memo(({ day, time, dayIndex, timeIndex, isAvailable, isBooked, classType, onToggle }) => {
  const handleClick = () => {
    if (!isBooked) {
      onToggle(dayIndex, timeIndex);
    }
  };

  return (
    <button 
      className={`w-full text-xs py-2 px-1 rounded transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
        isBooked 
          ? 'bg-blue-400 text-white cursor-not-allowed' 
          : (isAvailable 
              ? 'bg-green-400 hover:bg-green-500 text-white' 
              : 'bg-red-400 hover:bg-red-500 text-white')
      }`}
      onClick={handleClick}
      disabled={isBooked}
      title={isBooked ? classType : (isAvailable ? 'Available' : 'Closed')}
    >
      {time}
    </button>
  );
}, (prevProps, nextProps) => {
  return prevProps.isAvailable === nextProps.isAvailable && 
         prevProps.isBooked === nextProps.isBooked;
});

export default function Schedule() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [batchDay, setBatchDay] = useState('Weekdays');
  const [batchStartTime, setBatchStartTime] = useState('00:00');
  const [batchEndTime, setBatchEndTime] = useState('23:30');
  const [batchAction, setBatchAction] = useState('open');

  const scheduleRef = useRef(null);

  const formatDateRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const changeWeek = (weeks) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + weeks * 7);
    setSelectedDate(newDate);
  };

  const applyBatchChanges = () => {
    const startTimeIndex = TIME_SLOTS.indexOf(batchStartTime);
    const endTimeIndex = TIME_SLOTS.indexOf(batchEndTime);

    setSchedule(prevSchedule => {
      const newSchedule = prevSchedule.map((day, dayIndex) => {
        if (
          (batchDay === 'Weekdays' && dayIndex > 0 && dayIndex < 6) ||
          (batchDay === 'Weekend' && (dayIndex === 0 || dayIndex === 6)) ||
          batchDay === day.day
        ) {
          return {
            ...day,
            slots: day.slots.map((slot, slotIndex) => {
              if (slotIndex >= startTimeIndex && slotIndex <= endTimeIndex && !slot.isBooked) {
                return {
                  ...slot,
                  isAvailable: batchAction === 'open'
                };
              }
              return slot;
            })
          };
        }
        return day;
      });
      return newSchedule;
    });
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setBatchStartTime(newStartTime);
    if (batchEndTime < newStartTime) {
      setBatchEndTime(newStartTime);
    }
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    if (newEndTime >= batchStartTime) {
      setBatchEndTime(newEndTime);
    } else {
      setBatchEndTime('23:30');
    }
  };

  const getDateForDay = (date, dayIndex) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + dayIndex);
    return dayDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
  };

  const getScheduleStats = () => {
    let booked = 0, closed = 0, open = 0;
    schedule.forEach(day => {
      day.slots.forEach(slot => {
        if (slot.isBooked) booked++;
        else if (slot.isAvailable) open++;
        else closed++;
      });
    });
    return { booked, closed, open };
  };

  const handleSave = () => {
    console.log('Saving schedule...');
    // Implement save functionality here
  };

  const toggleSlot = useCallback((dayIndex, timeIndex) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule];
      const slot = newSchedule[dayIndex].slots[timeIndex];
      if (!slot.isBooked) {
        newSchedule[dayIndex].slots[timeIndex] = {
          ...slot,
          isAvailable: !slot.isAvailable
        };
      }
      return newSchedule;
    });
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => changeWeek(-1)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-blue-600 transition-colors">&lt;</button>
        <h2 className="text-lg sm:text-xl font-bold text-center">{formatDateRange(selectedDate)}</h2>
        <button onClick={() => changeWeek(1)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-blue-600 transition-colors">&gt;</button>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2 bg-white p-4 rounded-lg shadow">
        <div className="w-full flex flex-wrap items-center gap-2 mb-4">
          <select value={batchDay} onChange={(e) => setBatchDay(e.target.value)} className="border p-2 rounded">
            <option value="Weekdays">Weekdays</option>
            <option value="Weekend">Weekend</option>
            {DAYS.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <select 
            value={batchStartTime} 
            onChange={handleStartTimeChange} 
            className="border p-2 rounded"
          >
            {TIME_SLOTS.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <span>to</span>
          <select 
            value={batchEndTime} 
            onChange={handleEndTimeChange} 
            className="border p-2 rounded"
          >
            {TIME_SLOTS.filter(time => time >= batchStartTime).map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select value={batchAction} onChange={(e) => setBatchAction(e.target.value)} className="border p-2 rounded">
            <option value="open" className="bg-green-400 text-white">Open Slots</option>
            <option value="close" className="bg-red-400 text-white">Close Slots</option>
          </select>
          <button onClick={applyBatchChanges} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">Apply</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Save</button>
        </div>
      </div>
      <div className="w-full flex justify-center mb-4">
        <div className="flex space-x-4">
          {Object.entries(getScheduleStats()).map(([status, count]) => (
            <div key={status} className="flex items-center">
              <div className={`w-12 h-8 rounded mr-2 flex items-center justify-center text-white font-bold ${
                status === 'closed' ? 'bg-red-400' :
                status === 'open' ? 'bg-green-400' : 'bg-blue-400'
              }`}>
                {count}
              </div>
              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex bg-white p-4 rounded-lg shadow min-w-[1000px] gap-4" ref={scheduleRef}>
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="flex-1 min-w-[140px]">
              <div className="font-bold text-center mb-2">
                <div>{day}</div>
                <div className="text-sm text-gray-500">{getDateForDay(selectedDate, dayIndex)}</div>
              </div>
              <div className="space-y-1">
                {TIME_SLOTS.map((time, timeIndex) => {
                  const slot = schedule[dayIndex].slots[timeIndex];
                  return (
                    <MemoizedSlot
                      key={`${day}-${time}`}
                      day={day}
                      time={time}
                      dayIndex={dayIndex}
                      timeIndex={timeIndex}
                      isAvailable={slot.isAvailable}
                      isBooked={slot.isBooked}
                      classType={slot.classType}
                      onToggle={toggleSlot}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}