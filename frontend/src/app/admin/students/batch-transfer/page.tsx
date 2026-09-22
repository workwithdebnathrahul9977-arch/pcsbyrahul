'use client';
import { useState } from 'react';

export default function BatchTransferPage() {
  return (
    <div className="max-w-[1200px] mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Batch Transfer
        </h1>
        <p className="text-slate-500 text-sm mt-1">Transfer students from one batch to another.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
          <i className="fa-solid fa-arrow-right-arrow-left text-3xl"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Batch Transfer</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          This module is currently under construction. You will soon be able to transfer students between batches here.
        </p>
      </div>
    </div>
  );
}
