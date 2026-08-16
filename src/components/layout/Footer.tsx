import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Phone,
  MapPin,
  Clock,
  Shield,
  Star,
  ChevronRight,
  HeartHandshake,
  FileText
} from 'lucide-react';
import { clinicInfo } from '../../data/clinicInfo';
import { servicesData } from '../../data/services';
import { conditionsData } from '../../data/conditions';
import logoImg from '@/Logo.png';

export interface FooterProps {
  onOpenBooking: (service?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer id="main-site-footer" className="bg-[#171614] text-[#D4CEC5] pt-16 pb-24 md:pb-16 border-t border-[#2B2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#2B2723]">
          {/* Col 1: Clinic Overview & Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-block focus:outline-none"
            >
              <img
                src="/brand/holistic-edge-logo-transparent.png"
                alt="Holistic Edge Wellness Centre"
                className="h-12 object-contain"
              />
            </Link>

            <p className="text-sm text-[#9E968C] leading-relaxed max-w-md">
              Established healthcare destination in Hyderabad offering personalized, non-surgical and non-medicinal approaches for spine, joint, and musculoskeletal pain under the leadership of Dr. Abdul Mallik.
            </p>

            {/* Credential Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="bg-[#211E1C] border border-[#332E2A] rounded-xl p-2.5 text-center">
                <span className="text-lg font-bold text-[#FAF9F6] font-serif block">25+</span>
                <span className="text-[11px] text-[#8E867C]">Years Experience</span>
              </div>
              <div className="bg-[#211E1C] border border-[#332E2A] rounded-xl p-2.5 text-center">
                <span className="text-lg font-bold text-[#D49E58] font-serif block">12,000+</span>
                <span className="text-[11px] text-[#8E867C]">Patients Treated</span>
              </div>
              <div className="bg-[#211E1C] border border-[#332E2A] rounded-xl p-2.5 text-center col-span-2 sm:col-span-1">
                <div className="flex items-center justify-center gap-1 text-[#D49E58] font-bold text-sm">
                  <Star className="w-3.5 h-3.5 fill-[#D49E58]" />
                  <span>4.6★ / 4.7★</span>
                </div>
                <span className="text-[11px] text-[#8E867C]">Justdial & Cybo</span>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="bg-[#211E1C] border border-[#332E2A] rounded-xl p-3.5 text-xs text-[#C4BCB1] space-y-2 mt-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D49E58] flex-shrink-0 mt-0.5" />
                <span>
                  {clinicInfo.address}, {clinicInfo.city}-{clinicInfo.pincode}, {clinicInfo.state}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0F2747] flex-shrink-0" />
                <a
                  href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                  className="font-semibold text-[#FAF9F6] hover:text-[#D49E58] transition-colors"
                >
                  Direct Phone: {clinicInfo.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FAF9F6] mb-4">
              Clinical Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {servicesData.map(s => (
                <li key={s.id}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-[#9E968C] hover:text-[#FAF9F6] transition-colors flex items-center gap-1.5 group text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#0F2747] group-hover:translate-x-0.5 transition-transform" />
                    <span>{s.title}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/#amm-method"
                  className="text-[#D49E58] hover:underline text-xs font-semibold flex items-center gap-1"
                >
                  <span>Explore A.M.M Method™</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Conditions We Treat */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FAF9F6] mb-4">
              Conditions Treated
            </h4>
            <ul className="space-y-2 text-sm">
              {conditionsData.slice(0, 6).map(c => (
                <li key={c.id}>
                  <Link
                    to={`/conditions/${c.slug}`}
                    className="text-[#9E968C] hover:text-[#FAF9F6] transition-colors flex items-center gap-1.5 group text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#0F2747] group-hover:translate-x-0.5 transition-transform" />
                    <span className="truncate">{c.title}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/conditions"
                  className="text-xs text-[#D49E58] hover:underline font-semibold"
                >
                  View All 10+ Conditions →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Patient Portal & Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FAF9F6] mb-4">
              Patient Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-[#9E968C] hover:text-[#FAF9F6] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#6B645C]" />
                  <span>About Holistic Edge</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about/dr-abdul-mallik"
                  className="text-[#9E968C] hover:text-[#FAF9F6] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#6B645C]" />
                  <span>Dr. Abdul Mallik</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/#faq-section"
                  className="text-[#9E968C] hover:text-[#FAF9F6] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#6B645C]" />
                  <span>First Visit Guide</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/#patient-resources"
                  className="text-[#9E968C] hover:text-[#FAF9F6] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#6B645C]" />
                  <span>Treatment Journey</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/#success-stories"
                  className="text-[#9E968C] hover:text-[#FAF9F6] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#6B645C]" />
                  <span>Patient Success Stories</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/#faq-section"
                  className="text-[#9E968C] hover:text-[#FAF9F6] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#6B645C]" />
                  <span>Frequently Asked Questions</span>
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="text-xs text-[#8E867C] hover:text-[#FAF9F6] transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin Portal Access</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Local Healthcare SEO Keywords & City Recognition */}
        <div className="py-6 border-b border-[#2B2723] text-xs text-[#7A7268] leading-relaxed">
          <p className="font-semibold text-[#A69E92] mb-1">
            Local Healthcare Service Areas in Hyderabad:
          </p>
          <p>
            Mehdipatnam • Banjara Hills • Jubilee Hills • Tolichowki • Attapur • Masab Tank • Gachibowli • Hitec City • Humayun Nagar • Asif Nagar • Hyderabad Spine Care Specialists • Telangana.
          </p>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7A7268]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D49E58] flex-shrink-0" />
            <span>
              <strong>Medical Disclaimer:</strong> Information provided on this website is for educational and clinical guidance purposes only and does not substitute for a direct, in-person clinical assessment by a qualified healthcare professional.
            </span>
          </div>

          <div className="flex-shrink-0 text-center md:text-right">
            <p>© {new Date().getFullYear()} Holistic Edge Chiropractic & Wellness Clinic. All rights reserved.</p>
            <p className="text-[11px] text-[#635C53] mt-0.5">Founded by Dr. Abdul Mallik • Mehdipatnam, Hyderabad</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

