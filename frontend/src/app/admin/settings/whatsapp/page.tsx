'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function WhatsAppSettings() {
  const [status, setStatus] = useState<{ isReady: boolean; qrCode: string | null }>({ isReady: false, qrCode: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    // Poll every 5 seconds if not ready to catch QR updates
    const interval = setInterval(() => {
      fetchStatus(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/whatsapp/status`);
      setStatus(data);
    } catch (e) {
      if (!silent) toast.error('Failed to connect to WhatsApp Gateway');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to disconnect WhatsApp?')) return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/whatsapp/logout`);
      toast.success('Disconnected successfully');
      fetchStatus();
    } catch (e) {
      toast.error('Failed to disconnect');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp API Gateway</h1>
        <p className="text-sm text-gray-500">Connect your coaching center's WhatsApp number to send automated messages.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
        {status.isReady ? (
          <>
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <i className="fa-brands fa-whatsapp text-5xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">WhatsApp Connected Successfully!</h2>
            <p className="text-gray-500 mb-8 max-w-md">Your WhatsApp API is up and running. The system will now send messages automatically in the background without opening new tabs.</p>
            <button onClick={handleLogout} className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-bold transition-colors">
              Disconnect WhatsApp
            </button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-6">
              <i className="fa-solid fa-qrcode text-4xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Connect WhatsApp</h2>
            <p className="text-gray-500 mb-8 max-w-md">Scan the QR code below using your coaching center's WhatsApp to link the API. Go to WhatsApp -> Linked Devices -> Link a Device.</p>
            
            {status.qrCode ? (
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl mb-4 bg-white">
                <img src={status.qrCode} alt="WhatsApp QR Code" className="w-64 h-64 object-contain" />
              </div>
            ) : (
              <div className="w-64 h-64 border-2 border-dashed border-gray-200 rounded-xl mb-4 flex items-center justify-center bg-gray-50 text-gray-400">
                <i className="fa-solid fa-spinner fa-spin text-3xl"></i>
                <p className="text-xs font-bold mt-2 ml-2">Generating QR...</p>
              </div>
            )}
            <p className="text-xs text-gray-400 italic mt-2"><i className="fa-solid fa-circle-info mr-1"></i> QR Code refreshes automatically. Keep this page open.</p>
          </>
        )}
      </div>
    </div>
  );
}
