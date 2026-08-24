'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [opinion, setOpinion] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/testimonials`);
      setTestimonials(res.data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !school || !opinion) return toast.error('Required fields are missing');

    setSaving(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/testimonials`, {
        name, school, opinion, imageUrl
      });
      
      toast.success('Testimonial added successfully');
      setName('');
      setSchool('');
      setOpinion('');
      setImageFile(null);
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to add testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/testimonials/${id}`);
      toast.success('Deleted successfully');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Opinions (Testimonials)</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Add New Testimonial</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Student Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">School / College Name</label>
            <input 
              type="text" 
              value={school} 
              onChange={e => setSchool(e.target.value)} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500"
              placeholder="e.g. HSC 24, MC College"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Opinion (Quote)</label>
            <textarea 
              value={opinion} 
              onChange={e => setOpinion(e.target.value)} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 min-h-[100px]"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Student Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => {
                if (e.target.files) setImageFile(e.target.files[0]);
              }}
              className="w-full border p-2 rounded"
            />
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition"
          >
            {saving ? 'Adding...' : 'Add Testimonial'}
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative">
            <button 
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-2 rounded-full"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <div className="flex flex-col items-center text-center">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-full object-cover mb-4 shadow" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4 text-2xl font-bold">
                  {item.name.charAt(0)}
                </div>
              )}
              <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{item.school}</p>
              <p className="text-gray-700 italic text-sm line-clamp-4">"{item.opinion}"</p>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-gray-500 col-span-full">No testimonials added yet.</p>
        )}
      </div>
    </div>
  );
}
