'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function EditEventPage() {
  const { id } = useParams()
  const router = useRouter()
  const [eventData, setEventData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvent()
  }, [])

  async function fetchEvent() {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
    if (error) {
      alert('Event tidak dijumpai')
      router.push('/admin/events')
    } else {
      setEventData(data)
    }
    setLoading(false)
  }

  async function handleUpdate(e) {
    e.preventDefault()
    const { error } = await supabase.from('events').update(eventData).eq('id', id)
    if (!error) {
      alert('Event berjaya dikemaskini')
      router.push('/admin/events')
    } else {
      alert('Ralat: ' + error.message)
    }
  }

  async function handleDelete() {
    if (confirm('Pasti mahu padam event ini?')) {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (!error) {
        alert('Event berjaya dipadam')
        router.push('/admin/events')
      } else {
        alert('Gagal padam: ' + error.message)
      }
    }
  }

  if (loading) return <p className="text-center py-10">Loading...</p>
  if (!eventData) return null

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Event</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            required
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            className="w-full bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400"
          />

          <textarea
            required
            value={eventData.description || ''}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            className="w-full bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400 h-28"
          />

          <input
            required
            type="date"
            value={eventData.event_date}
            onChange={(e) => setEventData({ ...eventData, event_date: e.target.value })}
            className="w-full bg-gray-100 rounded-md px-4 py-3 text-gray-700"
          />

          <input
            required
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            className="w-full bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400"
          />

          <input
            required
            value={eventData.category}
            onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
            className="w-full bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400"
          />

          <select
            value={eventData.mode}
            onChange={(e) => setEventData({ ...eventData, mode: e.target.value })}
            className="w-full bg-gray-100 rounded-md px-4 py-3 text-gray-700"
          >
            <option>Online</option>
            <option>Face-to-Face</option>
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-3 rounded-lg"
            >
              Padam Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
