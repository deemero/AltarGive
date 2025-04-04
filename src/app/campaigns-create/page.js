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

    const { data, error } = await supabase.from('campaigns').insert([
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
        router.push('/') // atau /admin/dashboard kalau mahu
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen p-6 text-white bg-black">
      <h1 className="text-3xl font-bold mb-6">📢 Create New Campaign</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Campaign Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 bg-gray-800 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 bg-gray-800 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        />
        <input
          type="number"
          placeholder="Target Amount (RM)"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
          className="w-full p-2 bg-gray-800 rounded"
        />
        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
        >
          Create Campaign
        </button>
      </form>
    </div>
  )
}
