import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvent()
  }, [id])

  async function fetchEvent() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching event:', err)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  function formatTime(timeString) {
    if (!timeString) return null
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading event...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Event Not Found</h3>
        <p className="text-red-600 mb-4">{error || 'This event does not exist.'}</p>
        <Link 
          to="/"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Back to Events
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        ← Back to Events
      </Link>

      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-800">{event.name}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            event.status === 'live' ? 'bg-green-100 text-green-800' :
            event.status === 'planned' ? 'bg-blue-100 text-blue-800' :
            event.status === 'completed' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {event.status}
          </span>
        </div>

        {event.event_code && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Event Code</p>
            <p className="text-2xl font-mono font-bold text-blue-600">{event.event_code}</p>
          </div>
        )}

        {/* Event Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">📅 Date & Time</h3>
            <p className="text-gray-600">{formatDate(event.date)}</p>
            {event.start_time && (
              <p className="text-gray-600">
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">📍 Location</h3>
            <p className="text-gray-600">{event.location_name}</p>
            <p className="text-gray-600">{event.city}, {event.state} {event.postcode}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">👥 Divisions</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(event.divisions) && event.divisions.map((division, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {division}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">⚙️ Recording Mode</h3>
            <p className="text-gray-600 capitalize">{event.recording_mode || 'Not set'}</p>
          </div>

          {event.max_entrants && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">👤 Max Entrants</h3>
              <p className="text-gray-600">{event.max_entrants}</p>
            </div>
          )}

          {event.entry_fee_cents > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">💰 Entry Fee</h3>
              <p className="text-gray-600">${(event.entry_fee_cents / 100).toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Prize Categories */}
        {event.prize_categories && Array.isArray(event.prize_categories) && event.prize_categories.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">🏆 Prize Categories</h3>
            <div className="space-y-2">
              {event.prize_categories.map((category, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-gray-600">{category.criteria}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {event.registration_deadline && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-600">Registration closes</p>
            <p className="font-semibold text-gray-800">
              {new Date(event.registration_deadline).toLocaleString('en-AU')}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4">
        <button className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 font-semibold">
          Register for Event
        </button>
        <button className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 font-semibold">
          View Leaderboard
        </button>
      </div>

      <p className="text-center text-gray-500 text-sm mt-6">
        Registration and leaderboard features coming in Session 2-3
      </p>
    </div>
  )
}
