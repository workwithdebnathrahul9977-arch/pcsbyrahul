'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BlankAdmissionFormPage() {
  const [instituteName, setInstituteName] = useState('');
  const [instituteAddress, setInstituteAddress] = useState('');
  const [siteLogo, setSiteLogo] = useState('/logo.png');

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/settings/ADMISSION_INST_NAME`).catch(() => ({ data: { value: '' } })),
      axios.get(`${API}/api/settings/ADMISSION_INST_ADDRESS`).catch(() => ({ data: { value: '' } })),
      axios.get(`${API}/api/settings/SITE_LOGO`).catch(() => ({ data: { value: '' } })),
    ]).then(([nameRes, addrRes, logoRes]) => {
      setInstituteName(nameRes.data.value || 'PhysChemia');
      setInstituteAddress(addrRes.data.value || 'Rajshahi, Bangladesh');
      if (logoRes.data.value) setSiteLogo(logoRes.data.value);
    });
  }, []);

  const handlePrint = () => window.print();

  const field = (label: string, wide = false) => (
    <div className={`mb-4 ${wide ? 'col-span-2' : ''}`}>
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <div className="border-b-2 border-gray-400 min-h-[28px] w-full"></div>
    </div>
  );

  return (
    <div className="bg-gray-100">
      {/* Print Button - only visible on screen */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Blank Admission Form</h2>
          <p className="text-gray-500 text-sm">Print and hand to students for offline filling</p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-sm"
        >
          <i className="fa-solid fa-print"></i> Print Form
        </button>
      </div>

      {/* A4 Form Preview */}
      <div className="p-8 print:p-0 print:m-0 flex justify-center">
        <div
          id="printArea"
          className="bg-white shadow-xl print:shadow-none w-full max-w-[794px] min-h-[1123px] p-10 print:p-8 text-gray-900 font-sans print:text-xs"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-4 border-red-600 pb-4 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={siteLogo}
                alt="Logo"
                className="h-16 w-auto object-contain"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              {/* Fallback text if logo fails to load */}
              <div style={{ display: 'none' }}>
                <h1 className="text-2xl font-black text-gray-900">{instituteName}</h1>
                <p className="text-gray-500 text-sm">{instituteAddress}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{instituteAddress}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-red-600 uppercase tracking-wider">Admission Form</div>
              <p className="text-xs text-gray-400 mt-1">Session: _______________</p>
            </div>
          </div>

          {/* Photo Box */}
          <div className="flex gap-6">
            <div className="flex-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-red-600 border-b border-red-100 pb-2 mb-4">Enrollment Information</h2>
              <div className="grid grid-cols-2 gap-x-6">
                {field('Class')}
                {field('Batch')}
                {field('Group')}
                {field('Subject')}
                {field('Session Year')}
                {field('Admission Fee (৳)')}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-28 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-center text-gray-400 text-[10px] font-bold p-2">
                Student<br/>Photo<br/>(Passport Size)
              </div>
            </div>
          </div>

          {/* Student Info */}
          <h2 className="text-sm font-black uppercase tracking-wider text-red-600 border-b border-red-100 pb-2 mb-4 mt-2">Student Information</h2>
          <div className="grid grid-cols-2 gap-x-6">
            {field('Full Name (Bengali)', false)}
            {field('Full Name (English)', false)}
            {field('Call Name / Nickname')}
            {field('Date of Birth (DD/MM/YYYY)')}
            {field('Gender')}
            {field('Blood Group')}
            {field('Religion')}
            {field('Student Mobile')}
            {field('Guardian Mobile')}
          </div>

          {/* Family Info */}
          <h2 className="text-sm font-black uppercase tracking-wider text-red-600 border-b border-red-100 pb-2 mb-4 mt-2">Family Information</h2>
          <div className="grid grid-cols-2 gap-x-6">
            {field("Father's Name")}
            {field("Father's Mobile")}
            {field("Father's Occupation")}
            {field("Mother's Name")}
            {field("Mother's Mobile")}
            {field("Mother's Occupation")}
          </div>

          {/* School & Address */}
          <h2 className="text-sm font-black uppercase tracking-wider text-red-600 border-b border-red-100 pb-2 mb-4 mt-2">School & Address</h2>
          <div className="grid grid-cols-2 gap-x-6">
            {field('School / College Name', false)}
            {field('School Roll Number')}
            {field('Class Roll')}
            {field('Present Address', false)}
            {field('Permanent Address', false)}
          </div>

          {/* Payment */}
          <h2 className="text-sm font-black uppercase tracking-wider text-red-600 border-b border-red-100 pb-2 mb-4 mt-2">Payment Information</h2>
          <div className="grid grid-cols-2 gap-x-6">
            {field('Payment Method (Cash / bKash / Nagad)')}
            {field('Transaction / Reciept ID')}
          </div>

          {/* Advisor */}
          <h2 className="text-sm font-black uppercase tracking-wider text-red-600 border-b border-red-100 pb-2 mb-4 mt-2">Advisor (Optional)</h2>
          <div className="grid grid-cols-2 gap-x-6">
            {field("Advisor's Name")}
            {field("Advisor's Mobile")}
          </div>

          {/* Signatures */}
          <div className="flex justify-between mt-10 pt-6 border-t-2 border-dashed border-gray-300">
            <div className="text-center w-48">
              <div className="border-b-2 border-gray-400 mb-2 h-10"></div>
              <p className="text-xs text-gray-600 font-bold">Student's Signature</p>
              <p className="text-[10px] text-gray-400">Date: _______________</p>
            </div>
            <div className="text-center w-48">
              <div className="border-b-2 border-gray-400 mb-2 h-10"></div>
              <p className="text-xs text-gray-600 font-bold">Guardian's Signature</p>
              <p className="text-[10px] text-gray-400">Date: _______________</p>
            </div>
            <div className="text-center w-48">
              <div className="border-b-2 border-gray-400 mb-2 h-10"></div>
              <p className="text-xs text-gray-600 font-bold">Office Seal & Signature</p>
              <p className="text-[10px] text-gray-400">Date: _______________</p>
            </div>
          </div>

          <p className="text-center text-[10px] text-gray-300 mt-6">
            This form is the property of {instituteName}. Unauthorized reproduction is prohibited.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #printArea, #printArea * { visibility: visible; }
          #printArea { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
