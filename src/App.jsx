import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import EventsList from './pages/EventsList'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold">
                🎣 Catchboard
              </Link>
              <nav className="space-x-4">
                <Link to="/" className="hover:underline">
                  Events
                </Link>
                <Link to="/create" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
                  Create Event
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<EventsList />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/create" element={<CreateEvent />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-16">
          <div className="container mx-auto px-4 py-6 text-center">
            <p>Catchboard - Fishing Competition Management for Australia</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
