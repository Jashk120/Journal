"use client"
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { options } from '../../../const/pairs'

function DashboardContent() {
  const [trades, setTrades] = useState([])
  const [selectedOption, setSelectedOption] = useState("This Week");

  useEffect(() => {
    // Fetch trades data for the current user
    fetch('/api/trades/user-trades')
      .then((res) => res.json())
      .then((data) => setTrades(data.trades)) 
      .catch((error) => console.error('Error fetching trades:', error))
  }, [])

  return (
    <div className='border-none h-full w-full'>
     
   
    </div>
  )
}

export default DashboardContent
