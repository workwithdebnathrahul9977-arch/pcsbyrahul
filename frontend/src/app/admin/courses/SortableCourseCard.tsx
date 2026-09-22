import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const getFullImageUrl = (url: string) => {
  if (!url) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http') || cleanUrl.startsWith('data:')) return cleanUrl;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
};

export const CourseCardVisual = ({ course, onEdit, onDelete, isOverlay }: any) => {
  let images: string[] = [];
  if (course.description) {
    try {
      const parsed = JSON.parse(course.description);
      if (parsed.subjects && parsed.subjects.length > 0) {
        images = parsed.subjects.map((s: any) => s.imageUrl).filter(Boolean);
      }
    } catch (e) {}
  }
  if (images.length === 0 && course.imageUrl) {
    if (course.imageUrl.startsWith('data:image')) {
      images = [course.imageUrl];
    } else {
      images = course.imageUrl.split(',').slice(0, 2);
    }
  }

  return (
    <div className={`flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 group max-w-[340px] mx-auto w-full relative ${isOverlay ? 'shadow-2xl scale-105 rotate-2 cursor-grabbing' : 'shadow-sm hover:shadow-lg transition-all cursor-grab active:cursor-grabbing'}`}>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-[60] pointer-events-none rounded-2xl">
        <button 
          onPointerDown={(e) => { e.stopPropagation(); onEdit && onEdit(course); }} 
          className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-50 hover:scale-110 shadow-xl pointer-events-auto transition transform"
        >
          <i className="fa-solid fa-pen text-lg"></i>
        </button>
        <button 
          onPointerDown={(e) => { e.stopPropagation(); onDelete && onDelete(course.id); }} 
          className="w-12 h-12 bg-white text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 hover:scale-110 shadow-xl pointer-events-auto transition transform"
        >
          <i className="fa-solid fa-trash text-lg"></i>
        </button>
      </div>

      <div className="h-48 md:h-[220px] bg-gradient-to-br from-[#e60000] via-[#cc0000] to-[#8a0000] flex flex-col items-center justify-center p-3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '18px 18px' }}></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
        <i className="fa-solid fa-book-open absolute -bottom-4 -right-4 text-white/5 text-[8rem] md:text-[9rem] rotate-[15deg] pointer-events-none"></i>
        
        <div className="flex flex-row items-center justify-center gap-3 mb-3 z-10 transition-all duration-300">
          {images.length === 0 ? (
            <div className="w-24 h-32 sm:w-28 sm:h-36 bg-white/10 rounded shadow-inner mb-3 flex flex-col items-center justify-center backdrop-blur-sm">
              <i className="fa-solid fa-book-open-reader text-2xl text-white/80"></i>
            </div>
          ) : (
            images.slice(0, 2).map((imgUrl, idx) => (
              <img key={idx} src={getFullImageUrl(imgUrl)} alt={course.title} className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded shadow-lg transition-shadow duration-300 pointer-events-none" />
            ))
          )}
        </div>
      </div>
      
      <div className="p-4 md:p-5 flex flex-col flex-1 pointer-events-none bg-white">
        <h3 className="text-xl md:text-[22px] font-black text-gray-900 mb-1.5 leading-tight">{course.title}</h3>
        <div className="text-gray-600 text-[13px] md:text-sm mb-4 flex-1 mt-1.5">
          <div 
            className="leading-relaxed space-y-1 [&>h2]:!text-red-600 [&>h2]:text-[18px] md:[&>h2]:text-[20px] [&>h2]:font-bold [&>ul]:list-none [&>ul]:mt-1.5 [&>ul>li]:relative [&>ul>li]:pl-4 [&>ul>li]:mb-1 [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-1.5 [&>ul>li::before]:w-1.5 [&>ul>li::before]:h-1.5 [&>ul>li::before]:bg-red-500 [&>ul>li::before]:rounded-full"
            dangerouslySetInnerHTML={{ 
              __html: (() => {
                if (!course.description) return 'Description pending...';
                try {
                  const parsed = JSON.parse(course.description);
                  let html = '';
                  if (parsed.subtitle) html += `<h2>${parsed.subtitle}</h2>`;
                  if (parsed.points && parsed.points.length > 0) {
                    html += `<ul>${parsed.points.map((p: string) => `<li>${p}</li>`).join('')}</ul>`;
                  }
                  return html;
                } catch (e) {
                  return course.description;
                }
              })() 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const SortableCourseCard = ({ course, onEdit, onDelete }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: course.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Make slot highly visible when dragged
    zIndex: isDragging ? 0 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CourseCardVisual course={course} onEdit={onEdit} onDelete={onDelete} isOverlay={false} />
    </div>
  );
};
