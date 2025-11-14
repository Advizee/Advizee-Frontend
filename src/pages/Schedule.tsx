// src/pages/ScheduleWithSlotsStatic.tsx
import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/schedule.css";

type BookedSlot = string; // "HH:mm"

const STATIC_BOOKED: Record<string, BookedSlot[]> = {
  [dayjs().format("YYYY-MM-DD")]: ["11:00", "14:30", "18:00"],
  [dayjs().add(1, "day").format("YYYY-MM-DD")]: ["09:30", "12:00", "16:30"],
  [dayjs().add(3, "day").format("YYYY-MM-DD")]: ["10:00", "10:30", "20:00"],
};

interface Props {
  onClose?: () => void;
}

const ScheduleWithSlotsStatic: React.FC<Props> = ({ onClose }) => {
  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // calendar & slots state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // config
  const OFFICE_START_HOUR = 9; // 09:00
  const OFFICE_END_HOUR = 23;  // last allowed start (23:00)
  const STEP_MINUTES = 30;

  // pagination config for time slots
  const PAGE_SIZE = 9; // shows 9 slots per page (3 x 3 compact grid)
  const [page, setPage] = useState(0);

  // load static booked slots when selectedDate changes
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

  // generate time slots for the selectedDate
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const date = dayjs(selectedDate).startOf("day");
    const start = date.hour(OFFICE_START_HOUR).minute(0).second(0);
    const end = date.hour(OFFICE_END_HOUR).minute(0).second(0);
    const slots: string[] = [];
    let cur = start;
    // Note: use cur.isBefore(end) || cur.isSame(end) to avoid dayjs plugin requirement
    while (cur.isBefore(end) || cur.isSame(end)) {
      slots.push(cur.format("HH:mm"));
      cur = cur.add(STEP_MINUTES, "minute");
    }
    return slots;
  }, [selectedDate]);

  // pagination helpers
  const totalPages = Math.max(1, Math.ceil(timeSlots.length / PAGE_SIZE));
  useEffect(() => {
    if (page >= totalPages) setPage(totalPages - 1);
  }, [totalPages, page]);

  const pageSlots = useMemo(() => {
    const start = page * PAGE_SIZE;
    return timeSlots.slice(start, start + PAGE_SIZE);
  }, [timeSlots, page]);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));
  const goFirst = () => setPage(0);
  const goLast = () => setPage(totalPages - 1);

  // disabled logic: booked or past (for same day)
  const isSlotDisabled = (slotHHmm: string) => {
    if (!selectedDate) return true;
    const date = dayjs(selectedDate).format("YYYY-MM-DD");
    const slotDT = dayjs(`${date}T${slotHHmm}`);
    // booked
    if (bookedSlots.includes(slotHHmm)) return true;
    // past for today
    const now = dayjs();
    if (dayjs(selectedDate).isSame(now, "day") && slotDT.isBefore(now)) return true;
    return false;
  };

  // demo "booking" — marks locally and shows confirmation
  const submitBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    if (!name || !email || !phone) {
      alert("Please fill name, email and phone.");
      return;
    }
    if (isSlotDisabled(selectedTime)) {
      alert("This slot is not available.");
      return;
    }

    setSubmitting(true);
    // simulate server latency
    await new Promise((r) => setTimeout(r, 450));
    // mark slot as booked in the local state
    setBookedSlots((prev) => [...prev, selectedTime]);
    setSubmitting(false);
    setConfirmed(true);
  };

  // compact helper displays
  const selectedDateLabel = selectedDate ? dayjs(selectedDate).format("dddd, DD MMM YYYY") : "Pick a date";

  return (
    <div className="popup-overlay">
      <div className="popup-box schedule-grid">
        <button className="close-btn" onClick={() => onClose?.()}><X size={18} /></button>

        {!confirmed ? (
          <>
            <h1 className="schedule-title">Schedule a Meeting</h1>
            <p className="schedule-subtitle">Choose date & time</p>

            <div className="schedule-main">
              <div className="schedule-calendar">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => setSelectedDate(d ?? undefined)}
                />
              </div>

              <div className="schedule-right">
                <div className="selected-day">
                  <strong>{selectedDateLabel}</strong>
                </div>

                <div className="slots-wrap">
                  {loadingSlots ? (
                    <div className="slots-loading">Loading available times…</div>
                  ) : (
                    <>
                      <div className="slots-pagination top">
                        <button className="page-btn" onClick={goFirst} disabled={page === 0}><ChevronLeft size={14} style={{ transform: "rotate(180deg)" }} /></button>
                        <button className="page-btn" onClick={goPrev} disabled={page === 0}><ChevronLeft size={14} /></button>
                        <div className="page-indicator">Page {page + 1} / {totalPages}</div>
                        <button className="page-btn" onClick={goNext} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
                        <button className="page-btn" onClick={goLast} disabled={page >= totalPages - 1}><ChevronRight size={14} style={{ transform: "rotate(180deg)" }} /></button>
                      </div>

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

                      <div className="slots-footer">
                        <div className="page-legend">Showing {pageSlots.length} of {timeSlots.length} slots</div>
                        <div className="page-controls">
                          <button className="link-btn" onClick={() => setPage(0)} disabled={page === 0}>First</button>
                          <button className="link-btn" onClick={goPrev} disabled={page === 0}>Prev</button>
                          <button className="link-btn" onClick={goNext} disabled={page >= totalPages - 1}>Next</button>
                          <button className="link-btn" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>Last</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="form-section compact-form">
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

                  <div className="form-actions compact-actions">
                    <button className="btn confirm-btn" onClick={submitBooking} disabled={!selectedTime || submitting}>
                      {submitting ? "Booking…" : `Confirm ${selectedTime ?? ""}`}
                    </button>
                    <button className="btn secondary" onClick={() => { setSelectedTime(null); setConfirmed(false); }}>
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="confirmation-box">
            <h2>✅ Booking confirmed</h2>
            <p><strong>{name}</strong> — {email} — {phone}</p>
            <p><strong>Date & Time:</strong> {selectedDate ? dayjs(selectedDate).format("DD MMM YYYY") : ""} {selectedTime}</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary" onClick={() => onClose?.()}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleWithSlotsStatic;
