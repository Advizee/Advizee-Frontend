import React, { useState } from "react";
import "../styles/schedule.css";
import { X } from "lucide-react";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface ScheduleProps {
  onClose: () => void;
}

const Schedule: React.FC<ScheduleProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);

  const [confirmed, setConfirmed] = useState(false);

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
      <div className="popup-box">
        <button className="close-btn" onClick={onClose}>
          <X size={22} />
        </button>

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

export default Schedule;
