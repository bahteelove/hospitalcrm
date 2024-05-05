import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import axios from 'axios';

import '../style/newBooking.css';


function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
function fakeFetch(date, { signal }) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3];

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

const initialValue = dayjs('2022-05-1');

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, onSelect, ...other } = props;

  const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  const handleClick = () => {
    onSelect(props.day); // Call onSelect with the clicked day
  };

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '🔴' : undefined}
      onClick={handleClick} // Attach onClick event handler
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function DateCalendarServerRequest() {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
  const [selectedDate, setSelectedDate] = React.useState(null); // Add selectedDate state
  const [selectedTime, setSelectedTime] = React.useState(null); // Add selectedTime state

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month starts from 0
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
  
    return formattedDateTime;
  }

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDayClick = (day) => {
    setSelectedDate(day); // Set the selected date
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time); // Set the selected time
  };

  const handleSubmit = () => {
    try {

        const newSlot = {
            doctor_id : 2, 
            doctor_name : "Dr. Smith", 
            patient_id : 6, 
            patient_name : "Zuck", 
            time : `${selectedDate.format('YYYY-MM-DD')}, ${selectedTime}`, 
            status : "taken", 
            status_time : getCurrentDateTime()
        }

        // Send POST request to add a new time slot
        axios.post(`http://localhost:3080/addnewtimeslot`, newSlot)
        
        alert('Appointment booked successfully!');
        
    } catch (error) {
        console.log('Error adding new time slot:', error);
    }
};



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: (props) => (
            <ServerDay {...props} onSelect={handleDayClick} /> // Pass onSelect prop
          ),
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
      />
      {selectedDate && (
        <>
          <p>Selected Date: {selectedDate.format('YYYY-MM-DD')}</p>
          <div>
            {/* Render time slots */}
            <div className='time-slot' onClick={() => handleTimeClick("09:00 AM")}>9:00 AM</div>
            <div className='time-slot' onClick={() => handleTimeClick("10:00 AM")}>10:00 AM</div>
            <div className='time-slot' onClick={() => handleTimeClick("11:00 AM")}>11:00 AM</div>
            <div className='time-slot' onClick={() => handleTimeClick("02:00 PM")}>2:00 PM</div>
            <div className='time-slot' onClick={() => handleTimeClick("03:00 PM")}>3:00 PM</div>
          </div>
        </>
      )}
      {selectedTime && <p className='selected-time'>Selected Time: {selectedTime}</p>}

      <>
      
      <button onClick={handleSubmit} > submit </button>
      
      </>
    </LocalizationProvider>
  );
}
