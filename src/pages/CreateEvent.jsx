import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CreateEvent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    location_name: '',
    postcode: '',
    city: '',
    state: 'VIC',
    date: '',
    start_time: '00:00',
    end_time: '00:00',
    recording_mode: 'entrant',
    divisions: ['Open', 'Junior'],
    max_entrants: '',
    entry_fee_dollars: '0',
    status: 'draft'
  })

  function generateEventCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Generate unique event code
      const event_code = generateEventCode()

      // Prepare data - convert dollars to cents
      const eventData = {
        name: formData.name,
        location_name: formData.location_name,
        postcode: formData.postcode,
        city: formData.city,
        state: formData.state,
        date: formData.date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        recording_mode: formData.recording_mode,
        divisions: formData.divisions,
        event_code,
        entry_fee_cents: Math.round(parseFloat(formData.entry_fee_dollars || 0) * 100),
        max_entrants: formData.max_entrants ? parseInt(formData.max_entrants) : null,
        prize_categories: [],
        organiser_id: null,
        status: formData.status
      }

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single()

      if (error) throw error

      // Success - redirect to event detail
      navigate(`/event/${data.id}`)
    } catch (err) {
      setError(err.message)
      console.error('Error creating event:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleDivisionToggle(division) {
    setFormData(prev => {
      const divisions = prev.divisions.includes(division)
        ? prev.divisions.filter(d => d !== division)
        : [...prev.divisions, division]
      return { ...prev, divisions }
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Event</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Beulah Fishing Competition 2026"
          />
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location Name *
            </label>
            <input
              type="text"
              name="location_name"
              value={formData.location_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Lake Lonsdale"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Beulah"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State *
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="VIC">Victoria</option>
              <option value="QLD">Queensland</option>
              <option value="NSW">New South Wales</option>
              <option value="SA">South Australia</option>
              <option value="WA">Western Australia</option>
              <option value="TAS">Tasmania</option>
              <option value="NT">Northern Territory</option>
              <option value="ACT">Australian Capital Territory</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Postcode *
            </label>
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 3395"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Recording Mode - NEW */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Recording Mode *
          </label>
          <div className="space-y-3">
            <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: formData.recording_mode === 'entrant' ? '#2563eb' : '#d1d5db' }}
            >
              <input
                type="radio"
                name="recording_mode"
                value="entrant"
                checked={formData.recording_mode === 'entrant'}
                onChange={handleChange}
                className="mt-1 mr-3"
              />
              <div>
                <p className="font-semibold text-gray-800">Entrant Mode</p>
                <p className="text-sm text-gray-600">Entrants submit their own catches with photos</p>
              </div>
            </label>

            <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: formData.recording_mode === 'judge' ? '#2563eb' : '#d1d5db' }}
            >
              <input
                type="radio"
                name="recording_mode"
                value="judge"
                checked={formData.recording_mode === 'judge'}
                onChange={handleChange}
                className="mt-1 mr-3"
              />
              <div>
                <p className="font-semibold text-gray-800">Judge Mode</p>
                <p className="text-sm text-gray-600">Only judges/organizers can submit catches</p>
              </div>
            </label>
          </div>
        </div>

        {/* Divisions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Divisions *
          </label>
          <div className="flex flex-wrap gap-3">
            {['Open', 'Junior'].map(division => (
              <label key={division} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.divisions.includes(division)}
                  onChange={() => handleDivisionToggle(division)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{division}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Select at least one division</p>
        </div>

        {/* Optional Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Entrants
            </label>
            <input
              type="number"
              name="max_entrants"
              value={formData.max_entrants}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank for unlimited"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Entry Fee ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-600">$</span>
              <input
                type="number"
                name="entry_fee_dollars"
                value={formData.entry_fee_dollars}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave as $0 for free entry
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || formData.divisions.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  )
}
