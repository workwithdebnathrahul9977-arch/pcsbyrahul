'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface FormField {
  key: string;
  label: string;
  required?: boolean;
}

const FIELD_GROUPS: { group: string; icon: string; fields: FormField[] }[] = [
  {
    group: 'Enrollment Info',
    icon: 'fa-graduation-cap',
    fields: [
      { key: 'show_class', label: 'Class Selection' },
      { key: 'show_batch', label: 'Batch Selection' },
      { key: 'show_group', label: 'Group Selection' },
      { key: 'show_subject', label: 'Subject Selection' },
      { key: 'show_examsOnly', label: 'Exams Only Checkbox' },
    ],
  },
  {
    group: 'Student Information',
    icon: 'fa-user',
    fields: [
      { key: 'show_photo', label: 'Student Photo Upload' },
      { key: 'show_name', label: 'Student Name', required: true },
      { key: 'show_nickname', label: 'Nickname / Call Name' },
      { key: 'show_dob', label: 'Date of Birth' },
      { key: 'show_gender', label: 'Gender' },
      { key: 'show_bloodGroup', label: 'Blood Group' },
      { key: 'show_religion', label: 'Religion' },
      { key: 'show_studentMobile', label: 'Student Mobile', required: true },
      { key: 'show_guardianMobile', label: 'Guardian Mobile' },
    ],
  },
  {
    group: 'Family Information',
    icon: 'fa-people-roof',
    fields: [
      { key: 'show_fatherName', label: 'Father Name', required: true },
      { key: 'show_fatherMobile', label: 'Father Mobile', required: true },
      { key: 'show_fatherOccupation', label: 'Father Occupation' },
      { key: 'show_motherName', label: 'Mother Name', required: true },
      { key: 'show_motherMobile', label: 'Mother Mobile' },
      { key: 'show_motherOccupation', label: 'Mother Occupation' },
    ],
  },
  {
    group: 'School Information',
    icon: 'fa-school',
    fields: [
      { key: 'show_schoolName', label: 'School Name', required: true },
      { key: 'show_schoolRoll', label: 'School Roll Number' },
    ],
  },
  {
    group: 'Address',
    icon: 'fa-location-dot',
    fields: [
      { key: 'show_presentAddress', label: 'Present Address', required: true },
      { key: 'show_permanentAddress', label: 'Permanent Address' },
    ],
  },
  {
    group: 'Payment',
    icon: 'fa-money-bill',
    fields: [
      { key: 'show_admissionFee', label: 'Admission Fee' },
      { key: 'show_paymentMethod', label: 'Payment Method' },
      { key: 'show_transactionId', label: 'Transaction ID' },
    ],
  },
  {
    group: 'Other',
    icon: 'fa-sliders',
    fields: [
      { key: 'show_advisorName', label: 'Advisor Name' },
      { key: 'show_advisorMobile', label: 'Advisor Mobile' },
      { key: 'show_signature', label: 'Student Signature' },
    ],
  },
];

const ALL_KEYS = FIELD_GROUPS.flatMap(g => g.fields.map(f => f.key));

export default function FormSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [instituteName, setInstituteName] = useState('');
  const [instituteAddress, setInstituteAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const keys = [...ALL_KEYS, 'ADMISSION_INST_NAME', 'ADMISSION_INST_ADDRESS'];
        const results = await Promise.all(
          keys.map(k => axios.get(`${API}/api/settings/${k}`).then(r => ({ key: k, value: r.data.value || '' })).catch(() => ({ key: k, value: '' })))
        );
        const map: Record<string, string> = {};
        results.forEach(({ key, value }) => {
          if (key === 'ADMISSION_INST_NAME') setInstituteName(value);
          else if (key === 'ADMISSION_INST_ADDRESS') setInstituteAddress(value);
          else map[key] = value;
        });
        setSettings(map);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAll();
  }, []);

  const toggleField = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: prev[key] === 'false' ? 'true' : 'false' }));
  };

  const isEnabled = (key: string) => settings[key] !== 'false';

  const enableAll = () => {
    const all: Record<string, string> = {};
    ALL_KEYS.forEach(k => { all[k] = 'true'; });
    setSettings(all);
  };

  const save = async () => {
    setLoading(true);
    try {
      const entries = Object.entries(settings).map(([key, value]) => axios.post(`${API}/api/settings`, { key, value }));
      entries.push(axios.post(`${API}/api/settings`, { key: 'ADMISSION_INST_NAME', value: instituteName }));
      entries.push(axios.post(`${API}/api/settings`, { key: 'ADMISSION_INST_ADDRESS', value: instituteAddress }));
      await Promise.all(entries);
      toast.success('Form settings saved!');
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Admission Form Settings</h2>
          <p className="text-gray-500 text-sm">Toggle which fields appear on the public & admin admission form</p>
        </div>
        <div className="flex gap-3">
          <button onClick={enableAll} className="px-4 py-2 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Enable All
          </button>
          <button onClick={save} disabled={loading} className="px-5 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2">
            <i className="fa-solid fa-floppy-disk"></i>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Institute Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-building text-red-500"></i> Institute Info (for Blank Form Header)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Institute Name</label>
            <input
              type="text"
              value={instituteName}
              onChange={e => setInstituteName(e.target.value)}
              placeholder="e.g. PCS Physics Chemistry"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Institute Address</label>
            <input
              type="text"
              value={instituteAddress}
              onChange={e => setInstituteAddress(e.target.value)}
              placeholder="e.g. Rajshahi, Bangladesh"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Field Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FIELD_GROUPS.map(group => (
          <div key={group.group} className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <i className={`fa-solid ${group.icon} text-red-500 text-sm`}></i>
              <h3 className="font-bold text-gray-700 text-sm">{group.group}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {group.fields.map(field => (
                <div key={field.key} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{field.label}</p>
                    {field.required && <p className="text-[11px] text-orange-500 font-bold">Recommended</p>}
                  </div>
                  <button
                    onClick={() => toggleField(field.key)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                      isEnabled(field.key) ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-sm ${
                      isEnabled(field.key) ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
