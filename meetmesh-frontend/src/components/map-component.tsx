import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

// Create a custom user icon
const createUserIcon = (user: any, isCurrentUser: boolean) => {
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-500",
  }

  const statusColor = statusColors[user.status as keyof typeof statusColors] || "bg-gray-500"
  const borderColor = isCurrentUser ? "border-primary" : "border-red-400"

  const iconHtml = `
    <div class="relative">
      <div class="rounded-full h-10 w-10 overflow-hidden border-2 ${borderColor}">
        <img src="${user.profile_image}" alt="${user.name}" class="aspect-square object-cover" />
      </div>
      <span class="absolute bottom-0 right-0 w-3 h-3 ${statusColor} border-2 border-white rounded-full"></span>
      ${isCurrentUser ? '<div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-primary text-white px-1 rounded">You</div>' : ""}
    </div>
  `

  return L.divIcon({
    html: iconHtml,
    className: "user-marker",
    iconSize: [60, 60],
    iconAnchor: [40, 40],
  })
}

interface MapComponentProps {
  users: any[]
  onUserClick: (user: any) => void
  currentUser: any
}

export default function MapComponent({users, onUserClick, currentUser}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: number]: L.Marker }>({})

  useEffect(() => {
    fixLeafletIcon()

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([5.000, 7.837672], 15)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 8,
      }).addTo(mapRef.current)
    }

    // Clean up function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers when users data changes
  useEffect(() => {
    if (!mapRef.current || !users.length) return

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      marker.remove()
    })
    markersRef.current = {}

    const coordCount: Record<string, number> = {};

    // Add new markers
    users.forEach((user) => {
      const isCurrentUser = user.id === currentUser?.id

      const lat = isCurrentUser ? user.lat : user.location.latitude;
      const lng = isCurrentUser ? user.lng : user.location.longitude;

      const key = `${lat},${lng}`;
      coordCount[key] = (coordCount[key] || 0) + 1;
      const count = coordCount[key];

      // Offset calculation (simple circular spread)
      const offsetLat = lat + 0.00005 * Math.cos((count - 1) * 2 * Math.PI / 10);
      const offsetLng = lng + 0.00005 * Math.sin((count - 1) * 2 * Math.PI / 10);

      const icon = createUserIcon(user, isCurrentUser)

      // Skip adding click handler for current user
      if (!isCurrentUser) {
        const marker = L.marker([offsetLat, offsetLng], { icon })
          .addTo(mapRef.current!)
          .bindTooltip(user.fullname)
          .on("click", () => {
            onUserClick(user)
          })

        markersRef.current[user.id] = marker
      } else {
        // Just add the marker without click handler for current user
        const marker = L.marker([user.lat, user.lng], { icon }).addTo(mapRef.current!).bindTooltip(`${user.name} (You)`)

        markersRef.current[user.id] = marker
      }
    })
  }, [])

  return <div id="map" className="h-[100vh] w-full z-0" />
}

