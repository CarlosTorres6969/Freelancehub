"use client"

import { useEffect } from "react"
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext"

export default function TrackRecentlyViewed({
  serviceId,
  title,
  category,
  price,
}: {
  serviceId: string
  title: string
  category: string
  price: number
}) {
  const { addItem } = useRecentlyViewed()

  useEffect(() => {
    addItem({ serviceId, title, category, price })
  }, [serviceId, title, category, price, addItem])

  return null
}
