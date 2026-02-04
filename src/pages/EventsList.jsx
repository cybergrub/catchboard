import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function EventsList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching events:', err)
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

  function getStatusColor(status) {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      planned: 'bg-blue-100 text-blue-800',
      live: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || colors.draft
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading events...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Events</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchEvents}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎣</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Events Yet</h2>
        <p className="text-gray-600 mb-6">Create your first fishing competition to get started!</p>
        <Link 
          to="/create"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Create Event
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Fishing Competitions</h1>
        <Link 
          to="/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          + New Event
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/event/${event.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">{event.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>

            <div className="space-y-2 text-gray-600">
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                <span>{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>{event.location_name}, {event.state}</span>
              </div>

              {event.event_code && (
                <div className="flex items-center">
                  <span className="mr-2">🔑</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {event.event_code}
                  </span>
                </div>
              )}

              <div className="flex items-center">
                <span className="mr-2">👥</span>
                <span>
                  {Array.isArray(event.divisions) 
                    ? event.divisions.join(', ') 
                    : 'No divisions set'}
                </span>
              </div>

              {event.recording_mode && (
                <div className="flex items-center text-sm">
                  <span className="mr-2">⚙️</span>
                  <span className="capitalize">{event.recording_mode} mode</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-semibold hover:underline">
                View Details →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
