// Flight route management and display
window.RadarRoutes = {
  routes: new Map(),

  // Load routes from server
  loadRoutes() {
    console.log("Routes disabled by default")
    // Routes are disabled as requested
  },

  // Draw routes (empty function since routes are disabled)
  drawRoutes(ctx, canvas) {
    // Routes are disabled - no drawing
  },

  // Process route data
  processRoutes(routeData) {
    const state = window.RadarState

    if (Array.isArray(routeData)) {
      routeData.forEach((route) => {
        if (route.callsign && route.waypoints) {
          this.routes.set(route.callsign, route)
        }
      })
    }

    console.log(`Loaded ${this.routes.size} flight routes`)
  },

  // Get route for flight
  getRoute(callsign) {
    return this.routes.get(callsign)
  },

  // Show route information
  showRouteInfo(callsign) {
    const state = window.RadarState
    const route = this.getRoute(callsign)
    const routeInfo = state.elements.routeInfo
    const routeDetails = state.elements.routeDetails

    if (!route || !routeInfo || !routeDetails) {
      if (routeInfo) routeInfo.style.display = "none"
      return
    }

    // Show route info panel
    routeInfo.style.display = "block"

    // Build route details HTML
    let html = `
      <div style="font-weight: bold; margin-bottom: 5px;">${callsign}</div>
      <div style="font-size: 8px; color: #888; margin-bottom: 8px;">
        ${route.origin || "Unknown"} → ${route.destination || "Unknown"}
      </div>
    `

    if (route.waypoints && route.waypoints.length > 0) {
      html += '<div style="font-size: 8px;">WAYPOINTS:</div>'
      route.waypoints.forEach((waypoint, index) => {
        const coords = window.RadarUtils.formatCoordinates(waypoint.lat, waypoint.lon)
        html += `
          <div style="font-size: 7px; margin: 2px 0;">
            ${index + 1}. ${waypoint.name || coords}
          </div>
        `
      })
    }

    routeDetails.innerHTML = html
  },

  // Hide route information
  hideRouteInfo() {
    const routeInfo = window.RadarState.elements.routeInfo
    if (routeInfo) {
      routeInfo.style.display = "none"
    }
  },

  // Generate sample route data (for testing)
  generateSampleRoute(callsign, originLat, originLon, destLat, destLon) {
    const waypoints = []
    const steps = 5

    for (let i = 0; i <= steps; i++) {
      const factor = i / steps
      const lat = originLat + (destLat - originLat) * factor
      const lon = originLon + (destLon - originLon) * factor

      waypoints.push({
        name: i === 0 ? "ORIGIN" : i === steps ? "DEST" : `WP${i}`,
        lat: lat,
        lon: lon,
      })
    }

    return {
      callsign: callsign,
      origin: "ORIGIN",
      destination: "DEST",
      waypoints: waypoints,
    }
  },

  // Clear all routes
  clearRoutes() {
    this.routes.clear()
  },
}
