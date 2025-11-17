import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/schedule.css";
import { X } from "lucide-react";

import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

type BookedSlot = string;

const STATIC_BOOKED: Record<string, BookedSlot[]> = {
  [dayjs().format("YYYY-MM-DD")]: ["11:00", "14:30", "18:00"],
  [dayjs().add(1, "day").format("YYYY-MM-DD")]: ["09:30", "12:00", "16:30"],
  [dayjs().add(3, "day").format("YYYY-MM-DD")]: ["10:00", "10:30", "20:00"],
};

interface Props {
  onClose?: () => void;
}

const Schedule: React.FC<ScheduleProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);

  const [confirmed, setConfirmed] = useState(false);
  const OFFICE_START_HOUR = 9;
  const OFFICE_END_HOUR = 23;
  const STEP_MINUTES = 30;
  const PAGE_SIZE = 9; 
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSelectedTime(null); 
    setPage(0);
    const t = setTimeout(() => {
      const iso = dayjs(selectedDate).format("YYYY-MM-DD");
      setBookedSlots(STATIC_BOOKED[iso] ?? []);
      setLoadingSlots(false);
    }, 120);
    return () => clearTimeout(t);
  }, [selectedDate]);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const date = dayjs(selectedDate).startOf("day");
    const start = date.hour(OFFICE_START_HOUR).minute(0).second(0);
    const end = date.hour(OFFICE_END_HOUR).minute(0).second(0);
    const slots: string[] = [];
    let cur = start;
    while (cur.isBefore(end) || cur.isSame(end)) {
      slots.push(cur.format("HH:mm"));
      cur = cur.add(STEP_MINUTES, "minute");
    }
    return slots;
  }, [selectedDate]);

  const totalPages = Math.max(1, Math.ceil(timeSlots.length / PAGE_SIZE));
  useEffect(() => { if (page >= totalPages) setPage(totalPages - 1); }, [totalPages, page]);

  const pageSlots = useMemo(() => timeSlots.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE), [timeSlots, page]);

  const goPrev = () => setPage(p => Math.max(0, p - 1));
  const goNext = () => setPage(p => Math.min(totalPages - 1, p + 1));
  const goFirst = () => setPage(0);
  const goLast = () => setPage(totalPages - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !selectedDateTime) {
      alert("⚠️ Please fill all fields and select date & time.");
      return;
    }

    setConfirmed(true);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box two-column-layout">
        <button className="close-btn" onClick={resetAndClose}><X size={18} /></button>

        {!confirmed ? (
          <>
            <h1 className="schedule-title">Schedule a Meeting</h1>
            <p className="schedule-subtitle">Fill in your details</p>

            {/* Form */}
            <form className="schedule-form" onSubmit={handleSubmit}>

              {/* Name */}
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="right-column">
                <div className="form-stack">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
                  </div>

              {/* Date-Time Picker */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Select Date & Time"
                  value={selectedDateTime}
                  onChange={(newValue) => setSelectedDateTime(newValue)}
                   ampm={false}                         
  timeSteps={{ minutes: 30 }}  
                    
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      sx: { background: "#fff", marginBottom: 3 },
                    },
                    popper: {
                      disablePortal: false,
                      sx: { zIndex: 9999999 },
                    },
                  }}
                />
              </LocalizationProvider>

              {/* Crispy Note */}
              <div className="platform-note">
                📌 Your meeting will be scheduled in <strong>Google Meet</strong>.
              </div>

              <button type="submit" className="btn confirm-btn">
                Confirm Booking
              </button>
            </form>
          </>
        ) : (
          <div className="confirmation-box">
            <h2>✅ Your Meeting is Scheduled!</h2>

            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>

            <p>
              <strong>Date & Time:</strong><br />
              {selectedDateTime?.format("DD MMM YYYY, hh:mm A")}
            </p>

            <div className="email-note">
              📩 Your meeting link has been sent to your email.<br />
              If you can't find it, please check your <strong>Spam</strong> folder.
            </div>

            <button className="btn primary" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleWithSlotsStatic;
