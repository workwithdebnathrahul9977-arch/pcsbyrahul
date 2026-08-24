export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-red-700 mb-4 tracking-wide">যোগাযোগ করুন</h1>
          <p className="text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
            আমাদের অফিসে আপনাকে স্বাগতম! ক্লাস সংক্রান্ত যেকোনো বিষয় অথবা কোর্সের বিস্তারিত তথ্য জানার জন্য আমাদের সাথে 
            যোগাযোগ করতে পারেন। আমরা প্রতিশ্রুতিবদ্ধ যাতে আপনি সঠিক তথ্য এবং সর্বোত্তম সেবা পান।
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Map Side */}
          <div className="md:w-1/2 p-2">
            <div className="w-full h-96 md:h-full bg-gray-200 rounded-2xl overflow-hidden relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3630.992226184334!2d91.77116764874837!3d24.485726204066523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751757abdae2ec1%3A0x33b4cb7857295518!2sPhysChemia%20With%20Sumel%20Sir!5e0!3m2!1sen!2sbd!4v1787517000665!5m2!1sen!2sbd" 
                className="w-full h-full absolute inset-0" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

          {/* Info Side */}
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            
            <h2 className="text-2xl font-bold text-red-700 mb-6">PhysChemia Center</h2>
            
            <div className="space-y-4 text-gray-600 font-medium mb-10">
              <p>কোর্ট-পয়েন্ট (হাফিজা খাতুন স্কুলের সামনে) ৩য় তলা, শাহমোস্তফা রোড, মৌলভীবাজার, Moulvibazar 3200</p>
              <p>মোবাইল: ০১৭১২-২৩৪৫৬৭, ০১৭৮৮-৫২২৩৯০</p>
              <p>Email: contact@physchemia.com</p>
            </div>

            <h2 className="text-2xl font-bold text-red-700 mb-6">অফিস ভিজিট টাইম</h2>
            
            <div className="space-y-3 text-gray-600 font-medium mb-10">
              <p>সকাল: ০৮টা থেকে ১০টা</p>
              <p>বিকাল: ০৩টা থেকে রাত ১০টা</p>
            </div>

            <div className="flex space-x-4">
              <button className="bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700 transition shadow-md">
                Get Directions
              </button>
              <button className="bg-blue-600 text-white w-12 h-12 rounded flex items-center justify-center hover:bg-blue-700 transition shadow-md">
                <i className="fa-brands fa-facebook-f"></i>
              </button>
              <button className="bg-green-500 text-white w-12 h-12 rounded flex items-center justify-center hover:bg-green-600 transition shadow-md">
                <i className="fa-brands fa-whatsapp"></i>
              </button>
              <button className="bg-red-600 text-white w-12 h-12 rounded flex items-center justify-center hover:bg-red-700 transition shadow-md">
                <i className="fa-solid fa-phone"></i>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
