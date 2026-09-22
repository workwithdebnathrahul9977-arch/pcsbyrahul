export default function Contact() {
  return (
    <div className="bg-[#fef9f9] min-h-screen pb-24 font-sans">
      <div className="max-w-[1450px] mx-auto px-5 md:px-8 pt-10 md:pt-16">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> GET IN TOUCH
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">যোগাযোগ করুন</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            আমাদের অফিসে আপনাকে স্বাগতম! ক্লাস সংক্রান্ত যেকোনো বিষয় অথবা কোর্সের বিস্তারিত তথ্য জানার জন্য আমাদের সাথে 
            যোগাযোগ করতে পারেন। আমরা প্রতিশ্রুতিবদ্ধ যাতে আপনি সঠিক তথ্য এবং সর্বোত্তম সেবা পান।
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-50 overflow-hidden flex flex-col md:flex-row">
          
          {/* Map Side */}
          <div className="md:w-1/2 p-3 md:p-4">
            <div className="w-full h-80 md:h-full bg-gray-100 rounded-[1.5rem] overflow-hidden relative border border-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3630.992226184334!2d91.77116764874837!3d24.485726204066523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751757abdae2ec1%3A0x33b4cb7857295518!2sPhysChemia%20With%20Sumel%20Sir!5e0!3m2!1sen!2sbd!4v1787517000665!5m2!1sen!2sbd" 
                className="w-full h-full absolute inset-0 grayscale-[20%] contrast-[1.05]" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

          {/* Info Side */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              PhysChemia Center
            </h2>
            
            <div className="space-y-4 text-gray-500 font-medium mb-10 pl-13 ml-2 md:ml-3">
              <p className="flex items-start gap-3">
                <i className="fa-solid fa-map-pin text-red-400 mt-1 shrink-0"></i>
                কোর্ট-পয়েন্ট (হাফিজা খাতুন স্কুলের সামনে) ৩য় তলা, শাহমোস্তফা রোড, মৌলভীবাজার, Moulvibazar 3200
              </p>
              <p className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-red-400 shrink-0"></i>
                ০১৭১২-২৩৪৫৬৭, ০১৭৮৮-৫২২৩৯০
              </p>
              <p className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-red-400 shrink-0"></i>
                contact@physchemia.com
              </p>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <i className="fa-regular fa-clock"></i>
              </div>
              অফিস ভিজিট টাইম
            </h2>
            
            <div className="space-y-3 text-gray-500 font-medium mb-12 pl-13 ml-2 md:ml-3">
              <p className="flex items-center gap-3">
                <i className="fa-solid fa-sun text-orange-400 shrink-0"></i>
                সকাল: ০৮টা থেকে ১০টা
              </p>
              <p className="flex items-center gap-3">
                <i className="fa-solid fa-moon text-indigo-400 shrink-0"></i>
                বিকাল: ০৩টা থেকে রাত ১০টা
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="https://goo.gl/maps/something" target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-[0_4px_14px_0_rgb(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 text-sm flex items-center gap-2">
                <i className="fa-solid fa-diamond-turn-right"></i> Get Directions
              </a>
              <a href="#" className="bg-white border border-gray-200 text-[#1877F2] w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-lg">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="bg-white border border-gray-200 text-[#25D366] w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-lg">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a href="tel:01712234567" className="bg-white border border-gray-200 text-gray-700 w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-800 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-lg">
                <i className="fa-solid fa-phone"></i>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
