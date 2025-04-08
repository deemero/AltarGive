'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // tambah loading state
  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true) // mula loading

    setTimeout(() => { // supaya nampak loading spinner sekejap
      const hardcodedUsername = 'adminaltar'
      const hardcodedPassword = 'revival2025'

      if (username === hardcodedUsername && password === hardcodedPassword) {
        localStorage.setItem('isAdmin', 'true')
        router.push('/admin/dashboard')
      } else {
        setError('Invalid credentials')
        setLoading(false)
      }
    }, 1500) // 1.5 saat loading
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 px-4 py-8">
      <form
        onSubmit={handleLogin}
        className="bg-gradient-to-b from-white to-gray-100 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-600 bg-red-100 p-2 rounded text-center">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded-full bg-gray-200 border border-gray-300 placeholder-gray-500 outline-none text-gray-900 shadow-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-full bg-gray-200 border border-gray-300 placeholder-gray-500 outline-none text-gray-900 shadow-sm"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 transition duration-300 py-3 px-6 rounded-full text-white font-semibold shadow-lg ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
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
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  )
}
