'use client';
import { useState, useEffect } from 'react';
import { Feedback } from '../types/database';
import { getFeedbacks, deleteFeedback } from '../lib/database';

interface FeedbackDisplayProps {
  roomId?: string;
  limit?: number;
  showForm?: boolean;
  isAdmin?: boolean;
}

export default function FeedbackDisplay({ roomId, limit = 5, showForm = false, isAdmin = false }: FeedbackDisplayProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, [roomId, limit]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const { data, error } = await getFeedbacks(roomId, limit);
      if (error) {
        console.log('Database error, using localStorage fallback:', error.message);
        // Fallback to localStorage
        const storedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        const filtered = roomId 
          ? storedFeedbacks.filter((f: Feedback) => f.room_id === roomId)
          : storedFeedbacks;
        const sorted = filtered
          .sort((a: Feedback, b: Feedback) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, limit);
        setFeedbacks(sorted);
      } else {
        setFeedbacks(data || []);
      }
    } catch (err) {
      console.log('Error loading feedbacks, using localStorage fallback:', err);
      const storedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      const filtered = roomId 
        ? storedFeedbacks.filter((f: Feedback) => f.room_id === roomId)
        : storedFeedbacks;
      const sorted = filtered
        .sort((a: Feedback, b: Feedback) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
      setFeedbacks(sorted);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return sum / feedbacks.length;
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      const { error } = await deleteFeedback(feedbackId);
      if (error) throw error;
      // Remove from localStorage as well
      const storedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      const updated = storedFeedbacks.filter((f: Feedback) => f.id !== feedbackId);
      localStorage.setItem('feedbacks', JSON.stringify(updated));
      // Reload feedbacks
      loadFeedbacks();
    } catch (err) {
      console.error('Error deleting feedback:', err);
      // Fallback to localStorage deletion
      const storedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      const updated = storedFeedbacks.filter((f: Feedback) => f.id !== feedbackId);
      localStorage.setItem('feedbacks', JSON.stringify(updated));
      loadFeedbacks();
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {feedbacks.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-gray-900">{calculateAverageRating().toFixed(1)}</span>
                <div className="flex">
                  {renderStars(Math.round(calculateAverageRating()))}
                </div>
              </div>
              <p className="text-gray-600 mt-1">{feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button - Always visible when showForm is true */}
      {showForm && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="bg-[#0a1628] text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-all"
          >
            {showFeedbackForm ? 'Close Form' : 'Write a Review'}
          </button>
        </div>
      )}

      {/* Feedback Form */}
      {showForm && showFeedbackForm && (
        <div className="mb-6">
          {/* Import FeedbackForm dynamically to avoid circular dependency */}
          <FeedbackFormWrapper roomId={roomId} onSubmit={() => {
            setShowFeedbackForm(false);
            loadFeedbacks();
          }} />
        </div>
      )}

      {/* Feedback List */}
      {feedbacks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(feedback.rating)}</div>
                  <span className="text-sm text-gray-500">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteFeedback(feedback.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-sm px-2 py-1 rounded hover:bg-red-50 transition-all"
                    title="Delete feedback"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
              <p className="text-gray-700">{feedback.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Wrapper component to avoid circular dependency
function FeedbackFormWrapper({ roomId, onSubmit }: { roomId?: string; onSubmit?: () => void }) {
  const [FeedbackForm, setFeedbackForm] = useState<any>(null);
  
  useEffect(() => {
    import('./FeedbackForm').then((module) => {
      setFeedbackForm(() => module.default);
    });
  }, []);

  if (!FeedbackForm) return <div>Loading form...</div>;
  
  return <FeedbackForm roomId={roomId} onSubmit={onSubmit} />;
}
