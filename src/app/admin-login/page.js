'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Set sendiri username dan password
    const hardcodedUsername = 'adminaltar'
    const hardcodedPassword = 'revival2025'

    if (username === hardcodedUsername && password === hardcodedPassword) {
      localStorage.setItem('isAdmin', 'true') // Set flag
      router.push('/admin/dashboard') // ✅ redirect ke dashboard lepas login
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">🔐 Admin Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>
  )
}
