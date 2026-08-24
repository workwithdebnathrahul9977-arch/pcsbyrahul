'use client';
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/auth/register`, {
        name, email, phone, password
      });
      toast.success('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! দয়া করে লগইন করুন।');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 relative z-10">
        <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="PCS Logo" className="h-16 w-auto object-contain" />
        </div>
        <h2 className="text-xl font-bold text-center text-gray-900 mb-6 tracking-tight">রেজিস্ট্রেশন</h2>
        
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পূর্ণ নাম</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="যেমন: Rahul" 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none bg-gray-50 transition-all text-gray-900 text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ইমেইল অ্যাড্রেস</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="student@example.com" 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none bg-gray-50 transition-all text-gray-900 text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ফোন নাম্বার</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX" 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none bg-gray-50 transition-all text-gray-900 text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••" 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none bg-gray-50 transition-all text-gray-900 text-sm" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                অপেক্ষা করুন...
              </span>
            ) : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-6 font-medium text-sm">
          আগে থেকে অ্যাকাউন্ট আছে? <Link href="/login" className="text-red-600 font-bold hover:text-red-700 hover:underline transition-all">লগইন করুন</Link>
        </p>
      </div>
    </div>
  )
}
