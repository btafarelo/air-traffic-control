// Utility functions for radar calculations and formatting
window.RadarUtils = {
  // Calculate distance between two lat/lon points in kilometers
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  },

  // Convert radians to degrees
  toDegrees(radians) {
    return radians * (180 / Math.PI)
  },

  // Convert lat/lon to canvas coordinates
  latLonToCanvas(lat, lon, centerLat, centerLon, canvasSize, rangeKm) {
    const distance = this.calculateDistance(centerLat, centerLon, lat, lon)
    const bearing = this.calculateBearing(centerLat, centerLon, lat, lon)

    const radius = Math.min(canvasSize, canvasSize) / 2 - 10
    const scale = radius / rangeKm

    const x = canvasSize / 2 + distance * scale * Math.sin(this.toRadians(bearing))
    const y = canvasSize / 2 - distance * scale * Math.cos(this.toRadians(bearing))

    return {
      x: x,
      y: y,
      distance: distance,
      bearing: bearing,
    }
  },

  // Calculate bearing between two points
  calculateBearing(lat1, lon1, lat2, lon2) {
    const dLon = this.toRadians(lon2 - lon1)
    const lat1Rad = this.toRadians(lat1)
    const lat2Rad = this.toRadians(lat2)

    const y = Math.sin(dLon) * Math.cos(lat2Rad)
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon)

    const bearing = this.toDegrees(Math.atan2(y, x))
    return (bearing + 360) % 360
  },

  // Format distance for display
  formatDistance(distance) {
    if (!distance && distance !== 0) return "N/A"
    return distance.toFixed(1) + " km"
  },

  // Format altitude for display
  formatAltitude(altitude) {
    if (!altitude && altitude !== 0) return "N/A"
    return Math.round(altitude) + " ft"
  },

  // Format speed for display
  formatSpeed(speed) {
    if (!speed && speed !== 0) return "N/A"
    return Math.round(speed) + " kts"
  },

  // Format coordinates for display
  formatCoordinates(lat, lon) {
    if (!lat || !lon) return "N/A"
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`
  },

  // Debounce function for search input
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Check if point is within radar range
  isWithinRange(lat, lon, centerLat, centerLon, maxRange) {
    const distance = this.calculateDistance(centerLat, centerLon, lat, lon)
    return distance <= maxRange
  },

  // Generate random flight data for testing
  generateTestFlight(callsign) {
    const centerLat = window.RADAR_CONFIG.GENEVA_LAT
    const centerLon = window.RADAR_CONFIG.GENEVA_LON
    const maxRange = window.RADAR_CONFIG.MAX_RANGE_KM

    // Generate random position within radar range
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * maxRange * 0.8 // Keep within 80% of max range

    const lat = centerLat + (distance / 111) * Math.cos(angle) // Rough conversion
    const lon = centerLon + (distance / (111 * Math.cos(this.toRadians(centerLat)))) * Math.sin(angle)

    return {
      callsign: callsign,
      latitude: lat,
      longitude: lon,
      altitude: Math.random() * 40000 + 5000, // 5,000 to 45,000 feet
      speed: Math.random() * 500 + 200, // 200 to 700 knots
      heading: Math.random() * 360, // 0 to 360 degrees
      aircraftType: ["B737", "A320", "B777", "A330", "E190"][Math.floor(Math.random() * 5)],
      origin: ["GVA", "ZUR", "CDG", "LHR", "FRA"][Math.floor(Math.random() * 5)],
      destination: ["BCN", "FCO", "VIE", "AMS", "CPH"][Math.floor(Math.random() * 5)],
      timestamp: Date.now(),
    }
  },

  // Validate flight data
  isValidFlightData(flightData) {
    return (
      flightData &&
      typeof flightData === "object" &&
      flightData.callsign &&
      typeof flightData.latitude === "number" &&
      typeof flightData.longitude === "number" &&
      !isNaN(flightData.latitude) &&
      !isNaN(flightData.longitude) &&
      Math.abs(flightData.latitude) <= 90 &&
      Math.abs(flightData.longitude) <= 180
    )
  },

  // Format timestamp for display
  formatTimestamp(timestamp) {
    if (!timestamp) return "N/A"
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  },

  // Calculate time difference in human readable format
  getTimeDifference(timestamp) {
    if (!timestamp) return "N/A"
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m ago`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s ago`
    return `${seconds}s ago`
  },
}
