'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TestimonialsPage() {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage student reviews and success stories</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-red-500/20 flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Add Testimonial
        </button>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          <i className="fa-solid fa-comments"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Testimonials Management</h3>
        <p className="text-gray-500 max-w-md mx-auto">This section is ready to manage your student reviews and testimonials.</p>
      </div>
    </div>
  );
}
