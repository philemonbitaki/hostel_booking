'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAvailableRooms, createRoom, updateRoom, deleteRoom } from '../../lib/database';
import { Room, CreateRoomData } from '../../types/database';
import AdminProtection from '../components/AdminProtection';

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const { data, error } = await getAvailableRooms();
        if (error) {
          setError(`Failed to load rooms: ${error.message}`);
        } else {
          setRooms(data || []);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const roomData: CreateRoomData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      capacity: parseInt(formData.get('capacity') as string),
      price_per_night: parseFloat(formData.get('price_per_night') as string),
      image_url: formData.get('image_url') as string || undefined,
    };

    try {
      if (editingRoom) {
        // Update existing room
        const { data, error } = await updateRoom(editingRoom.id, roomData);
        if (error) {
          setError(`Failed to update room: ${error.message}`);
        } else {
          setRooms(rooms.map(room => room.id === editingRoom.id ? data! : room));
          setEditingRoom(null);
          setShowAddForm(false);
        }
      } else {
        // Create new room
        const { data, error } = await createRoom(roomData);
        if (error) {
          setError(`Failed to create room: ${error.message}`);
        } else {
          setRooms([...rooms, data!]);
          setShowAddForm(false);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    try {
      const { error } = await deleteRoom(roomId);
      if (error) {
        setError(`Failed to delete room: ${error.message}`);
      } else {
        setRooms(rooms.filter(room => room.id !== roomId));
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Loading rooms...</div>
      </main>
    );
  }

  return (
    <AdminProtection>
      <main className="min-h-screen bg-[#0a1628]">
        <div className="pt-24 px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🏨 Manage Rooms</h1>
              <p className="text-white/60">Update room information and availability</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditingRoom(null);
                }}
                className="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-all"
              >
                + Add Room
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="bg-white text-[#0a1628] px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Add/Edit Room Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingRoom?.name}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      defaultValue={editingRoom?.capacity}
                      min="1"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night</label>
                    <input
                      type="number"
                      name="price_per_night"
                      defaultValue={editingRoom?.price_per_night}
                      min="0"
                      step="0.01"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                    <input
                      type="url"
                      name="image_url"
                      defaultValue={editingRoom?.image_url}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingRoom?.description}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingRoom(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0a1628] text-white rounded-lg hover:bg-yellow-400 hover:text-black transition-all"
                  >
                    {editingRoom ? 'Update Room' : 'Create Room'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                {room.image_url && (
                  <img
                    src={room.image_url}
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {room.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{room.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Capacity:</span> {room.capacity} guests
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ${room.price_per_night}/night
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No rooms found</div>
              <div className="text-gray-400 text-sm mt-2">Add your first room to get started.</div>
            </div>
          )}
        </div>
      </main>
    </AdminProtection>
  );
}
