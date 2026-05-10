'use client';
import Navbar from '../components/Navbar';
import FixedHeader from '../components/FixedHeader';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2332] pt-24 px-6">
      <Navbar />
      <FixedHeader />
      <div className="max-w-4xl mx-auto pt-48 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600 mb-8">Contact us for any questions or assistance.</p>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">📧</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-lg">philemonbitaki702@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-xl">📞</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Main Phone</h3>
                <p className="text-gray-600 text-lg">+256 766615673</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">🎓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">University Hostels</h3>
                <p className="text-gray-600 text-lg">📞 Contact: 0766632458</p>
                <p className="text-gray-600 text-sm">Clifford, Bensdonf, Mukasa</p>
                <p className="text-gray-600 text-sm">University Campus Location</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-xl">🏠</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Private Hostels</h3>
                <p className="text-gray-600 text-lg">📞 Contact: +256 766615340</p>
                <p className="text-gray-600 text-sm">New Generation, Annex, Hundreb</p>
                <p className="text-gray-600 text-sm">Private Hostel Area</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-xl">📍</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600 text-lg">Bugema<br />Uganda</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Find Us on Google Maps</h3>
              <div className="relative w-full h-96 rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.217934717023!2d32.716667!3d-0.583333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1774e3b9b9b9b9b9%3A0x123456789abcdef0!2sBugema%2C%20Uganda!5e0!3m2!1sen!2s!4v1715000000000!5m2!1sen!2s" 
                  width="100%"
                  height="100%"
                  style={{ border: '0' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps location"
                ></iframe>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
              <div className="flex flex-wrap gap-4">
                <a href="/" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Home</a>
                <a href="/booking" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Book Now</a>
                <a href="/admin" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Admin</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}