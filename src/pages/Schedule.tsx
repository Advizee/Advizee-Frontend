import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/schedule.css";

type BookedSlot = string;

const STATIC_BOOKED: Record<string, BookedSlot[]> = {
  [dayjs().format("YYYY-MM-DD")]: ["11:00", "14:30", "18:00"],
  [dayjs().add(1, "day").format("YYYY-MM-DD")]: ["09:30", "12:00", "16:30"],
  [dayjs().add(3, "day").format("YYYY-MM-DD")]: ["10:00", "10:30", "20:00"],
};

interface Props {
  onClose?: () => void;
}

const ScheduleWithSlotsStatic: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

  const isSlotDisabled = (slotHHmm: string) => {
    if (!selectedDate) return true;
    const date = dayjs(selectedDate).format("YYYY-MM-DD");
    const slotDT = dayjs(`${date}T${slotHHmm}`);
    if (bookedSlots.includes(slotHHmm)) return true;
    const now = dayjs();
    if (dayjs(selectedDate).isSame(now, "day") && slotDT.isBefore(now)) return true;
    return false;
  };

  useEffect(() => {
    if (loadingSlots) return;
    if (!selectedDate) return;
    if (selectedTime) return; 
    const firstAvailable = timeSlots.find((s) => !isSlotDisabled(s));
    if (firstAvailable) {
      const idx = timeSlots.indexOf(firstAvailable);
      const targetPage = Math.floor(idx / PAGE_SIZE);
      if (targetPage !== page) setPage(targetPage);
      setSelectedTime(firstAvailable);
    }
    
  }, [loadingSlots, bookedSlots, selectedDate, timeSlots]);

  //Will change it once integrate backend (Ashish)
  const submitBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    if (!name || !email || !phone) { alert("Please fill name, email and phone."); return; }
    if (isSlotDisabled(selectedTime)) { alert("This slot is not available."); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 450));
    setBookedSlots(prev => [...prev, selectedTime]);
    setSubmitting(false);
    setConfirmed(true);
  };

  const resetAndClose = () => {
    setName(""); setEmail(""); setPhone("");
    setSelectedTime(null); setConfirmed(false);
    onClose?.();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box two-column-layout">
        <button className="close-btn" onClick={resetAndClose}><X size={18} /></button>

        {!confirmed ? (
          <>
            <h1 className="schedule-title">Schedule a Meeting</h1>
            <div className="schedule-grid">
              <div className="left-column">
                <p className="choose-label">Select a Suitable Date & Time</p>

                <div className="calendar-area">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => setSelectedDate(d ?? undefined)}
                  />
                </div>

                <div className="slots-area">
                  <div className="combined-pagination">
                    <div className="pagination-controls" role="navigation" aria-label="Time slot pages">
                      <button className="page-btn" onClick={goFirst} disabled={page === 0} aria-label="First page">⏮</button>
                      <button className="page-btn" onClick={goPrev} disabled={page === 0} aria-label="Previous page"><ChevronLeft size={14} /></button>
                      <div className="page-indicator-compact">Page {page + 1} / {totalPages}</div>
                      <button className="page-btn" onClick={goNext} disabled={page >= totalPages - 1} aria-label="Next page"><ChevronRight size={14} /></button>
                      <button className="page-btn" onClick={goLast} disabled={page >= totalPages - 1} aria-label="Last page">⏭</button>
                    </div>

                    <div className="slots-summary">
                      Showing {pageSlots.length} of {timeSlots.length} slots
                    </div>
                  </div>

                  {loadingSlots ? (
                    <div className="slots-loading">Loading available times…</div>
                  ) : (
                    <>
                      <div className="slots-grid compact" role="list" aria-label="Available time slots">
                        {pageSlots.map((t) => {
                          const disabled = isSlotDisabled(t);
                          const selected = t === selectedTime;
                          return (
                            <button
                              key={t}
                              className={classNames("slot-btn", { disabled, selected })}
                              onClick={() => !disabled && setSelectedTime(t)}
                              disabled={disabled}
                              aria-pressed={selected}
                              aria-disabled={disabled}
                              role="listitem"
                            >
                              <span className="slot-time">{dayjs(`2000-01-01T${t}`).format("hh:mm A")}</span>
                              {disabled ? <span className="slot-busy">Booked</span> : selected ? <Check size={14} /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="right-column">
                <div className="form-stack">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" />
                  </div>

                  <div style={{ marginTop: 12 }} />

                  <div className="form-actions-vertical">
                    <button className="btn confirm-btn" onClick={submitBooking} disabled={!selectedTime || submitting}>
                      {submitting ? "Booking…" : "Confirm"}
                    </button>
                    <button className="btn secondary" onClick={() => { setSelectedTime(null); setName(""); setEmail(""); setPhone(""); }}>
                      Clear
                    </button>
                  </div>

                  <div className="small-note">
                    📌 Meetings scheduled will use Google Meet.
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="confirmation-box">
            <h2>✅ Your Meeting is Scheduled!</h2>

            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>

            <p>
              <strong>Date & Time:</strong><br />
              {selectedDate ? dayjs(selectedDate).format("DD MMM YYYY, hh:mm A") : "—"}
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
