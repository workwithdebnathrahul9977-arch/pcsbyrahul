'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableCourseCard, CourseCardVisual } from './SortableCourseCard';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', fee: 0, originalFee: 0,
    academicClassId: '', academicGroupId: '', academicSubjectId: ''
  });

  const [subtitle, setSubtitle] = useState('');
  const [points, setPoints] = useState<string[]>(['']);
  const [courseSubjects, setCourseSubjects] = useState<Array<{ id: string, name: string, imageUrl: string }>>([]);

  const fetchData = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const [cRes, clRes, gRes, sRes] = await Promise.all([
        axios.get(`${url}/api/courses`),
        axios.get(`${url}/api/academic/classes`),
        axios.get(`${url}/api/academic/groups`),
        axios.get(`${url}/api/academic/subjects`),
      ]);
      setCourses(cRes.data);
      setClasses(clRes.data);
      setGroups(gRes.data);
      setSubjects(sRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = courses.findIndex((item) => item.id === active.id);
      const newIndex = courses.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(courses, oldIndex, newIndex);
      setCourses(newOrder); // Optimistic UI update

      // Save to backend
      const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      try {
        await axios.put(`${url}/api/courses/reorder`, {
          courseIds: newOrder.map(c => c.id)
        });
        toast.success('Course order updated!');
      } catch (err) {
        toast.error('Failed to save course order');
        fetchData(); // Revert on failure
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const openCreateModal = () => {
    setEditMode(false);
    setEditId('');
    setFormData({
      title: '', fee: 0, originalFee: 0,
      academicClassId: '', academicGroupId: '', academicSubjectId: ''
    });
    setSubtitle('');
    setPoints(['']);
    setCourseSubjects([]);
    setShowModal(true);
  };

  const openEditModal = (course: any) => {
    setEditMode(true);
    setEditId(course.id);
    setFormData({
      title: course.title,
      fee: course.fee,
      originalFee: course.originalFee || 0,
      academicClassId: course.academicClassId || '',
      academicGroupId: course.academicGroupId || '',
      academicSubjectId: course.academicSubjectId || ''
    });

    let parsedSubjects: Array<{ id: string, name: string, imageUrl: string }> = [];

    try {
      const parsed = JSON.parse(course.description || "{}");
      setSubtitle(parsed.subtitle || '');
      setPoints(parsed.points?.length ? parsed.points : ['']);
      parsedSubjects = parsed.subjects || [];
    } catch (e) {
      setSubtitle('');
      setPoints(['']);
    }
    
    // Safely migrate legacy imageUrl to subjects array without breaking base64
    if (course.imageUrl && parsedSubjects.length === 0) {
       if (course.imageUrl.startsWith('data:image')) {
         parsedSubjects = [{ id: '', name: '', imageUrl: course.imageUrl }];
       } else {
         const urls = course.imageUrl.split(',').slice(0, 2);
         parsedSubjects = urls.map((url: string) => ({ id: '', name: '', imageUrl: url }));
       }
    }
    
    setCourseSubjects(parsedSubjects);
    setShowModal(true);
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith('http') || cleanUrl.startsWith('data:')) return cleanUrl;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${baseUrl}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
  };

  const handleSubjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try {
      const res = await axios.post(`${url}/api/upload`, fd);
      const newSubjects = [...courseSubjects];
      newSubjects[idx].imageUrl = res.data.imageUrl;
      setCourseSubjects(newSubjects);
      toast.success('Subject Image uploaded!');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addSubject = () => {
    setCourseSubjects([...courseSubjects, { id: '', name: '', imageUrl: '' }]);
  };

  const updateSubject = (idx: number, field: string, value: string) => {
    const newSubjects = [...courseSubjects];
    if (field === 'id') {
      const found = subjects.find(s => s.id === value);
      newSubjects[idx].id = value;
      newSubjects[idx].name = found ? found.name : '';
    } else {
      (newSubjects[idx] as any)[field] = value;
    }
    setCourseSubjects(newSubjects);
  };

  const removeSubject = (idx: number) => {
    setCourseSubjects(courseSubjects.filter((_, i) => i !== idx));
  };

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, '']);
  };

  const removePoint = (index: number) => {
    if (points.length > 1) {
      setPoints(points.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    setLoading(true);

    const submitData = {
      ...formData,
      academicClassId: formData.academicClassId || null,
      academicGroupId: formData.academicGroupId || null,
      academicSubjectId: formData.academicSubjectId || null,
      imageUrl: courseSubjects.map(s => s.imageUrl).filter(Boolean).join(','),
      description: JSON.stringify({
        subtitle: subtitle,
        subjects: courseSubjects,
        points: points.filter(p => p.trim() !== '')
      })
    };

    try {
      if (editMode) {
        await axios.put(`${url}/api/courses/${editId}`, submitData);
        toast.success('Course updated successfully');
      } else {
        await axios.post(`${url}/api/courses`, submitData);
        toast.success('Course created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      await axios.delete(`${url}/api/courses/${id}`);
      toast.success('Course deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const inputClass = "w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Public Courses</h2>
          <p className="text-gray-500 text-sm">Manage courses displayed on the homepage</p>
        </div>
        <button onClick={openCreateModal} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Add Course
        </button>
      </div>

      <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={courses.map(c => c.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
              {courses.length === 0 ? (
                <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  No courses found. Click "Add Course" to create one.
                </div>
              ) : (
                courses.map((course) => (
                  <SortableCourseCard 
                    key={course.id} 
                    course={course} 
                    onEdit={openEditModal} 
                    onDelete={handleDelete} 
                  />
                ))
              )}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={{
            duration: 250,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
            {activeId ? (
              <CourseCardVisual
                course={courses.find((c) => c.id === activeId)}
                isOverlay={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editMode ? 'Edit Course' : 'Create New Course'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="courseForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Basic Info */}
                  <div className="md:col-span-2">
                    <label className={labelClass}>Course Title (Main Heading) *</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className={inputClass} placeholder="e.g. SSC 2027 Final Revision" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={labelClass}>Red Subtitle Text (e.g. বিষয়: সাধারণ গণিত)</label>
                    <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className={inputClass} placeholder="e.g. বিষয়: রসায়ন ও পদার্থবিজ্ঞান" />
                  </div>

                  {/* ERP Links */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <label className={labelClass}>Academic Class *</label>
                      <select required value={formData.academicClassId} onChange={e => setFormData({...formData, academicClassId: e.target.value})} className={inputClass}>
                        <option value="">-- Select Class --</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Academic Group</label>
                      <select value={formData.academicGroupId} onChange={e => setFormData({...formData, academicGroupId: e.target.value})} className={inputClass}>
                        <option value="">-- None --</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Course Subjects & Book Images */}
                  <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <label className="text-sm font-bold text-gray-800 block">Subjects Included & Book Images</label>
                        <p className="text-xs text-gray-500 mt-1">Select subjects and upload their book covers.</p>
                      </div>
                      <button type="button" onClick={addSubject} className="text-xs bg-blue-600 text-white font-bold px-3 py-1.5 rounded hover:bg-blue-700 shadow-sm transition">
                        + Add Subject
                      </button>
                    </div>
                    <div className="space-y-3">
                      {courseSubjects.map((sub, idx) => (
                        <div key={idx} className="flex gap-4 items-start bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Select Subject</label>
                            <select value={sub.id} onChange={e => updateSubject(idx, 'id', e.target.value)} className={inputClass}>
                              <option value="">-- Choose --</option>
                              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Book Cover</label>
                            {sub.imageUrl ? (
                              <div className="relative w-16 h-20 border border-gray-200 rounded-md overflow-hidden group">
                                <img src={getFullImageUrl(sub.imageUrl)} alt="Book" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => updateSubject(idx, 'imageUrl', '')} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <i className="fa-solid fa-trash text-xs"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="relative w-16 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer">
                                <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-upload'} text-sm mb-1`}></i>
                                <span className="text-[9px] font-bold">Upload</span>
                                <input type="file" accept="image/*" onChange={e => handleSubjectImageUpload(e, idx)} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                              </div>
                            )}
                          </div>

                          <button type="button" onClick={() => removeSubject(idx)} className="text-red-400 hover:text-red-600 mt-6 bg-red-50 hover:bg-red-100 w-8 h-8 rounded-full flex items-center justify-center transition">
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))}
                      {courseSubjects.length === 0 && (
                        <div className="text-center py-4 text-xs font-medium text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                          No subjects added. Click "+ Add Subject" to add books.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Points */}
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <label className="text-sm font-bold text-gray-800 block">Course Features / Class Schedule</label>
                        <p className="text-xs text-gray-500 mt-1">Add routine, class days, etc. (e.g., সপ্তাহে ৩ দিন ক্লাস)</p>
                      </div>
                      <button type="button" onClick={addPoint} className="text-xs bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded hover:bg-red-200 transition">
                        + Add Point
                      </button>
                    </div>
                    <div className="space-y-2">
                      {points.map((point, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            value={point} 
                            onChange={e => handlePointChange(idx, e.target.value)} 
                            className={inputClass} 
                            placeholder="e.g. সপ্তাহে ০৩ দিন ক্লাস" 
                          />
                          <button 
                            type="button" 
                            onClick={() => removePoint(idx)} 
                            className="text-red-500 hover:text-red-700 p-2"
                            disabled={points.length === 1}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Course Fee (BDT) *</label>
                    <input type="number" value={formData.fee} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Original Fee (Optional)</label>
                    <input type="number" value={formData.originalFee} onChange={e => setFormData({...formData, originalFee: Number(e.target.value)})} className={inputClass} />
                  </div>
                  
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} type="button" className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              <button form="courseForm" type="submit" disabled={loading || uploading} className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
