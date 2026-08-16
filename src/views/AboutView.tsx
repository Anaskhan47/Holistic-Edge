import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { clinicInfo } from '../data/clinicInfo';
import { teamData, clinicStaffNote } from '../data/team';
import clinicImg from '@/Clinc.png';
import {
  Award,
  Users,
  CheckCircle2,
  Quote,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export interface AboutViewProps {
  onOpenBooking: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onOpenBooking
}) => {
  const { detailId } = useParams<{ detailId: string }>();
  
  const [activeTab, setActiveTab] = useState<string>('story');

  useEffect(() => {
    if (detailId === 'dr-abdul-mallik') {
      setActiveTab('founder');
    } else if (detailId === 'team') {
      setActiveTab('team');
    } else {
      setActiveTab('story');
    }
  }, [detailId]);

  const founder = teamData.find(t => t.isFounder) || teamData[0];
  const staffMembers = teamData.filter(t => !t.isFounder);

  return (
    <div className="w-full py-12 md:py-20 bg-[#FAF9F6]">
      <Helmet>
        <title>About Us | Holistic Edge Chiropractic & Wellness Clinic</title>
        <meta name="description" content="Learn about Holistic Edge's 25-year history in Mehdipatnam, Hyderabad, and meet our founder Dr. Abdul Mallik and his clinical team." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="editorial" size="md">
            About Holistic Edge
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] font-serif tracking-tight">
            25 Years of Caring for Hyderabad's Spines & Joints
          </h1>
          <p className="text-sm sm:text-base text-[#5A544E] leading-relaxed">
            Founded by Dr. Abdul Mallik in Mehdipatnam, Holistic Edge provides personalized, drug-free, and non-surgical musculoskeletal healthcare to restore lasting pain-free movement.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'story'
                  ? 'bg-[#1A1A1A] text-[#FAF9F6] shadow-sm'
                  : 'bg-white text-[#2C2926] border border-[#E8E4DC] hover:border-[#D5CFC5]'
              }`}
            >
              Our 25-Year Story & Values
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('founder')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'founder'
                  ? 'bg-[#1A1A1A] text-[#FAF9F6] shadow-sm'
                  : 'bg-white text-[#2C2926] border border-[#E8E4DC] hover:border-[#D5CFC5]'
              }`}
            >
              Dr. Abdul Mallik (Founder)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'team'
                  ? 'bg-[#1A1A1A] text-[#FAF9F6] shadow-sm'
                  : 'bg-white text-[#2C2926] border border-[#E8E4DC] hover:border-[#D5CFC5]'
              }`}
            >
              Our Multidisciplinary Team (7)
            </button>
          </div>
        </div>

        {/* TAB 1: OUR STORY & VALUES */}
        {activeTab === 'story' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5 text-left">
                <Badge variant="editorial" size="sm">
                  The Journey Since 1999
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] font-serif">
                  From a Vision of Natural Healing to Over 50,000 Recoveries
                </h2>
                <p className="text-sm text-[#3E3A35] leading-relaxed">
                  Holistic Edge was established with a singular conviction: musculoskeletal pain should be treated at its mechanical root rather than silenced with painkillers or rushed into invasive surgeries.
                </p>
                <p className="text-sm text-[#3E3A35] leading-relaxed">
                  Over a quarter-century in Mehdipatnam, Hyderabad, Dr. Abdul Mallik recognized that neither isolated joint cracking nor standard physical therapy exercises alone provided lasting stability. This led to the creation of the <strong>A.M.M Method™</strong> — a proprietary 3-stage protocol uniting Chiropractic Adjustments, Soft-Tissue Mobilization, and Muscle Stabilization.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-4 rounded-xl border border-[#E8E4DC] shadow-xs">
                    <span className="text-2xl font-normal text-[#0F2747] block font-serif">25+</span>
                    <span className="text-xs text-[#5A544E] font-medium">Years Dedicated Practice</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E8E4DC] shadow-xs">
                    <span className="text-2xl font-normal text-[#1B4332] block font-serif">50,000+</span>
                    <span className="text-xs text-[#5A544E] font-medium">Patients Treated</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-md border border-[#E8E4DC] aspect-[4/3]">
                <img
                  src={clinicImg}
                  alt="Holistic Edge Wellness Clinic Mehdipatnam Hyderabad"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Mission, Vision, Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card padding="lg" className="border-[#E8E4DC] space-y-3 bg-white">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#A94420] flex items-center justify-center font-bold border border-[#ECCDC1]">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-normal text-[#1A1A1A] font-serif">Our Mission</h3>
                <p className="text-xs sm:text-sm text-[#5A544E] leading-relaxed">
                  To deliver compassionate, evidence-based, non-surgical spine and musculoskeletal care that empowers patients to live active, pain-free lives without dependency on drugs.
                </p>
              </Card>

              <Card padding="lg" className="border-[#E8E4DC] space-y-3 bg-white">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2ED] text-[#1B4332] flex items-center justify-center font-bold border border-[#C5DACB]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-normal text-[#1A1A1A] font-serif">Our Vision</h3>
                <p className="text-xs sm:text-sm text-[#5A544E] leading-relaxed">
                  To remain Telangana's premier center of excellence for natural pain care, recognized for clinical integrity, genuine patient outcomes, and transparent healthcare guidance.
                </p>
              </Card>

              <Card padding="lg" className="border-[#E8E4DC] space-y-3 bg-white">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4ED] text-[#D49E58] flex items-center justify-center font-bold border border-[#EADBCE]">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-normal text-[#1A1A1A] font-serif">Our Core Values</h3>
                <p className="text-xs sm:text-sm text-[#5A544E] leading-relaxed">
                  Zero invasive pressure, unhurried patient listening, strict medical-grade hygiene, and honest assessment on whether conservative care is right for your condition.
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: FOUNDER PROFILE */}
        {activeTab === 'founder' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E4DC] shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-md border border-[#E8E4DC]">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4 text-left">
                <Badge variant="editorial" size="md">
                  Founder & Clinical Director
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] font-serif">
                  {founder.name}
                </h2>
                <p className="text-xs font-semibold text-[#A94420] uppercase tracking-wider">
                  {founder.qualifications}
                </p>
                <p className="text-sm text-[#3E3A35] leading-relaxed">
                  {founder.bio}
                </p>

                {founder.philosophy && (
                  <div className="bg-[#FAF8F5] border-l-4 border-[#0F2747] p-4 rounded-r-xl text-xs sm:text-sm text-[#3E3A35] italic font-serif">
                    "{founder.philosophy}"
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#736C63] block">
                    Specializations & Clinical Mastery:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {founder.specialization.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-3 py-1 bg-[#F0F4F8] text-[#0F2747] rounded-lg border border-[#CBD8E6]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <Button variant="accent" size="md" onClick={onOpenBooking}>
                    Book Appointment with Dr. Mallik
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEAM OF 7 PROFESSIONALS */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-start gap-3">
              <Users className="w-5 h-5 text-[#A94420] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A] font-serif">
                  Multidisciplinary Clinical Team (7 Professionals)
                </h3>
                <p className="text-xs text-[#5A544E] mt-1 leading-relaxed">
                  {clinicStaffNote.note}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffMembers.map(member => (
                <Card key={member.id} padding="lg" className="border-[#E8E4DC] space-y-4 text-left bg-white">
                  <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#FAF8F5]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1A1A] font-serif">
                      {member.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#1B4332]">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-[#736C63] mt-0.5">
                      {member.qualifications}
                    </p>
                    <p className="text-xs text-[#5A544E] mt-2 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

