'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableVideoRow = ({ video, onEdit, onDelete }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: video.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 0 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-grab active:cursor-grabbing mb-3">
      <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400"><i className="fa-brands fa-youtube text-3xl"></i></div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{video.title}</h3>
        <p className="text-sm text-gray-500 truncate">{video.youtubeUrl}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onPointerDown={(e) => { e.stopPropagation(); onEdit(video); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition pointer-events-auto">
          <i className="fa-solid fa-pen"></i>
        </button>
        <button onPointerDown={(e) => { e.stopPropagation(); onDelete(video.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition pointer-events-auto">
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default function VideosAdminClient() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({ title: '', youtubeUrl: '', isActive: true });
  const [activeId, setActiveId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${url}/api/videos`);
      setVideos(res.data);
    } catch (error) {
      toast.error('Failed to load videos');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => setActiveId(event.active.id);
  const handleDragCancel = () => setActiveId(null);

  const handleDragEnd = async (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex(v => v.id === active.id);
      const newIndex = videos.findIndex(v => v.id === over.id);
      const newOrder = arrayMove(videos, oldIndex, newIndex);
      setVideos(newOrder);
      try {
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        await axios.put(`${url}/api/videos/reorder`, { videoIds: newOrder.map(v => v.id) });
        toast.success('Order saved!');
      } catch (err) {
        toast.error('Failed to save order');
        fetchData();
      }
    }
  };

  const getYoutubeThumb = (url: string) => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    if (match && match[1].length === 11) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const payload = { ...formData, thumbnailUrl: getYoutubeThumb(formData.youtubeUrl) };
      if (editId) {
        await axios.put(`${url}/api/videos/${editId}`, payload);
        toast.success('Video updated!');
      } else {
        await axios.post(`${url}/api/videos`, payload);
        toast.success('Video added!');
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
    if (!confirm('Delete this video?')) return;
    try {
      const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.delete(`${url}/api/videos/${id}`);
      toast.success('Video deleted');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campus Videos</h1>
        <button onClick={() => { setEditId(''); setFormData({ title: '', youtubeUrl: '', isActive: true }); setShowModal(true); }} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition">
          <i className="fa-solid fa-plus mr-2"></i> Add Video
        </button>
      </div>

      <div className="max-w-4xl">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          <SortableContext items={videos.map(v => v.id)} strategy={rectSortingStrategy}>
            {videos.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">No videos found.</div>
            ) : (
              videos.map((video) => (
                <SortableVideoRow key={video.id} video={video} onEdit={(v: any) => { setEditId(v.id); setFormData({ title: v.title, youtubeUrl: v.youtubeUrl, isActive: v.isActive }); setShowModal(true); }} onDelete={handleDelete} />
              ))
            )}
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-2xl scale-105 cursor-grabbing opacity-90">
                <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={videos.find(v => v.id === activeId)?.thumbnailUrl} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1"><h3 className="font-bold text-gray-900">{videos.find(v => v.id === activeId)?.title}</h3></div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editId ? 'Edit Video' : 'Add Video'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Video Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">YouTube URL</label>
                <input type="url" value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2" required placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-bold">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold disabled:opacity-50">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
