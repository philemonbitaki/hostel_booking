'use client';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import FeedbackDisplay from '../../components/FeedbackDisplay';
import StarRating from '../../components/StarRating';
import FixedHeader from '../../components/FixedHeader';
import { useState } from 'react';

export default function PrivateHostels() {
  const [hostels, setHostels] = useState([
    { id: 1, name: "New generation", location: "Private Hostel Area", price: 32, rating: 4.7, availableRooms: 6, image: "/hostels/new-generation.jpg" },
    { id: 2, name: "Annex", location: "Private Hostel Area", price: 25, rating: 4.6, availableRooms: 10, image: "/hostels/annex.jpg" },
    { id: 3, name: "Hundreb", location: "Private Hostel Area", price: 28, rating: 4.7, availableRooms: 4, image: "/hostels/hundreb.jpg" },
  ]);

  const handleRatingChange = (hostelId: number, newRating: number) => {
    setHostels(prevHostels => 
      prevHostels.map(hostel => 
        hostel.id === hostelId 
          ? { ...hostel, rating: newRating }
          : hostel
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#0a1628]">
      <Navbar />
      <FixedHeader />
      <div className="pt-48 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">🏠 Private Hostels</h1>
        <p className="text-white/60 mb-8">Comfortable private accommodations for everyone</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((h) => (
            <div key={h.id} className="bg-white rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={h.image} 
                  alt={`${h.name} hostel`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-[#0a1628] mb-2">{h.name}</h3>
                <p className="text-gray-500 text-sm mb-3">📍 {h.location}</p>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Private</span>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <StarRating 
                      rating={h.rating} 
                      onRatingChange={(newRating) => handleRatingChange(h.id, newRating)}
                      size="sm"
                    />
                    <div className="text-lg font-bold text-[#0a1628]">UGX {h.price}<span className="text-sm text-gray-400">/night</span></div>
                  </div>
                  <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">🛏️</span>
                      <span className="text-sm font-medium text-green-800">Available Rooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          if (h.availableRooms > 0) {
                            setHostels(prevHostels => 
                              prevHostels.map(hostel => 
                                hostel.id === h.id 
                                  ? { ...hostel, availableRooms: hostel.availableRooms - 1 }
                                  : hostel
                              )
                            );
                            alert(`Room booked at ${h.name}! Remaining rooms: ${h.availableRooms - 1}`);
                          }
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={h.availableRooms === 0}
                      >
                        Book Room
                      </button>
                      <span className="text-lg font-bold text-green-700">{h.availableRooms}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">📞</span>
                      <span className="text-sm font-medium text-blue-800">Contact</span>
                    </div>
                    <span className="text-sm font-bold text-blue-700">+256 766615340</span>
                  </div>
                </div>
                <Link href="/booking" className="w-full bg-[#0a1628] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-400 hover:text-black transition-all inline-block text-center">
                  Book Now
                </Link>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-lg text-[#0a1628] mb-2">📍 Find {h.name} on Google Maps</h4>
                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.217934717023!2d32.716667!3d-0.583333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1774e3b9b9b9b9b9%3A0x123456789abcdef0!2s${encodeURIComponent(h.name)}%2C%20Bugema%2C%20Uganda!5e0!3m2!1sen!2s!4v1715000000000!5m2!1sen!2s`} 
                    width="100%"
                    height="100%"
                    style={{ border: '0' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Google Maps location for ${h.name}`}
                  ></iframe>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Guest Reviews</h2>
          <FeedbackDisplay roomId="private" showForm={true} />
        </div>
      </div>
    </main>
  );
}