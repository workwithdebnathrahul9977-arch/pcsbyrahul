'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p>Loading Editor...</p>
});

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  fee: number;
  originalFee: number | null;
  type: string;
  category: string;
  paymentType: string;
  durationMonths: number | null;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState('');
  const [originalFee, setOriginalFee] = useState('');
  const [type, setType] = useState('Offline');
  const [category, setCategory] = useState('SSC');
  const [paymentType, setPaymentType] = useState('MONTHLY');
  const [durationMonths, setDurationMonths] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/categories`);
      setCategories(res.data);
      if (res.data.length > 0 && category === 'SSC') {
        // Just keep the first one if we need a valid default, 
        // though we allow string matching.
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/courses`);
      setCourses(res.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setTitle(course.title);
    setDescription(course.description || '');
    setFee(course.fee.toString());
    setOriginalFee(course.originalFee ? course.originalFee.toString() : '');
    setType(course.type || 'Offline');
    setCategory(course.category || (categories[0]?.name || 'SSC'));
    setPaymentType(course.paymentType || 'MONTHLY');
    setDurationMonths(course.durationMonths ? course.durationMonths.toString() : '');
    setImageUrl(course.imageUrl || '');
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete course');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFee('');
    setOriginalFee('');
    setType('Offline');
    setCategory(categories[0]?.name || 'SSC');
    setPaymentType('MONTHLY');
    setDurationMonths('');
    setImageFile(null);
    setImageUrl('');
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fee) {
      return toast.error('Title and Fee are required');
    }
    if (!category && categories.length > 0) {
      // Auto assign if forgotten
      setCategory(categories[0].name);
    }

    setUploading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/upload`, formData);
        finalImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        title,
        description,
        imageUrl: finalImageUrl,
        fee: parseFloat(fee),
        originalFee: originalFee ? parseFloat(originalFee) : null,
        type,
        category: category || categories[0]?.name || 'Uncategorized',
        paymentType,
        durationMonths: durationMonths ? parseInt(durationMonths) : null
      };

      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/courses/${editingId}`, payload);
        toast.success('Course updated');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/courses`, payload);
        toast.success('Course added');
      }
      resetForm();
      fetchCourses();
    } catch (error) {
      toast.error('Failed to save course');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700"
          >
            + Add New Course
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 max-w-3xl">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Course' : 'Add New Course'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border p-2 rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Platform / Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full border p-2 rounded">
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                  <option value="Record">Record</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border p-2 rounded" required>
                  {categories.length === 0 && <option value="SSC">SSC (Default)</option>}
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Fee (Current Price) *</label>
                <input type="number" value={fee} onChange={e => setFee(e.target.value)} required className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Original Fee (Strike-through)</label>
                <input type="number" value={originalFee} onChange={e => setOriginalFee(e.target.value)} className="w-full border p-2 rounded" placeholder="Optional" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Payment Type</label>
                <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className="w-full border p-2 rounded">
                  <option value="MONTHLY">Monthly Fee (প্রতি মাসে)</option>
                  <option value="ONE_TIME">One-time Full Course (এককালীন)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Course Duration (Months)</label>
                <input 
                  type="number" 
                  value={durationMonths} 
                  onChange={e => setDurationMonths(e.target.value)} 
                  className="w-full border p-2 rounded" 
                  placeholder={paymentType === 'MONTHLY' ? "e.g. 6" : "Not applicable for One-time"}
                  disabled={paymentType === 'ONE_TIME'}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Banner Image</label>
              {imageUrl && !imageFile && <img src={imageUrl} alt="preview" className="h-20 mb-2 rounded" />}
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border p-2 rounded" />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-bold mb-2">Description</label>
              <div className="bg-white">
                <ReactQuill 
                  theme="snow" 
                  value={description} 
                  onChange={setDescription} 
                  className="h-48 mb-12"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={uploading} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50">
                {uploading ? 'Saving...' : 'Save Course'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-2 rounded font-bold hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b">Image</th>
              <th className="p-4 border-b">Title</th>
              <th className="p-4 border-b">Type</th>
              <th className="p-4 border-b">Price</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No courses found</td></tr>
            ) : (
              courses.map(course => (
                <tr key={course.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">
                    {course.imageUrl ? <img src={course.imageUrl} alt={course.title} className="w-16 h-10 object-cover rounded" /> : 'N/A'}
                  </td>
                  <td className="p-4 font-bold">{course.title}</td>
                  <td className="p-4"><span className="bg-gray-200 px-2 py-1 rounded text-sm">{course.type}</span></td>
                  <td className="p-4">
                    ৳{course.fee} {course.originalFee && <span className="text-gray-400 line-through text-xs ml-1">৳{course.originalFee}</span>}
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleEdit(course)} className="text-blue-600 hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
