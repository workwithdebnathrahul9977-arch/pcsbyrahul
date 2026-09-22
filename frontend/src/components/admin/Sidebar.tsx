'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [siteLogo, setSiteLogo] = useState('/logo.png');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings/SITE_LOGO`)
      .then(res => res.json())
      .then(data => { if (data.value) setSiteLogo(data.value); })
      .catch(console.error);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => 
      prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
    );
  };

  const navItems = [
    { name: 'Dashboard', icon: 'fa-solid fa-house', path: '/admin' },
    { name: 'Live Support', icon: 'fa-solid fa-headset', path: '/admin/support' },
    { 
      name: 'Notification Management', 
      icon: 'fa-solid fa-comment-sms', 
      hasSub: true, 
      id: 'notifications',
      children: [
        { name: 'New Notification', icon: 'fa-solid fa-plus', path: '/admin/notifications/create' },
        { name: 'Notification List', icon: 'fa-solid fa-list', path: '/admin/notifications/list' },
        { name: 'Notification Category', icon: 'fa-solid fa-tags', path: '/admin/notifications/categories' }
      ]
    },
    { 
      name: 'Public Courses', 
      icon: 'fa-solid fa-layer-group', 
      path: '/admin/courses' 
    },
    { name: 'Account Manager', icon: 'fa-solid fa-house-user', path: '/admin/accounts' },

    { name: 'Academic Function', icon: 'fa-solid fa-laptop-file', hasSub: true, id: 'academic', children: [
        { name: 'Create Class', icon: 'fa-solid fa-plus', path: '/admin/academic/class' },
        { name: 'Create Subject', icon: 'fa-solid fa-plus', path: '/admin/academic/subject' },
        { name: 'Create Group', icon: 'fa-solid fa-plus', path: '/admin/academic/group' },
        { name: 'Create Batch', icon: 'fa-solid fa-plus', path: '/admin/academic/batch' }
    ] },
    { 
      name: 'Admission', 
      icon: 'fa-solid fa-user-graduate', 
      hasSub: true, 
      id: 'admission',
      children: [
        { name: 'New Admission', icon: 'fa-solid fa-plus', path: '/admin/admission/new' },
        { name: 'Online Admission Requests', icon: 'fa-solid fa-list-check', path: '/admin/admission/requests' },
        { name: 'Form Settings', icon: 'fa-solid fa-gear', path: '/admin/admission/form-settings' },
        { name: 'Blank Admission Form', icon: 'fa-solid fa-file-arrow-down', path: '/admin/admission/blank-form' },
      ]
    },
    { 
      name: 'Student Details', 
      icon: 'fa-solid fa-id-card', 
      hasSub: true, 
      id: 'students',
      children: [
        { name: 'Students List View', icon: 'fa-solid fa-eye', path: '/admin/students' },
        { name: 'Student Deactivation', icon: 'fa-solid fa-user-slash', path: '/admin/students/deactivate' },
        { name: 'Deactive List', icon: 'fa-solid fa-list', path: '/admin/students/deactive-list' },
        { name: 'Batch Transfer', icon: 'fa-solid fa-arrow-right-arrow-left', path: '/admin/students/batch-transfer' },
        { name: 'Manage Subjects', icon: 'fa-solid fa-arrow-right-arrow-left', path: '/admin/students/subjects' }
      ]
    },
      { 
        name: 'Student Attendance', 
        icon: 'fa-solid fa-clipboard-user', 
        hasSub: true, 
        id: 'attendance',
        children: [
          { name: 'Create Attendance', icon: 'fa-solid fa-plus', path: '/admin/attendance/create' },
          { name: 'Attendance List', icon: 'fa-solid fa-list-check', path: '/admin/attendance/list' },
          { name: 'Monthly Attendance List', icon: 'fa-solid fa-building-user', path: '/admin/attendance/monthly' },
          { name: 'Download Attendance Blank Sheet', icon: 'fa-solid fa-file-arrow-down', path: '/admin/attendance/blank-sheet' },
          { name: 'Attendance Settings', icon: 'fa-solid fa-gear', path: '/admin/attendance/settings' },
        ]
      },
      { 
        name: 'Student Reports', 
        icon: 'fa-solid fa-list-ul', 
        hasSub: true, 
        id: 'reports',
        children: [
        { name: 'Payment Reports', icon: 'fa-solid fa-money-bill-trend-up', path: '/admin/reports/payment' },
        { name: 'Attendance Reports', icon: 'fa-solid fa-building-user', path: '/admin/reports/attendance' },
        { name: 'Result Reports', icon: 'fa-solid fa-building-user', path: '/admin/reports/result' },
        { name: 'Monthly Report Card', icon: 'fa-solid fa-list', path: '/admin/reports/monthly-card' },
        { name: 'Monthly Homework Report', icon: 'fa-solid fa-list', path: '/admin/reports/monthly-homework' }
      ]
    },
    { 
      name: 'Fee Collection', 
      icon: 'fa-solid fa-money-bill', 
      hasSub: true, 
      id: 'fee',
      children: [
        { name: 'Receive Student Fee', icon: 'fa-solid fa-file-invoice-dollar', path: '/admin/fees/receive' },
        { name: 'Student Fee History', icon: 'fa-solid fa-list', path: '/admin/fees/history' },
        { name: 'Due List', icon: 'fa-solid fa-list', path: '/admin/fees/due' },
        { name: 'Regenerate Fees', icon: 'fa-solid fa-list', path: '/admin/fees/regenerate' },
        { name: 'Cancel Payment', icon: 'fa-solid fa-xmark', path: '/admin/fees/cancel' },
        { name: 'Fee Category', icon: 'fa-solid fa-list', path: '/admin/fees/category' },
        { name: 'Transaction Trash', icon: 'fa-solid fa-list', path: '/admin/fees/trash' },
      ]
    },
    { 
      name: 'Result Management', 
      icon: 'fa-solid fa-pen-to-square', 
      hasSub: true, 
      id: 'exam',
      children: [
        { name: 'Create Exam', icon: 'fa-solid fa-plus', path: '/admin/exams/create' },
        { name: 'Exam List', icon: 'fa-solid fa-list-ul', path: '/admin/exams' },
        { name: 'Create Combine Result', icon: 'fa-solid fa-plus', path: '/admin/exams/combine/create' },
        { name: 'Combine Result List', icon: 'fa-solid fa-list-ul', path: '/admin/exams/combine' },
        { name: 'Exam Category', icon: 'fa-solid fa-list-ul', path: '/admin/exams/categories' },
      ]
    },
    { 
      name: 'Website Settings', 
      icon: 'fa-solid fa-globe', 
      hasSub: true, 
      id: 'website', 
      children: [
        { name: 'Site Info', icon: 'fa-solid fa-circle-info', path: '/admin/settings/site' },
        { name: 'WhatsApp API', icon: 'fa-brands fa-whatsapp', path: '/admin/settings/whatsapp' },
        { name: 'Sliders', icon: 'fa-solid fa-images', path: '/admin/website/sliders' },
        { name: 'Notices', icon: 'fa-solid fa-bullhorn', path: '/admin/website/notices' },
        { name: 'Gallery', icon: 'fa-solid fa-camera', path: '/admin/website/gallery' },
        { name: 'Video Gallery', icon: 'fa-brands fa-youtube', path: '/admin/website/videos' },
        { name: 'Testimonials', icon: 'fa-solid fa-comments', path: '/admin/website/testimonials' },
        { name: 'Team Members', icon: 'fa-solid fa-users', path: '/admin/website/team' },
        { name: 'Success Stories', icon: 'fa-solid fa-star', path: '/admin/website/success-stories' }
      ]
    }
  ];

  return (
    <div className="w-72 bg-[#1a1b3a] min-h-screen text-gray-200 py-4 flex flex-col h-full shadow-2xl overflow-y-auto hidden md:flex">
      <div className="px-6 mb-8 mt-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
          <img src={siteLogo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">PhysChemia</h2>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">ERP Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item, idx) => (
          <div key={idx} className="mb-1">
            {item.hasSub ? (
              <div>
                <button 
                  onClick={() => toggleMenu(item.id || '')}
                  className={"w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 " + (openMenus.includes(item.id || '') ? 'text-yellow-400' : 'text-gray-300 hover:bg-[#2a2c50] hover:text-white')}
                >
                  <div className="flex items-center gap-3">
                    <i className={item.icon + " w-5 text-center " + (openMenus.includes(item.id || '') ? 'text-yellow-400' : 'text-yellow-500')}></i>
                    <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                  </div>
                  <i className={"fa-solid fa-caret-down text-xs transition-transform duration-300 " + (openMenus.includes(item.id || '') ? 'rotate-180 text-yellow-400' : 'text-gray-500')}></i>
                </button>
                
                {/* Submenu */}
                <div className={"overflow-hidden transition-all duration-300 ease-in-out " + (openMenus.includes(item.id || '') ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0')}>
                  <div className="pl-6 space-y-1">
                    {item.children?.map((child, cIdx) => {
                      const isActive = pathname === child.path;
                      return (
                        <Link 
                          key={cIdx} 
                          href={child.path}
                          className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors " + (isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200')}
                        >
                          <i className={child.icon + " w-4 text-center text-xs " + (isActive ? 'text-yellow-400' : 'text-gray-500')}></i>
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href={item.path}
                className={"flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 " + (pathname === item.path ? 'text-yellow-400' : 'text-gray-300 hover:bg-[#2a2c50] hover:text-white')}
              >
                <i className={item.icon + " w-5 text-center text-yellow-500"}></i>
                <span className="font-semibold text-sm tracking-wide">{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
      
      <div className="p-4 mt-8">
        <div className="bg-[#2a2c50] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-bold text-white">
            A
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-white text-sm font-bold truncate">Admin User</h4>
            <p className="text-gray-400 text-xs">admin@physchemia.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
