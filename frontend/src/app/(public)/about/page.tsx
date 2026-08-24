'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function About() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sirImage, setSirImage] = useState<string>('');

  useEffect(() => {
    // Fetch team members
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/team`)
      .then(res => setTeamMembers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    // Fetch Sir's image from settings
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings/ABOUT_SIR_IMAGE`)
      .then(res => {
        if (res.data && res.data.value) {
          setSirImage(res.data.value);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Director Profile Section (Hero Style) */}
      <section className="relative overflow-hidden bg-gray-50 border-b border-gray-100">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-100 opacity-50 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-red-50 opacity-50 blur-3xl pointer-events-none"></div>
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-red-50 hover:border-red-100 transition-all duration-300 hover:shadow-red-900/5">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gray-200 h-96 md:h-auto flex items-center justify-center relative overflow-hidden">
              {sirImage ? (
                <img src={sirImage} alt="Sumel Sir" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="flex flex-col items-center text-gray-400/60">
                  <i className="fa-solid fa-user-tie text-7xl mb-4"></i>
                  <span className="text-sm font-bold tracking-widest uppercase">Photo</span>
                </div>
              )}
            </div>
            <div className="md:w-2/3 p-10 md:p-16">
              <h4 className="text-red-600 font-bold mb-2 uppercase tracking-wider">আমাদের পরিচালক</h4>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">— জনাব সুমেল স্যার</h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                <p>
                  একজন দক্ষ ও অভিজ্ঞ শিক্ষক, যিনি মৌলভীবাজার জেলার শিক্ষাক্ষেত্রে অসামান্য অবদান রেখে চলেছেন। 
                  তার অনন্য শিক্ষাদান কৌশল, গভীর বিশ্লেষণধর্মী পদ্ধতি এবং বাস্তব জীবনের উদাহরণ দিয়ে বোঝানোর ক্ষমতা 
                  শিক্ষার্থীদের মাঝে পদার্থ ও রসায়নের প্রতি ভালোবাসা তৈরি করেছে।
                </p>
                <p>
                  তার শিক্ষাদানের মাধ্যমে অসংখ্য শিক্ষার্থী বিভিন্ন প্রতিযোগিতা ও একাডেমিকে সাফল্য অর্জন করেছে। 
                  তার দিকনির্দেশনায় শিক্ষার্থীরা বুয়েট, কুয়েট, ঢাকা বিশ্ববিদ্যালয় সহ দেশের শীর্ষস্থানীয় প্রতিষ্ঠানে অধ্যয়ন করছে।
                </p>
              </div>

              <div className="flex space-x-4 mt-8">
                <a href="#" className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm text-xl">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#" className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition shadow-sm text-xl">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
                <a href="#" className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm text-xl">
                  <i className="fa-solid fa-phone"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Team Section (Dark Theme like Home Courses) */}
      <section className="bg-gradient-to-b from-red-800 to-red-900 border-y border-red-900/30 py-16 md:py-24 mb-16">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
          
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative inline-block pb-4">টিম অব লিডিং
            <span className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded"></span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
            আমাদের সাফল্যের পেছনে যারা নিষ্ঠা ও দক্ষতার সাথে কাজ করে সেরা অভিজ্ঞতা নিশ্চিত করছেন—তাদের সাথে পরিচিত হোন।
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-300 py-10">Loading team...</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center text-gray-400 py-10 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm">
            <span className="text-4xl mb-4 block">👥</span>
            <p className="text-lg font-bold">টিম মেম্বার লিস্ট আপডেট করা হচ্ছে...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-4 sm:px-0">
            {teamMembers.map((member, idx) => (
              <div key={idx} tabIndex={0} className="w-full max-w-[340px] sm:max-w-none mx-auto group relative bg-[#f4f7f6] rounded-2xl overflow-hidden shadow-lg h-[460px] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 focus:shadow-2xl focus:-translate-y-2 outline-none transition-all duration-500 cursor-pointer">
                {/* Full Background Image */}
                <div className="absolute inset-0 bg-gray-200">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 group-focus:scale-110" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-gray-400/60">
                      <i className="fa-solid fa-user-tie text-7xl mb-3"></i>
                    </div>
                  )}
                </div>

                {/* Dark Gradient Overlay - Always shows a bit at bottom, becomes darker on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 group-focus:opacity-95 transition-opacity duration-500"></div>

                {/* Top Left Badge - Always visible */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#00c978] text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full shadow-md tracking-wider">
                    বর্তমান সদস্য
                  </span>
                </div>

                {/* Top Right Social Links - Show on hover/focus */}
                <div className="absolute top-4 right-4 z-10 flex flex-col space-y-3 opacity-0 translate-x-4 group-hover:opacity-100 group-focus:opacity-100 group-hover:translate-x-0 group-focus:translate-x-0 transition-all duration-500 delay-100">
                  {member.facebook && (
                    <a href={member.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  )}
                  {(member.whatsapp || member.phone) && (
                    <a href={`https://wa.me/88${member.whatsapp || member.phone}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <i className="fa-brands fa-whatsapp text-lg"></i>
                    </a>
                  )}
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <i className="fa-brands fa-instagram text-lg"></i>
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#0077b5] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <i className="fa-brands fa-linkedin-in text-sm"></i>
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <i className="fa-brands fa-x-twitter text-sm"></i>
                    </a>
                  )}
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 w-full pb-6 z-10 flex flex-col justify-end transition-transform duration-500">
                  {/* Role Badge - Attached to left edge */}
                  <div className="mb-3 transform translate-y-0 transition-transform duration-500">
                    <span className="bg-red-600 text-white text-sm font-bold pl-6 pr-5 py-1.5 shadow-lg inline-block rounded-r-xl border-y border-r border-red-500/30">
                      {member.role}
                    </span>
                  </div>
                  
                  <div className="px-6">
                    {/* Name */}
                    <h3 className="text-lg font-bold text-white drop-shadow-md mb-2 tracking-wide">
                      {member.name}
                    </h3>
                  
                  {/* Expandable Details Container - Hidden by default, expands on hover/focus */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                    <div className="overflow-hidden">
                      {/* Line Separator */}
                      <div className="w-full h-[1px] bg-white/20 my-4 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 delay-150"></div>

                      {/* Details List */}
                      <div className="space-y-4 pb-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 delay-200">
                        {member.phone && (
                          <div className="flex items-center text-gray-200 text-sm font-medium">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0 shadow-inner">
                              <i className="fa-solid fa-phone text-xs text-[#00c978]"></i>
                            </div>
                            {member.phone}
                          </div>
                        )}
                        
                        {/* Render Bio if available */}
                        {member.bio && member.bio !== '<p><br></p>' && member.bio !== '<p>NULL</p>' && (
                          <div className="flex items-start text-gray-200 text-sm font-medium">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0 shadow-inner mt-1">
                              <i className="fa-solid fa-circle-info text-xs text-[#00c978]"></i>
                            </div>
                            <div className="line-clamp-3 mt-1 [&_*]:!text-gray-200 [&_*]:!bg-transparent [&_*]:!m-0 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: member.bio }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
        )}

        </div>
      </section>
    </div>
  )
}
