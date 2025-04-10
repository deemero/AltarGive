'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link' // ✅ wajib untuk guna <Link>




export default function EditCampaign() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError('Failed to load campaign')
        console.error(error)
      } else {
        setCampaign(data)
        setTitle(data.title)
        setDescription(data.description)
        setTargetAmount(data.target_amount)
        setStartDate(data.start_date)
        setEndDate(data.end_date)
      }
      setLoading(false)
    }

    if (id) fetchCampaign()
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('campaigns').update({
      title,
      description,
      target_amount: parseFloat(targetAmount),
      start_date: startDate,
      end_date: endDate,
    }).eq('id', id)

    if (error) {
      setError('Update failed')
      setSuccess('')
    } else {
      setSuccess('Campaign updated successfully!')
      setError('')
      setTimeout(() => {
        router.push('/admin/campaigns')
      }, 1500)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">✏️ Edit Campaign</h1>
    

        {error && <p className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>}
        {success && <p className="text-green-600 bg-green-100 p-2 rounded mb-4">{success}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Campaign Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 rounded-xl"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 rounded-xl resize-none"
            rows="4"
          />
          <input
            type="number"
            placeholder="Target Amount (RM)"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 rounded-xl"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full p-3 bg-gray-100 rounded-xl"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full p-3 bg-gray-100 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold"
          >
            Update Campaign
          </button>
        </form>
      </div>
    </div>
  )
}
