'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CreateCampaign() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('campaigns').insert([
      {
        title,
        description,
        image_url: imageUrl,
        target_amount: parseFloat(targetAmount),
        current_amount: 0,
        start_date: startDate,
        end_date: endDate,
      },
    ])

    if (error) {
      setError(error.message)
      setSuccess('')
    } else {
      setSuccess('Campaign created successfully!')
      setError('')
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">📢 Create New Campaign</h1>

        {error && <p className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>}
        {success && <p className="text-green-600 bg-green-100 p-2 rounded mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Campaign Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 rounded-xl placeholder-gray-500 border border-gray-200 outline-none"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 rounded-xl placeholder-gray-500 border border-gray-200 outline-none resize-none"
            rows="4"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 bg-gray-100 rounded-xl placeholder-gray-500 border border-gray-200 outline-none"
          />
          <input
            type="number"
            placeholder="Target Amount (RM)"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 rounded-xl placeholder-gray-500 border border-gray-200 outline-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full p-3 bg-gray-100 rounded-xl placeholder-gray-500 border border-gray-200 outline-none"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full p-3 bg-gray-100 rounded-xl placeholder-gray-500 border border-gray-200 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            Create Campaign
          </button>
        </form>
      </div>
    </div>
  )
}
