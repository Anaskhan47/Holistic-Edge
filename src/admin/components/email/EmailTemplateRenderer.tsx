import React from 'react';

export interface EmailTemplateData {
  patientName?: string;
  registrationTokenNumber?: string;
  reminderDate?: string;
  reminderTime?: string;
  serviceName?: string;
  customMessage?: string;
  templateType?: string;
  bookingUrl?: string;
  practitionerName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
}

export function EmailTemplateRenderer({
  patientName = 'Arjun Mehta',
  registrationTokenNumber = 'HE-250515-0017',
  reminderDate = 'Wednesday, 21 May 2025',
  reminderTime = '10:30 AM',
  serviceName = 'Chiropractic Consultation',
  customMessage = 'Thank you for choosing Holistic Edge Wellness Centre. Your appointment has been successfully confirmed.',
  bookingUrl = '#',
  practitionerName = 'Healer Abdul Mallik',
  clinicAddress = 'Ground Floor, Susheel Apartments, Backside Olive Hospital, Mehdipatnam, Hyderabad - 500028',
  clinicPhone = '+91 81426 42051',
}: EmailTemplateData) {
  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-8 px-2 sm:px-4  text-slate-700 min-h-[500px]">
      <div className="max-w-[600px] mx-auto space-y-4 sm:space-y-6">
        
        {/* 1. Official Logo at Top */}
        <div className="text-center py-2 bg-[#F8FAFC]">
          <img
            src="/brand/holistic-edge-official-logo.png"
            alt="Holistic Edge Wellness Centre"
            className="h-14 sm:h-16 mx-auto object-contain max-w-[260px] sm:max-w-[280px]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/brand/holistic-edge-logo-transparent.png';
            }}
          />
        </div>

        {/* 2. Main White Content Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left space-y-5">
          
          {/* Title Header */}
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0F2747] tracking-tight">
              Your Appointment is Confirmed
            </h1>
            <div className="w-8 h-1 bg-[#2D6A4F] mx-auto rounded-full" />
          </div>

          {/* Intro & Greeting */}
          <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
            <p className="font-bold text-[#0F2747] text-base">
              Dear {patientName},
            </p>
            <p className="text-slate-600">
              {customMessage || 'Thank you for choosing Holistic Edge Wellness Centre. Your appointment has been successfully confirmed.'}
            </p>
          </div>

          {/* Appointment Details Card */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl overflow-hidden p-4 sm:p-5 space-y-2.5">
            <div className="font-serif font-bold text-sm text-[#0F2747] pb-2 border-b border-slate-200 flex items-center gap-1.5">
              <span>📅</span>
              <span>Appointment Details</span>
            </div>
            
            <div className="space-y-2 text-xs sm:text-sm pt-1">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Registration / Token No:</span>
                <span className="font-bold text-[#0F2747] font-mono">{registrationTokenNumber}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Date:</span>
                <span className="font-bold text-[#0F2747]">{reminderDate}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Time:</span>
                <span className="font-bold text-[#0F2747]">{reminderTime}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Service:</span>
                <span className="font-bold text-[#0F2747]">{serviceName}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Practitioner:</span>
                <span className="font-bold text-[#0F2747]">{practitionerName}</span>
              </div>

              <div className="pt-1 text-xs text-slate-600 leading-relaxed">
                <span className="text-slate-500 font-medium block mb-0.5">Location:</span>
                <strong className="text-[#0F2747] block">{clinicAddress}</strong>
              </div>
            </div>
          </div>

          {/* Primary CT• Button */}
          <div className="text-center pt-2">
            <a
              href={bookingUrl}
              onClick={e => e.preventDefault()}
              className="inline-block bg-[#0F2747] hover:bg-[#1A365D] text-white font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-lg shadow-sm transition-all"
            >
              VIEW APPOINTMENT DETAILS &rarr;
            </a>
          </div>

          <p className="text-xs text-slate-500 text-center pt-1">
            If you need to reschedule or have questions, please call us directly at <strong className="text-[#0F2747]">{clinicPhone}</strong>.
          </p>

        </div>

        {/* 3. Footer */}
        <div className="text-center space-y-1.5 text-xs text-slate-500 pt-2 pb-4">
          <div className="font-serif font-bold text-[#0F2747] tracking-wide text-xs">
            HOLISTIC EDGE WELLNESS CENTRE
          </div>
          <p className="text-[11px] text-slate-500">
            Ground Floor, Susheel Apartments, Behind Olive Hospital, Mehdipatnam, Hyderabad - 500028
          </p>
          <p className="text-[11px] text-slate-500">
            Ph: {clinicPhone} &nbsp;|&nbsp; www.holisticedge.in
          </p>
          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed">
            This is an automated message. Please do not reply directly to this email.
            <div className="mt-2 text-[11px] text-slate-500">
              Website crafted by{' '}
              <a
                href="https://www.arklintech.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit ARKLINTECH website"
                className="text-[#0F2747] font-bold tracking-[3.5px] uppercase no-underline hover:underline"
                style={{ fontFamily: "'Syncopate', 'Syne', sans-serif" }}
              >
                ARKLINTECH
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

