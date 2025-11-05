'use client'

import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format } from 'date-fns'
import axios from 'axios'
import toast from 'react-hot-toast'

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingCalendarProps {
  serviceId: string
  onBookingComplete?: () => void
}

export function BookingCalendar({ serviceId, onBookingComplete }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 9
    const endHour = 18
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({ time, available: true })
      }
    }
    return slots
  }

  useEffect(() => {
    if (selectedDate) {
      // In production, fetch actual availability from API
      setTimeSlots(generateTimeSlots())
    }
  }, [selectedDate])

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time')
      return
    }

    setLoading(true)
    try {
      const dateTime = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(':')
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0)

      await axios.post('/api/appointments', {
        serviceId,
        dateTime: dateTime.toISOString(),
        notes,
      })

      toast.success('Appointment booked successfully!')
      setSelectedDate(null)
      setSelectedTime(null)
      setNotes('')
      onBookingComplete?.()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  const minDate = new Date()
  minDate.setHours(0, 0, 0, 0)

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Book Appointment</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Select Date</h3>
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            minDate={minDate}
            className="w-full"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-3">Select Time</h3>
          {selectedDate ? (
            <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-2 rounded ${
                    selectedTime === slot.time
                      ? 'bg-primary-600 text-white'
                      : slot.available
                      ? 'bg-gray-100 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Please select a date first</p>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Any special requests or notes..."
            />
          </div>

          <button
            onClick={handleBooking}
            disabled={loading || !selectedDate || !selectedTime}
            className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  )
}

