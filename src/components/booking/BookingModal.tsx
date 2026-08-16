import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Activity,
  MessageCircle,
  FileCheck
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { clinicInfo } from '../../data/clinicInfo';
import { servicesData } from '../../data/services';
import { conditionsData } from '../../data/conditions';
import { AppointmentRequest } from '../../types';

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onAppointmentBooked?: (appointment: AppointmentRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onAppointmentBooked
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [service, setService] = useState<string>(
    preselectedService || 'Chiropractic & Wellness Consultation'
  );
  const [condition, setCondition] = useState<string>('Back Pain');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('11:00 AM');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [symptomDuration, setSymptomDuration] = useState('1 to 3 months');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<AppointmentRequest | null>(null);

  // Generate next 7 days for quick booking
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const timeSlots = [
    { time: '10:30 AM', period: 'Morning' },
    { time: '11:30 AM', period: 'Morning' },
    { time: '12:30 PM', period: 'Morning' },
    { time: '02:30 PM', period: 'Afternoon' },
    { time: '03:30 PM', period: 'Afternoon' },
    { time: '04:30 PM', period: 'Afternoon' },
    { time: '05:30 PM', period: 'Evening' },
    { time: '06:30 PM', period: 'Evening' },
    { time: '07:30 PM', period: 'Evening' }
  ];

  const handleNext = () => {
    const currentErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!service) currentErrors.service = 'Please select a service or consultation.';
      if (!condition) currentErrors.condition = 'Please select your primary condition.';
    } else if (step === 2) {
      if (!selectedDate) currentErrors.date = 'Please select a date.';
      if (!selectedSlot) currentErrors.slot = 'Please select a time slot.';
    } else if (step === 3) {
      if (!fullName.trim() || fullName.trim().length < 3) {
        currentErrors.fullName = 'Please enter your full name.';
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        currentErrors.phone = 'Please enter a valid 10-digit mobile number.';
      }
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setErrors({});
    if (step === 3) {
      submitBooking();
    } else {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  };

  const submitBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newBooking: AppointmentRequest = {
        id: `HE-${Math.floor(100000 + Math.random() * 900000)}`,
        fullName,
        phone,
        email: email || undefined,
        preferredService: service,
        primaryCondition: condition,
        preferredDate: selectedDate,
        preferredTimeSlot: selectedSlot,
        symptomDuration,
        additionalNotes: notes || undefined,
        createdAt: new Date().toISOString(),
        status: 'Confirmed'
      };

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('holistic_edge_appointments') || '[]');
        localStorage.setItem('holistic_edge_appointments', JSON.stringify([newBooking, ...existing]));
      } catch (err) {
        console.error('Storage error', err);
      }

      setBookingConfirmation(newBooking);
      if (onAppointmentBooked) {
        onAppointmentBooked(newBooking);
      }
      setIsSubmitting(false);
      setStep(4);
    }, 600);
  };

  const resetForm = () => {
    setStep(1);
    setBookingConfirmation(null);
    onClose();
  };

  return (
    <Modal
      id="appointment-booking-modal"
      isOpen={isOpen}
      onClose={resetForm}
      title={step === 4 ? 'Appointment Confirmed' : 'Book Clinic Consultation'}
      subtitle={
        step === 4
          ? 'We look forward to welcoming you at Holistic Edge in Mehdipatnam.'
          : 'Schedule your clinical consultation with Dr. Abdul Mallik'
      }
      maxWidth="xl"
    >
      {/* Progress Indicators */}
      {step < 4 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[#736C63] mb-2 font-serif">
            <span className={step >= 1 ? 'text-[#0F2747] font-bold' : ''}>1. Service & Condition</span>
            <span className={step >= 2 ? 'text-[#0F2747] font-bold' : ''}>2. Date & Time</span>
            <span className={step >= 3 ? 'text-[#0F2747] font-bold' : ''}>3. Patient Details</span>
          </div>
          <div className="h-1.5 w-full bg-[#E8E4DC] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#0F2747] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: Service & Condition Selection */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] font-serif mb-2">
              Select Care Option
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Highlighted General Consultation Option */}
              <button
                type="button"
                onClick={() => setService('Chiropractic & Wellness Consultation')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  service === 'Chiropractic & Wellness Consultation'
                    ? 'border-[#1A1A1A] bg-[#F0F4F8] ring-2 ring-[#0F2747]/20'
                    : 'border-[#E8E4DC] hover:border-[#D5CFC5] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0F2747] flex items-center gap-1 font-serif">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    Recommended
                  </span>
                  <Badge variant="editorial" size="sm">
                    Standard Visit
                  </Badge>
                </div>
                <div className="text-sm font-bold text-[#1A1A1A] font-serif">
                  Chiropractic & Wellness Consultation
                </div>
                <div className="text-xs text-[#5A544E] mt-0.5">
                  Full clinical screening & recovery plan discussion
                </div>
              </button>

              {/* A.M.M Method Option */}
              <button
                type="button"
                onClick={() => setService('A.M.M Method™ (Full Protocol)')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  service === 'A.M.M Method™ (Full Protocol)'
                    ? 'border-[#1A1A1A] bg-[#F0F4F8] ring-2 ring-[#0F2747]/20'
                    : 'border-[#E8E4DC] hover:border-[#D5CFC5] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="editorial" size="sm">
                    Flagship Protocol
                  </Badge>
                </div>
                <div className="text-sm font-bold text-[#1A1A1A] font-serif">
                  The A.M.M Method™
                </div>
                <div className="text-xs text-[#5A544E] mt-0.5">
                  Adjustment + Mobilization + Muscle Rehab
                </div>
              </button>

              {servicesData
                .filter(s => s.slug !== 'amm-method')
                .map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setService(s.title)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      service === s.title
                        ? 'border-[#1A1A1A] bg-[#F0F4F8] ring-2 ring-[#0F2747]/20'
                        : 'border-[#E8E4DC] hover:border-[#D5CFC5] bg-white'
                    }`}
                  >
                    <div className="text-sm font-bold text-[#1A1A1A] font-serif">{s.title}</div>
                    <div className="text-xs text-[#736C63] mt-0.5 line-clamp-1">
                      {s.subtitle}
                    </div>
                  </button>
                ))}
            </div>
            {errors.service && (
              <p className="text-xs text-[#9B2C2C] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.service}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] font-serif mb-2">
              Primary Concern / Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {conditionsData.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.title)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition-all ${
                    condition === c.title
                      ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A]'
                      : 'bg-[#FAF8F5] text-[#2C2926] border-[#E8E4DC] hover:border-[#D5CFC5] hover:bg-white'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Date and Time Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] font-serif mb-2 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#0F2747]" />
              Select Consultation Date
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {availableDates.map(item => (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedDate === item.dateStr
                      ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A] shadow-md'
                      : 'bg-white text-[#2C2926] border-[#E8E4DC] hover:border-[#D5CFC5]'
                  }`}
                >
                  <span className="text-[11px] font-medium block uppercase opacity-80">
                    {item.dayName}
                  </span>
                  <span className="text-lg font-bold block my-0.5 font-serif">{item.dayNumber}</span>
                  <span className="text-[10px] block opacity-80">{item.month}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] font-serif mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F2747]" />
              Select Convenient Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    selectedSlot === slot.time
                      ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm'
                      : 'bg-[#FAF8F5] text-[#2C2926] border-[#E8E4DC] hover:border-[#D5CFC5] hover:bg-white'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#736C63] mt-2">
              * Consultations are scheduled to minimize clinic wait times.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: Patient Details */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-1">
              Patient Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8A847C] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Mohammed Ahmed"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E4DC] text-sm text-[#1A1A1A] placeholder-[#8A847C] focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] outline-none"
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-[#9B2C2C] mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-1">
              Mobile Phone Number (WhatsApp Enabled) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8A847C] absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 81426 42051"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E4DC] text-sm text-[#1A1A1A] placeholder-[#8A847C] focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] outline-none"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-[#9B2C2C] mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-1">
                How Long Have You Had Symptoms?
              </label>
              <select
                value={symptomDuration}
                onChange={e => setSymptomDuration(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8E4DC] text-sm text-[#1A1A1A] focus:border-[#1A1A1A] outline-none bg-white"
              >
                <option value="Less than 2 weeks">Less than 2 weeks</option>
                <option value="1 to 3 months">1 to 3 months</option>
                <option value="3 to 6 months">3 to 6 months</option>
                <option value="Over 1 year (Chronic)">Over 1 year (Chronic)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="For booking confirmation receipt"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8E4DC] text-sm text-[#1A1A1A] placeholder-[#8A847C] focus:border-[#1A1A1A] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-1">
              Specific Pain Triggers or Previous MRI/X-ray Reports
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Pain shoots down right thigh when sitting; had lumbar X-ray 2 months ago..."
              className="w-full p-3 rounded-xl border border-[#E8E4DC] text-sm text-[#1A1A1A] placeholder-[#8A847C] focus:border-[#1A1A1A] outline-none"
            />
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E4DC] text-xs text-[#5A544E] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1B4332] flex-shrink-0" />
            <span>
              Your information is strictly confidential and reviewed directly by Dr. Abdul Mallik's clinical team.
            </span>
          </div>
        </div>
      )}

      {/* STEP 4: Confirmation Screen */}
      {step === 4 && bookingConfirmation && (
        <div className="space-y-5 text-center py-2">
          <div className="w-16 h-16 bg-[#EAF2ED] text-[#1B4332] rounded-full flex items-center justify-center mx-auto border border-[#C5DACB]">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <Badge variant="verified" size="md">
              Booking ID: {bookingConfirmation.id}
            </Badge>
            <h3 className="text-xl font-normal text-[#1A1A1A] font-serif mt-2">
              Consultation Scheduled!
            </h3>
            <p className="text-sm text-[#5A544E] max-w-md mx-auto mt-1">
              Thank you, <strong>{bookingConfirmation.fullName}</strong>. Your consultation request has been logged.
            </p>
          </div>

          {/* Ticket Summary */}
          <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-2xl p-4 text-left text-xs text-[#2C2926] space-y-2 max-w-md mx-auto">
            <div className="flex justify-between border-b border-[#E8E4DC] pb-2">
              <span className="text-[#736C63] font-medium">Care Selected:</span>
              <span className="font-bold text-[#1A1A1A]">{bookingConfirmation.preferredService}</span>
            </div>
            <div className="flex justify-between border-b border-[#E8E4DC] pb-2">
              <span className="text-[#736C63] font-medium">Condition:</span>
              <span className="font-bold text-[#1A1A1A]">{bookingConfirmation.primaryCondition}</span>
            </div>
            <div className="flex justify-between border-b border-[#E8E4DC] pb-2">
              <span className="text-[#736C63] font-medium">Date & Slot:</span>
              <span className="font-bold text-[#0F2747] font-serif">
                {bookingConfirmation.preferredDate} at {bookingConfirmation.preferredTimeSlot}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[#736C63] font-medium">Clinic Address:</span>
              <span className="font-medium text-[#1A1A1A] text-right">
                Susheel Apts, Backside Olive Hospital, Mehdipatnam
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
                `Hello Holistic Edge, I booked appointment ID: ${bookingConfirmation.id} for ${bookingConfirmation.fullName} on ${bookingConfirmation.preferredDate} at ${bookingConfirmation.preferredTimeSlot}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#143326] text-[#FAF9F6] px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Confirm on WhatsApp</span>
            </a>
            <Button variant="outline" onClick={resetForm}>
              Done / Close
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {step < 4 && (
        <div className="flex items-center justify-between border-t border-[#E8E4DC] pt-4 mt-6">
          {step > 1 ? (
            <Button
              variant="ghost"
              size="md"
              onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="accent"
            size="md"
            isLoading={isSubmitting}
            onClick={handleNext}
            rightIcon={step < 3 ? <ArrowRight className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
          >
            {step === 3 ? 'Confirm Appointment' : 'Continue'}
          </Button>
        </div>
      )}
    </Modal>
  );
};
