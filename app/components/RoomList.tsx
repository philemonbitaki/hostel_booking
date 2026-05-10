'use client';
import { useState, useEffect } from 'react';
import { Room } from '../types/database';
import { getAvailableRooms } from '../lib/database';
import Link from 'next/link';

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await getAvailableRooms();
      
      if (error) {
        setError('Failed to load rooms: ' + error.message);
      } else {
        setRooms(data || []);
      }
      
      setLoading(false);
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-white">Loading rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-white mb-2">No rooms available</h3>
        <p className="text-white/60">Check back later for available rooms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div key={room.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          {/* Room Image Placeholder */}
          <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <div className="text-white text-6xl">🏠</div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
            
            {room.description && (
              <p className="text-gray-600 text-sm mb-4">{room.description}</p>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-500">
                <span className="text-lg mr-1">👥</span>
                <span className="text-sm">{room.capacity} guests</span>
              </div>
              
              <div className="text-2xl font-bold text-green-600">
                ${room.price_per_night}
                <span className="text-sm text-gray-500 font-normal">/night</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                room.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {room.available ? 'Available' : 'Occupied'}
              </div>
              
              <Link 
                href={`/booking?roomId=${room.id}`}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  room.available
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!room.available) {
                    e.preventDefault();
                  }
                }}
              >
                {room.available ? 'Book Now' : 'Unavailable'}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
