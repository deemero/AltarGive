'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function CreateEvent() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [mode, setMode] = useState('Online')
  const [imageFile, setImageFile] = useState(null)

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    let imageUrl = ''

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        alert('Image upload error: ' + uploadError.message)
        return
      }

      imageUrl = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName).data.publicUrl
    }

    const { error } = await supabase.from('events').insert({
      title,
      description,
      event_date: eventDate,
      location,
      category,
      mode,
      image_url: imageUrl,
    })

    if (!error) {
      alert('Event berjaya ditambah!')
      router.push('/admin/events')
    } else {
      alert('Ralat: ' + error.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Nama Event"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400"
          />

          <textarea
            required
            placeholder="Deskripsi Event"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400 h-28"
          />

          <input
            required
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full bg-gray-100 rounded-md px-4 py-3"
          />

          <input
            required
            placeholder="Lokasi"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400"
          />

          <input
            required
            placeholder="Kategori Event"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400"
          />

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-gray-100 rounded-md px-4 py-3 text-gray-700"
          >
            <option>Online</option>
            <option>Face-to-Face</option>
          </select>

          <input
            required
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full bg-gray-100 rounded-md px-4 py-3 text-gray-700"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-3 rounded-lg"
          >
            Tambah Event
          </button>
        </form>
      </div>
    </div>
  )
}