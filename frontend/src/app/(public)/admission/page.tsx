'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export default function Admission() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentClass: '',
    selectedBatch: '',
    studentName: '',
    studentNickname: '',
    advisorName: '',
    advisorMobile: '',
    fatherName: '',
    motherName: '',
    fatherMobile: '',
    motherMobile: '',
    fatherOccupation: '',
    motherOccupation: '',
    presentAddress: '',
    permanentAddress: '',
    dob: '',
    gender: '',
    group: '',
    bloodGroup: '',
    religion: '',
    studentMobile: '',
    guardianMobile: '',
    whatsapp: '',
    schoolName: '',
    schoolRoll: '',
    subject: '',
    examsOnly: false,
    paymentMethod: '',
    transactionId: '',
    admissionFee: '700',
    agreed1: false,
    agreed2: false,
    agreed3: false,
    agreed4: false,
    agreed5: false,
    agreed6: false,
  });

  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const [classes, setClasses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    Promise.all([
      axios.get(`${url}/api/academic/classes`),
      axios.get(`${url}/api/academic/batches`),
      axios.get(`${url}/api/academic/groups`),
      axios.get(`${url}/api/academic/subjects`),
      axios.get(`${url}/api/courses`)
    ]).then(([cRes, bRes, gRes, sRes, courseRes]) => {
      setClasses(cRes.data);
      setBatches(bRes.data);
      setGroups(gRes.data);
      setSubjects(sRes.data);

      const courseId = searchParams?.get('courseId');
      if (courseId) {
        const course = courseRes.data.find((c: any) => c.id === courseId);
        if (course) {
          const cls = cRes.data.find((c: any) => c.id === course.academicClassId);
          const grp = gRes.data.find((g: any) => g.id === course.academicGroupId);
          const sub = sRes.data.find((s: any) => s.id === course.academicSubjectId);
          // Wait, 'selectedBatch' is the Batch NAME. We map course to form data.
          // In the form: studentClass is the name of the class. group is name. subject is name.
          setFormData(prev => ({
            ...prev,
            studentClass: cls ? cls.name : '',
            group: grp ? grp.name : '',
            subject: sub ? sub.name : '',
            admissionFee: String(course.fee)
          }));
        }
      }
    }).catch(console.error);
  }, [searchParams]);

  const [signatureUploading, setSignatureUploading] = useState(false);

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSignatureUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const { data } = await axios.post(`${url}/api/upload`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSignaturePreview(data.imageUrl);
      setFormData(prev => ({ ...prev, signatureUrl: data.imageUrl }));
      setIsSignatureModalOpen(false);
      toast.success('Signature uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload signature');
    } finally {
      setSignatureUploading(false);
    }
  };

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const { data } = await axios.post(`${url}/api/upload`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPhotoPreview(data.imageUrl);
      setFormData(prev => ({ ...prev, photoUrl: data.imageUrl }));
      toast.success('ছবি আপলোড হয়েছে!');
    } catch (err) {
      toast.error('ছবি আপলোড ব্যর্থ হয়েছে');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => {
      let newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (name === 'studentClass') {
        newData.selectedBatch = '';
        newData.admissionFee = '700';
      }
      
      if (name === 'selectedBatch') {
        const batch = batches.find(b => b.name === value);
        if (batch && batch.admissionFee) {
          newData.admissionFee = String(batch.admissionFee);
        }
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for agreements
    if (!formData.agreed1 || !formData.agreed2 || !formData.agreed3 || !formData.agreed4 || !formData.agreed5 || !formData.agreed6) {
      toast.error('অনুগ্রহ করে অঙ্গীকারনামার সকল শর্তে সম্মত হোন।');
      return;
    }

    if (!formData.paymentMethod) {
      toast.error('পেমেন্ট মেথড সিলেক্ট করুন');
      return;
    }
    if (formData.paymentMethod !== 'Cash' && !formData.transactionId) {
      toast.error('ট্রানজেকশন আইডি / নাম্বার দিন');
      return;
    }

    setLoading(true);
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admission`, formData);
        toast.success('Admission Form Submitted Successfully!');
        setTimeout(() => window.location.reload(), 2000);
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error, { duration: 5000 });
        } else {
          toast.error('Failed to submit form. Please try again.');
        }
      } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium";
  const labelClass = "block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2";
  const sectionTitleClass = "text-xl font-bold text-gray-900 mb-8 flex items-center";

  return (
    <div className="bg-[#fef9f9] min-h-screen pb-24 font-sans">
      <div className="max-w-5xl mx-auto px-5 md:px-8 pt-10 md:pt-16">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> ADMISSION
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2">Admission Form</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl">Complete the form below to enroll. Ensure all information matches your official documents.</p>
          </div>
          <div className="hidden md:block">
             <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain" />
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
            
            {/* Personal Information */}
            <div>
              <h3 className={sectionTitleClass}>
                <span className="bg-red-50 border border-red-100 text-red-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
                Personal Information
              </h3>
              <div className="flex flex-col md:flex-row gap-8 md:gap-10">
                {/* Left Side: Inputs */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Class</label>
                    <div className="relative">
                      <select name="studentClass" value={formData.studentClass} onChange={handleChange} required className={`${inputClass} pl-4 pr-10 appearance-none`}>
                        <option value="">Select an option</option>
                        {classes.map((cls: any) => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Select Batch</label>
                    <div className="relative">
                      <select name="selectedBatch" value={formData.selectedBatch} onChange={handleChange} required className={`${inputClass} pl-4 pr-10 appearance-none`} disabled={!formData.studentClass}>
                        <option value="">Select an option</option>
                      {batches
                        .filter((batch: any) => {
                          const cls = classes.find(c => c.name === formData.studentClass);
                          return cls && batch.classId === cls.id;
                        })
                        .map((batch: any) => (
                          <option key={batch.id} value={batch.name}>{batch.name}</option>
                        ))
                      }
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                  </div>
                </div>
                  <div>
                    <label className={labelClass}>Name of Student</label>
                    <input name="studentName" value={formData.studentName} onChange={handleChange} required type="text" placeholder="Enter student's name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Student Nickname</label>
                    <input name="studentNickname" value={formData.studentNickname} onChange={handleChange} type="text" placeholder="Enter student's nickname" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Advisor Name</label>
                    <input name="advisorName" value={formData.advisorName} onChange={handleChange} type="text" placeholder="Enter advisor's name" className={inputClass} />
                    <p className="text-[10px] text-gray-400 mt-1">অ্যাডভাইজার (Advisor): যার কাছ থেকে প্রতিষ্ঠান সম্পর্কে জেনেছেন</p>
                  </div>
                  <div>
                    <label className={labelClass}>Advisor Mobile Number</label>
                    <input name="advisorMobile" value={formData.advisorMobile} onChange={handleChange} type="text" placeholder="Enter advisor's mobile number" className={inputClass} />
                  </div>
                </div>
                
                {/* Right Side: Photo Upload */}
                <div className="w-full md:w-40 flex-shrink-0 flex flex-col justify-start">
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">ছাত্রের ছবি</label>
                  <label className="w-full h-36 md:h-44 min-h-[140px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors group relative overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                    ) : photoUploading ? (
                      <><i className="fa-solid fa-spinner fa-spin text-2xl text-red-400 mb-2"></i>
                      <span className="text-[11px] font-bold text-red-400">আপলোড হচ্ছে...</span></>
                    ) : (
                      <><i className="fa-regular fa-user text-3xl text-gray-300 group-hover:text-red-400 mb-2"></i>
                      <span className="text-[11px] font-bold text-gray-500 group-hover:text-red-500 text-center px-2">ছবি আপলোড করুন</span></>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={photoUploading} />
                  </label>
                  {photoPreview && (
                    <button type="button" onClick={() => { setPhotoPreview(null); setFormData(prev => ({ ...prev, photoUrl: '' })); }} className="mt-1 text-xs text-red-500 text-center hover:underline">মুছুন</button>
                  )}
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div>
              <h3 className={sectionTitleClass}>
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded flex items-center justify-center mr-3 text-sm">2</span>
                Parent Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Father's Name</label>
                  <input name="fatherName" value={formData.fatherName} onChange={handleChange} required type="text" placeholder="Enter father's name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Mother's Name</label>
                  <input name="motherName" value={formData.motherName} onChange={handleChange} required type="text" placeholder="Enter mother's name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Father's Mobile Number</label>
                  <input name="fatherMobile" value={formData.fatherMobile} onChange={handleChange} required type="text" placeholder="Enter father's mobile number" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Mother's Mobile Number</label>
                  <input name="motherMobile" value={formData.motherMobile} onChange={handleChange} type="text" placeholder="Enter mother's mobile number" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Father's Occupation</label>
                  <input name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} type="text" placeholder="Enter father's occupation" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Mother's Occupation</label>
                  <input name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} type="text" placeholder="Enter mother's occupation" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className={sectionTitleClass}>
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded flex items-center justify-center mr-3 text-sm">3</span>
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Present Address</label>
                  <input name="presentAddress" value={formData.presentAddress} onChange={handleChange} required type="text" placeholder="Enter Present Address" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Permanent Address</label>
                  <input name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} type="text" placeholder="Enter Permanent Address" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Date Of Birth</label>
                  <input name="dob" value={formData.dob} onChange={handleChange} required type="date" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required className={inputClass}>
                    <option value="">Select an option</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Group</label>
                  <select name="group" value={formData.group} onChange={handleChange} className={inputClass}>
                    <option value="">Select an option</option>
                    {groups.map((g: any) => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClass}>
                    <option value="">Select an option</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Religion</label>
                  <select name="religion" value={formData.religion} onChange={handleChange} className={inputClass}>
                    <option value="">Select an option</option>
                    <option value="Islam">Islam</option>
                    <option value="Hinduism">Hinduism</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Buddhism">Buddhism</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Student's Mobile Number</label>
                  <input name="studentMobile" value={formData.studentMobile} onChange={handleChange} required type="text" placeholder="Enter student's mobile number" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>
                    <span className="flex items-center gap-1.5">
                      <i className="fa-brands fa-whatsapp text-green-600"></i>
                      WhatsApp Number <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} required type="text" placeholder="WhatsApp number (e.g. 01XXXXXXXXX)" className={inputClass} />
                  <p className="text-xs text-gray-400 mt-1">Result, fee notice সহ সব গুরুত্বপূর্ণ তথ্য এই নম্বরে WhatsApp এ পাঠানো হবে।</p>
                </div>
                <div>
                  <label className={labelClass}>School / College Name</label>
                  <input name="schoolName" value={formData.schoolName} onChange={handleChange} required type="text" placeholder="Enter institution name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>School Roll</label>
                  <input name="schoolRoll" value={formData.schoolRoll} onChange={handleChange} type="text" placeholder="Enter your school roll" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} className={inputClass}>
                    <option value="">Select an option</option>
                    {subjects.map((s: any) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Both">Both (Physics & Chemistry)</option>
                  </select>
                </div>
                
                <div className="md:col-span-3 mt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input name="examsOnly" checked={formData.examsOnly} onChange={handleChange} type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                    <span className="text-sm font-bold text-gray-700">Interested in participating in exams only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Admission Fee Information */}
            <div>
              <h3 className={sectionTitleClass}>
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded flex items-center justify-center mr-3 text-sm">4</span>
                Admission Fee Information
              </h3>
              
              <div className="bg-[#fff9e6] border border-[#ffdb70] rounded-lg p-5 mb-6 text-[13px] text-gray-800 space-y-2">
                <p className="font-bold text-red-700 mb-2">পেমেন্ট নির্দেশনাবলী:</p>
                <p>• ফরম জমা দেওয়ার সময় ভর্তি ফি ও প্রথম মাসের বেতন অবশ্যই পরিশোধ করতে হবে (বেতন জানতে কর্তৃপক্ষের সাথে যোগাযোগ করুন)</p>
                <p>• ক্যাশ পেমেন্ট ম্যানুয়ালি যাচাই করা হবে</p>
                <p>• বিকাশ/নগদের জন্য: ট্রানজেকশন আইডি/নম্বর ও রিসিট দিতে হবে</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Admission Fee Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">৳</span>
                    <input type="text" readOnly value={formData.admissionFee} className={`${inputClass} pl-8 bg-gray-100 text-gray-600 cursor-not-allowed`} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Total admission fee for selected batch</p>
                </div>
                <div>
                  <label className={labelClass}>Payment Method</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className={inputClass}>
                    <option value="">Select Payment Method</option>
                    <option value="Cash">Cash</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                  </select>
                </div>
                {formData.paymentMethod !== 'Cash' && (
                  <div>
                    <label className={labelClass}>Transaction ID / Last 4 Digits</label>
                    <input name="transactionId" value={formData.transactionId} onChange={handleChange} required type="text" placeholder="Enter transaction ID or last 4 digits" className={inputClass} />
                  </div>
                )}
              </div>
            </div>

            {/* অঙ্গীকারনামা */}
            <div>
              <h3 className={sectionTitleClass}>
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded flex items-center justify-center mr-3 text-sm">5</span>
                অঙ্গীকারনামা
              </h3>
              <div className="space-y-3 bg-gray-50 p-5 rounded-lg border border-gray-200 text-[13px] text-gray-700 font-medium">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input name="agreed1" checked={formData.agreed1} onChange={handleChange} type="checkbox" className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                  <span>ক. আমি শপথ করছি যে, আমি নিচে এই ফরম পূরণ করেছি এবং এখানে প্রদত্ত বিবরণ সত্য।</span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input name="agreed2" checked={formData.agreed2} onChange={handleChange} type="checkbox" className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                  <span>খ. প্রতিশ্রুতি দিচ্ছি যে, আমি ইন্সটিটিউট বা সেন্টার-এর সকল নিয়মকানুন বিধি-বিধান মেনে চলবো এবং প্রতিষ্ঠানের সুনাম বৃদ্ধিতে অবদান রাখবো।</span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input name="agreed3" checked={formData.agreed3} onChange={handleChange} type="checkbox" className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                  <span>গ. নিয়মিত ক্লাস ও সাপ্তাহিক পরীক্ষায় অংশগ্রহণ করবো এবং ছুটি বা অনুপস্থিত থাকলে যথাসময়ে অনুমতি নেবো।</span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input name="agreed4" checked={formData.agreed4} onChange={handleChange} type="checkbox" className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                  <span>ঘ. আমি কোনো প্রকার দেশ বিরোধী বা বেআইনি কাজে নিজেকে জড়িত করবো না।</span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input name="agreed5" checked={formData.agreed5} onChange={handleChange} type="checkbox" className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                  <span>ঙ. ভর্তি বাতিল বা মাসিক ফি ও পরীক্ষার ফি উপস্থিতি ও অনুপস্থিতি নির্বিশেষে পরিশোধ করবো।</span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input name="agreed6" checked={formData.agreed6} onChange={handleChange} type="checkbox" className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                  <span>চ. আরও অঙ্গীকার করছি যে, আমি ইন্সটিটিউট বা সেন্টার এর মাসিক ফি চলতি মাসের ৫ তারিখের মধ্যে পরিশোধ করবো।</span>
                </label>
              </div>
            </div>

            {/* Signature & Submit */}
            <div className="pt-8 flex flex-col items-center">
              <div className="mb-6 w-full max-w-sm flex flex-col items-center">
                <label className="block text-sm font-bold text-gray-700 mb-2 text-left w-full">Student Signature</label>
                <div 
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="w-full h-24 bg-gray-50 border border-gray-300 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition relative overflow-hidden"
                >
                  {signaturePreview ? (
                    <img src={signaturePreview} alt="Signature Preview" className="h-full w-full object-contain p-2" />
                  ) : (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded pointer-events-none">Add Signature</span>
                  )}
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-12 py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgb(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 min-w-[250px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <i className="fa-solid fa-spinner fa-spin text-lg"></i> : <><i className="fa-solid fa-paper-plane"></i> Submit Application</>}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Signature Upload Modal */}
      {isSignatureModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setIsSignatureModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 border border-gray-200 rounded p-1 hover:bg-gray-100 transition"
            >
              <i className="fa-solid fa-xmark w-4 h-4 flex items-center justify-center"></i>
            </button>
            
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-left">Upload Your Signature</h3>
              
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 bg-green-50/30 flex flex-col items-center relative group">
                <p className="text-sm font-bold text-green-600 mb-4">Upload signature image</p>
                
                <label className={`bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer font-bold py-2.5 px-8 rounded-lg transition-colors shadow-sm mb-4 inline-block ${signatureUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {signatureUploading ? 'Uploading...' : 'Select File'}
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" disabled={signatureUploading} />
                </label>
                
                <p className="text-[12px] text-gray-500 font-medium leading-relaxed max-w-[250px]">
                  সাদা কাগজে স্বাক্ষর করে ছবি তুলে আপলোড করুন, এরপর শুধু স্বাক্ষরের অংশটুকু ক্রপ করে নিন।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

