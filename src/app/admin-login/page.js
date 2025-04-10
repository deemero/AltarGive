'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    setTimeout(() => {
      const hardcodedUsername = 'adminaltar'
      const hardcodedPassword = 'revival2025'

      if (username === hardcodedUsername && password === hardcodedPassword) {
        localStorage.setItem('isAdmin', 'true')
        router.push('/admin/dashboard')
      } else {
        setMessage('Invalid admin credentials.')
        setMessageType('error')
        setLoading(false)
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left - Admin Form */}
        <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Logo & Title */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">AltarGive Admin</h1>
            </div>
            <p className="text-sm text-center text-gray-500 mb-6">
              Admin panel login — authorized access only.
            </p>

            {/* Notification */}
            {message && (
              <div
                className={`text-sm text-center mb-4 px-4 py-2 rounded ${
                  messageType === 'error'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-purple-700 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  'Login as Admin'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right - Gradient Info Side */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-800 to-pink-600 hidden md:flex items-center justify-center text-center px-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">
              Welcome Admin
            </h1>
            <p className="text-lg text-purple-100 font-medium leading-relaxed">
              You are entering a secure area. <br />
              Please login with authorized credentials only 🛡️
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
