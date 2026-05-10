'use client';
import { useState } from 'react';
import { Feedback, CreateFeedbackData } from '../types/database';
import { createFeedback } from '../lib/database';

interface FeedbackFormProps {
  roomId?: string;
  bookingId?: string;
  onSubmit?: (feedback: CreateFeedbackData) => void;
  onCancel?: () => void;
}

export default function FeedbackForm({ roomId, bookingId, onSubmit, onCancel }: FeedbackFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please add a comment');
      return;
    }
    setLoading(true);
    setError('');
    const feedback: CreateFeedbackData = {
      room_id: roomId,
      booking_id: bookingId,
      rating,
      comment: comment.trim()
    };
    try {
      const { error } = await createFeedback(feedback);
      if (error) throw error;
    } catch (err) {
      const existingFeedback = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      existingFeedback.push({
        id: `feedback-${Date.now()}`,
        ...feedback,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      localStorage.setItem('feedbacks', JSON.stringify(existingFeedback));
    }
    if (onSubmit) onSubmit(feedback);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      setRating(5);
      if (onCancel) onCancel();
    }, 2000);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <span className="text-2xl mr-2">✅</span>
          <span>Thank you for your feedback!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Leave Your Feedback</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-3xl transition-transform hover:scale-110 focus:outline-none"
              >
                <span className={star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'}>
                  ⭐
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">{rating} out of 5 stars</p>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400 resize-none text-gray-900 bg-white"
            style={{ color: '#111827' }}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#0a1628] text-white py-2 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
