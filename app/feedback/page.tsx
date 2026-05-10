'use client';
import Navbar from '../components/Navbar';
import FeedbackDisplay from '../components/FeedbackDisplay';
import FeedbackForm from '../components/FeedbackForm';
import { useState } from 'react';

export default function FeedbackPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a1628]">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">⭐ Customer Reviews</h1>
          <p className="text-white/60">See what our guests are saying about their experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback List */}
          <div className="lg:col-span-2">
            <FeedbackDisplay showForm={true} />
          </div>

          {/* Quick Feedback Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Experience</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Help us improve by sharing your feedback about your stay.
              </p>
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full bg-[#0a1628] text-white py-3 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-all"
              >
                {showForm ? 'Close Form' : 'Write a Review'}
              </button>

              {showForm && (
                <div className="mt-4">
                  <FeedbackForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
