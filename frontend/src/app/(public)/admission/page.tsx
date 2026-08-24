'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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

  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/categories`).then(res => setCategories(res.data)).catch(console.error);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/courses`).then(res => setCourses(res.data)).catch(console.error);
  }, []);

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSignaturePreview(url);
      setFormData(prev => ({ ...prev, signatureUrl: url })); // In a real app, upload this file to the server and get a URL back
      setIsSignatureModalOpen(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for agreements
    if (!formData.agreed1 || !formData.agreed2 || !formData.agreed3 || !formData.agreed4 || !formData.agreed5 || !formData.agreed6) {
      toast.error('অনুগ্রহ করে অঙ্গীকারনামার সকল শর্তে সম্মত হোন।');
      return;
    }

    if (!formData.paymentMethod || !formData.transactionId) {
      toast.error('পেমেন্ট মেথড এবং ট্রানজেকশন আইডি দিন।');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/admission`, formData);
      toast.success('Admission Form Submitted Successfully!');
      // Reset form or redirect
    } catch (error) {
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 bg-gray-50/50 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all text-sm";
  const labelClass = "block text-[13px] font-bold text-gray-700 mb-1.5";
  const sectionTitleClass = "text-lg font-black text-gray-900 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wider flex items-center";

  return (
    <div className="bg-gray-100 min-h-screen py-10 md:py-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Header (Flat Minimalist) */}
        <div className="bg-white rounded-t-2xl p-8 border-b-4 border-red-600 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-14 md:h-16 w-auto object-contain" />
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end">
            <h2 className="text-xl font-bold text-gray-800 bg-gray-100 px-4 py-1.5 rounded-full">Admission Form</h2>
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-white rounded-b-2xl shadow-sm p-6 md:p-10 border border-t-0 border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Personal Information */}
            <div>
              <h3 className={sectionTitleClass}>
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded flex items-center justify-center mr-3 text-sm">1</span>
                Personal Information
              </h3>
              <div className="flex flex-col md:flex-row gap-5 md:gap-8">
                {/* Left Side: Inputs */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Class</label>
                    <select name="studentClass" value={formData.studentClass} onChange={handleChange} required className={inputClass}>
                      <option value="">Select an option</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Select Batch</label>
                    <select name="selectedBatch" value={formData.selectedBatch} onChange={handleChange} required className={inputClass} disabled={!formData.studentClass}>
                      <option value="">Select an option</option>
                      {courses
                        .filter((course: any) => course.category === formData.studentClass)
                        .map((course: any) => (
                          <option key={course.id} value={course.title}>{course.title}</option>
                        ))
                      }
                    </select>
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
                  <label className="block text-[13px] font-bold text-transparent mb-1.5 hidden md:block select-none">Photo</label>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5 md:hidden">Upload Photo</label>
                  <div className="w-full h-36 md:h-full min-h-[140px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors group">
                    <i className="fa-regular fa-user text-3xl text-gray-300 group-hover:text-red-400 mb-2"></i>
                    <span className="text-[11px] font-bold text-gray-500 group-hover:text-red-500 text-center px-2">Upload Photo</span>
                  </div>
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
                    <option value="Science">Science</option>
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
                  <label className={labelClass}>Guardian's Mobile Number</label>
                  <input name="guardianMobile" value={formData.guardianMobile} onChange={handleChange} type="text" placeholder="Enter guardian's mobile number" className={inputClass} />
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
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
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
                    <input type="text" readOnly value="700" className={`${inputClass} pl-8 bg-gray-100 text-gray-600 cursor-not-allowed`} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Fixed admission fee: 700 BDT + (প্রথম মাসের বেতন)</p>
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
                <div>
                  <label className={labelClass}>Transaction ID / Last 4 Digits</label>
                  <input name="transactionId" value={formData.transactionId} onChange={handleChange} required type="text" placeholder="Enter transaction ID or last 4 digits" className={inputClass} />
                </div>
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
                className="px-10 py-3.5 bg-[#1a0505] text-white font-bold rounded-full shadow-lg hover:bg-black transition-colors min-w-[250px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
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
                
                <label className="bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer font-bold py-2.5 px-8 rounded-lg transition-colors shadow-sm mb-4 inline-block">
                  Select File
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
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

