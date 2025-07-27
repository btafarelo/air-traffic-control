// UI update functions
window.RadarUI = {
  lastFlightListUpdate: 0,
  updateThrottle: 2000, // Update lists every 2 seconds max

  // Initialize UI components
  init() {
    console.log("Initializing radar UI...")
    this.updateInitialStates()
    this.setupFlightListHandlers()
    console.log("Radar UI initialized successfully")
  },

  // Update initial UI states
  updateInitialStates() {
    const state = window.RadarState

    // Update toggle button states
    if (state.elements.sweepToggle) {
      state.elements.sweepToggle.classList.toggle("active", state.sweepEnabled)
    }
    if (state.elements.landmarksToggle) {
      state.elements.landmarksToggle.classList.toggle("active", state.landmarksEnabled)
    }
    if (state.elements.collisionToggle) {
      state.elements.collisionToggle.classList.toggle("active", state.collisionDetectionEnabled)
    }
    // Remove region map toggle
    if (state.elements.regionMapToggle) {
      state.elements.regionMapToggle.style.display = "none"
    }

    // Initialize flight lists
    this.updateFlightLists()
    this.updateAircraftCount()
  },

  // Setup flight list event handlers with improved click handling
  setupFlightListHandlers() {
    const state = window.RadarState

    // Handle clicks on flight items in the active flights list
    if (state.elements.flightsList) {
      state.elements.flightsList.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const flightItem = e.target.closest(".flight-item")
        if (flightItem && flightItem.dataset.callsign) {
          const callsign = flightItem.dataset.callsign
          console.log("Active flight list clicked:", callsign)
          window.RadarControls.handleFlightItemClick(callsign, e)
        }
      })
    }

    // Handle clicks on flight items in the complete flights list
    if (state.elements.completeFlightsList) {
      state.elements.completeFlightsList.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const flightItem = e.target.closest(".flight-item")
        if (flightItem && flightItem.dataset.callsign) {
          const callsign = flightItem.dataset.callsign
          console.log("Complete flight list clicked:", callsign)
          window.RadarControls.handleFlightItemClick(callsign, e)
        }
      })
    }
  },

  // Update flight lists with throttling
  updateFlightLists() {
    const now = Date.now()
    if (now - this.lastFlightListUpdate < this.updateThrottle) {
      return // Skip update if too frequent
    }
    this.lastFlightListUpdate = now

    this.updateActiveFlightsList()
    this.updateCompleteFlightsList()
  },

  // Update active flights list (subscribed flights only)
  updateActiveFlightsList() {
    const state = window.RadarState
    const flightsList = state.elements.flightsList

    if (!flightsList) return

    const activeFlights = state.getActiveFlights()
    flightsList.innerHTML = ""

    if (activeFlights.length === 0) {
      flightsList.innerHTML = '<div class="flight-item">No subscribed flights</div>'
      return
    }

    activeFlights
      .sort((a, b) => a.callsign.localeCompare(b.callsign))
      .forEach((flight) => {
        const flightItem = this.createFlightListItem(flight, false)
        flightsList.appendChild(flightItem)
      })
  },

  // Update complete flights list (all detected) with static information
  updateCompleteFlightsList(filteredFlights = null) {
    const state = window.RadarState
    const completeFlightsList = state.elements.completeFlightsList

    if (!completeFlightsList) return

    const flights = filteredFlights || state.getAllFlights()
    completeFlightsList.innerHTML = ""

    if (flights.length === 0) {
      const searchQuery = state.elements.flightSearch ? state.elements.flightSearch.value : ""
      const message = searchQuery.trim() ? "No flights match search" : "No flights detected"
      completeFlightsList.innerHTML = `<div class="flight-item">${message}</div>`
      return
    }

    flights
      .sort((a, b) => a.callsign.localeCompare(b.callsign))
      .forEach((flight) => {
        const flightItem = this.createFlightListItem(flight, true)
        completeFlightsList.appendChild(flightItem)
      })
  },

  // Create flight list item element with static information
  createFlightListItem(flight, isCompleteList = false) {
    const state = window.RadarState
    const flightItem = document.createElement("div")
    flightItem.className = "flight-item"
    flightItem.dataset.callsign = flight.callsign

    // Add selection and subscription classes
    if (state.selectedFlight === flight.callsign) {
      flightItem.classList.add("selected")
    }
    if (state.subscribedFlights.has(flight.callsign)) {
      flightItem.classList.add("subscribed")
    }

    // Create flight info with static data
    const callsignSpan = document.createElement("div")
    callsignSpan.className = "flight-callsign"
    callsignSpan.textContent = flight.callsign

    const infoSpan = document.createElement("div")
    infoSpan.className = "flight-info"

    if (isCompleteList) {
      // Show static information: origin → destination, aircraft type
      const origin = flight.origin || "N/A"
      const destination = flight.destination || "N/A"
      const aircraftType = flight.aircraftType || "N/A"
      infoSpan.innerHTML = `
        <div>${origin} → ${destination}</div>
        <div style="font-size: 10px; color: #888;">${aircraftType}</div>
      `
    } else {
      // Show basic info for active list
      const origin = flight.origin || "N/A"
      const destination = flight.destination || "N/A"
      infoSpan.textContent = `${origin} → ${destination}`
    }

    flightItem.appendChild(callsignSpan)
    flightItem.appendChild(infoSpan)

    return flightItem
  },

  // Update aircraft count display
  updateAircraftCount() {
    const state = window.RadarState
    const aircraftCount = state.elements.aircraftCount

    if (aircraftCount) {
      const activeCount = state.aircraft.size
      const totalCount = state.allDetectedFlights.size
      aircraftCount.textContent = `Active: ${activeCount} | Total: ${totalCount}`
    }
  },

  // Update flight details panel with dynamic information
  updateFlightDetails(callsign) {
    const state = window.RadarState
    const flightDetails = state.elements.flightDetails

    if (!flightDetails) return

    const flight = state.getFlight(callsign)
    if (!flight) {
      this.clearFlightDetails()
      return
    }

    // Calculate latency if generation timestamp is available
    let latencyInfo = "N/A"
    if (flight.generationTimestamp && flight.receivedTimestamp) {
      const latency = flight.receivedTimestamp - flight.generationTimestamp
      latencyInfo = `${latency}ms`
    }

    // Format generation timestamp
    let generationTime = "N/A"
    if (flight.generationTimestamp) {
      generationTime = new Date(flight.generationTimestamp).toLocaleTimeString()
    }

    flightDetails.innerHTML = `
      <div class="flight-detail-row">
        <span class="flight-detail-label">Callsign:</span>
        <span class="flight-detail-value">${flight.callsign}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Position:</span>
        <span class="flight-detail-value">${window.RadarUtils.formatCoordinates(flight.latitude, flight.longitude)}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Altitude:</span>
        <span class="flight-detail-value">${window.RadarUtils.formatAltitude(flight.altitude)}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Speed:</span>
        <span class="flight-detail-value">${window.RadarUtils.formatSpeed(flight.speed)}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Heading:</span>
        <span class="flight-detail-value">${flight.heading ? Math.round(flight.heading) + "°" : "N/A"}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Distance:</span>
        <span class="flight-detail-value">${window.RadarUtils.formatDistance(flight.distance)}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Aircraft:</span>
        <span class="flight-detail-value">${flight.aircraftType || "N/A"}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Origin:</span>
        <span class="flight-detail-value">${flight.origin || "N/A"}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Destination:</span>
        <span class="flight-detail-value">${flight.destination || "N/A"}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Generated:</span>
        <span class="flight-detail-value">${generationTime}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Latency:</span>
        <span class="flight-detail-value">${latencyInfo}</span>
      </div>
      <div class="flight-detail-row">
        <span class="flight-detail-label">Last Update:</span>
        <span class="flight-detail-value">${window.RadarUtils.getTimeDifference(flight.timestamp)}</span>
      </div>
    `

    flightDetails.classList.remove("empty")
  },

  // Clear flight details panel
  clearFlightDetails() {
    const state = window.RadarState
    const flightDetails = state.elements.flightDetails

    if (flightDetails) {
      flightDetails.innerHTML = "Select a flight to view details"
      flightDetails.classList.add("empty")
    }
  },

  // Show collision alert
  showCollisionAlert(flight1, flight2) {
    const state = window.RadarState
    const collisionAlert = state.elements.collisionAlert
    const collisionSection = state.elements.collisionSection
    const collisionInfo = state.elements.collisionInfo

    if (collisionAlert) {
      collisionAlert.innerHTML = `
        <strong>COLLISION RISK!</strong><br>
        ${flight1.callsign} & ${flight2.callsign}
      `
      collisionAlert.style.display = "block"
    }

    if (collisionSection) {
      collisionSection.style.display = "block"
    }

    if (collisionInfo) {
      const distance = window.RadarUtils.calculateDistance(
        flight1.latitude,
        flight1.longitude,
        flight2.latitude,
        flight2.longitude,
      )
      const altitudeDiff = Math.abs((flight1.altitude || 0) - (flight2.altitude || 0))

      collisionInfo.innerHTML = `
        <div class="collision-warning">
          <strong>Aircraft 1:</strong> ${flight1.callsign}<br>
          Position: ${window.RadarUtils.formatCoordinates(flight1.latitude, flight1.longitude)}<br>
          Altitude: ${window.RadarUtils.formatAltitude(flight1.altitude)}
        </div>
        <div class="collision-warning">
          <strong>Aircraft 2:</strong> ${flight2.callsign}<br>
          Position: ${window.RadarUtils.formatCoordinates(flight2.latitude, flight2.longitude)}<br>
          Altitude: ${window.RadarUtils.formatAltitude(flight2.altitude)}
        </div>
        <div class="collision-warning">
          <strong>Separation:</strong><br>
          Horizontal: ${window.RadarUtils.formatDistance(distance)}<br>
          Vertical: ${Math.round(altitudeDiff)} ft
        </div>
      `
    }
  },

  // Hide collision alert
  hideCollisionAlert() {
    const state = window.RadarState
    const collisionAlert = state.elements.collisionAlert
    const collisionSection = state.elements.collisionSection

    if (collisionAlert) {
      collisionAlert.style.display = "none"
    }

    if (collisionSection) {
      collisionSection.style.display = "none"
    }
  },

  // Update connection status display
  updateConnectionStatus(status, type) {
    const state = window.RadarState
    const connectionStatus = state.elements.connectionStatus

    if (connectionStatus) {
      connectionStatus.textContent = status
      connectionStatus.className = `connection-status ${type}`
    }
  },

  // Show notification
  showNotification(message, type = "info", duration = 3000) {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: #00ff00;
      padding: 10px 15px;
      border: 1px solid #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `

    if (type === "error") {
      notification.style.color = "#ff0000"
      notification.style.borderColor = "#ff0000"
    } else if (type === "warning") {
      notification.style.color = "#ffaa00"
      notification.style.borderColor = "#ffaa00"
    }

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, duration)
  },
}
