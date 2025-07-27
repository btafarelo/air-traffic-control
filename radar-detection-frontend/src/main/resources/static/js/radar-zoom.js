// Zoom and View Control for Radar

const RadarState = {
  currentZoom: 1.0,
  centerLat: 0,
  centerLon: 0,
  canvas: document.createElement("canvas"),
}

const RADAR_CONFIG = {
  ZOOM_STEP: 0.1,
  MAX_ZOOM: 5.0,
  MIN_ZOOM: 0.5,
  RANGE_KM: 100,
}

const RadarUtils = {
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  },
  toDegrees(radians) {
    return radians * (180 / Math.PI)
  },
  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  },
}

const RadarDrawing = {
  render() {
    // Rendering logic here
  },
}

const RadarZoom = {
  // Zoom in
  zoomIn() {
    const newZoom = Math.min(RadarState.currentZoom + RADAR_CONFIG.ZOOM_STEP, RADAR_CONFIG.MAX_ZOOM)
    this.setZoom(newZoom)
  },

  // Zoom out
  zoomOut() {
    const newZoom = Math.max(RadarState.currentZoom - RADAR_CONFIG.ZOOM_STEP, RADAR_CONFIG.MIN_ZOOM)
    this.setZoom(newZoom)
  },

  // Reset zoom to default
  resetZoom() {
    this.setZoom(1.0)
  },

  // Set specific zoom level
  setZoom(zoom) {
    RadarState.currentZoom = RadarUtils.clamp(zoom, RADAR_CONFIG.MIN_ZOOM, RADAR_CONFIG.MAX_ZOOM)
    RadarState.currentRange = RADAR_CONFIG.RANGE_KM / RadarState.currentZoom

    this.updateZoomDisplay()
    RadarDrawing.render()
  },

  // Update zoom level display
  updateZoomDisplay() {
    const zoomElement = document.getElementById("zoomLevel")
    if (zoomElement) {
      zoomElement.textContent = `Zoom: ${RadarState.currentZoom.toFixed(1)}x`
    }

    const rangeElement = document.getElementById("rangeInfo")
    if (rangeElement) {
      rangeElement.textContent = `Range: ${Math.round(RadarState.currentRange)}km`
    }
  },

  // Handle mouse wheel zoom
  handleWheelZoom(event) {
    event.preventDefault()

    const delta = event.deltaY > 0 ? -RADAR_CONFIG.ZOOM_STEP : RADAR_CONFIG.ZOOM_STEP
    const newZoom = RadarState.currentZoom + delta

    this.setZoom(newZoom)
  },

  // Get zoom factor for coordinate calculations
  getZoomFactor() {
    return RadarState.currentZoom
  },

  // Convert screen coordinates to lat/lon (for future click-to-center functionality)
  screenToLatLon(screenX, screenY) {
    const canvas = RadarState.canvas
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const deltaX = screenX - centerX
    const deltaY = screenY - centerY

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const bearing = RadarUtils.toDegrees(Math.atan2(deltaY, deltaX)) + 90

    const distanceKm = (distance / (canvas.width / 2)) * RadarState.currentRange

    // Calculate new lat/lon based on bearing and distance
    const lat1 = RadarUtils.toRadians(RadarState.centerLat)
    const lon1 = RadarUtils.toRadians(RadarState.centerLon)
    const bearingRad = RadarUtils.toRadians(bearing)
    const distanceRad = distanceKm / 6371 // Earth radius in km

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distanceRad) + Math.cos(lat1) * Math.sin(distanceRad) * Math.cos(bearingRad),
    )
    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(distanceRad) * Math.cos(lat1),
        Math.cos(distanceRad) - Math.sin(lat1) * Math.sin(lat2),
      )

    return {
      lat: RadarUtils.toDegrees(lat2),
      lon: RadarUtils.toDegrees(lon2),
    }
  },
}
