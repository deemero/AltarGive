// app/admin/events/page.js
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const router = useRouter()

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) router.push('/admin-login')
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true })
    setEvents(data)
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin: Senarai Event</h1>
        <Link href="/admin/create-event" className="bg-green-600 text-white px-4 py-2 rounded">
          + Tambah Event
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {events.map((e) => (
          <div key={e.id} className="p-4 bg-white shadow rounded">
            {e.image_url && (
              <Image
                src={e.image_url}
                alt={e.title}
                width={400}
                height={250}
                className="rounded mb-2 object-cover w-full h-48"
              />
            )}
            <h3 className="font-bold text-lg">{e.title}</h3>
            <p className="text-sm text-gray-600">{e.event_date}</p>
            <p className="text-sm text-gray-600">{e.location}</p>
            <p className="text-sm text-green-600 font-medium">{e.mode}</p>
            <div className="mt-4 flex justify-between">
              <Link
                href={`/admin/edit-event/${e.id}`}
                className="text-yellow-500 hover:underline"
              >
                ✏️ Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}