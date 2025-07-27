// Global state management for the radar system
window.RadarState = {
  // Canvas and rendering
  canvas: null,
  ctx: null,
  centerX: 0,
  centerY: 0,

  // Geographic center and range
  centerLat: window.RADAR_CONFIG.GENEVA_LAT,
  centerLon: window.RADAR_CONFIG.GENEVA_LON,
  currentRange: window.RADAR_CONFIG.MAX_RANGE_KM,

  // Flight data
  aircraft: new Map(),
  allDetectedFlights: new Map(),
  flightTrails: new Map(),
  subscribedFlights: new Set(),
  selectedFlight: null,
  searchResults: [],
  filteredFlights: [],

  // WebSocket connection
  ws: null,
  connectionAttempts: 0,
  isSubscribedToAll: false,

  // Radar controls
  sweepEnabled: window.RADAR_CONFIG.DEFAULTS.SWEEP_ENABLED,
  landmarksEnabled: window.RADAR_CONFIG.DEFAULTS.LANDMARKS_ENABLED,
  collisionDetectionEnabled: window.RADAR_CONFIG.DEFAULTS.COLLISION_DETECTION_ENABLED,
  regionMapEnabled: false, // Disabled

  // Animation
  animationId: null,
  sweepAngle: 0,
  lastUpdateTime: 0,

  // Collision detection
  collisionPairs: new Map(),

  // DOM elements (cached for performance)
  elements: {},

  // Initialize the radar state
  init() {
    console.log("Initializing radar state...")

    // Setup canvas
    this.canvas = document.getElementById("radarCanvas")
    if (!this.canvas) {
      console.error("Radar canvas not found!")
      return
    }

    this.ctx = this.canvas.getContext("2d")
    this.centerX = this.canvas.width / 2
    this.centerY = this.canvas.height / 2

    // Cache DOM elements
    this.cacheElements()

    // Initialize audio context
    this.initAudio()

    console.log("Radar state initialized successfully")
  },

  // Cache frequently used DOM elements
  cacheElements() {
    this.elements = {
      connectionStatus: document.getElementById("connectionStatus"),
      connectionDetails: document.getElementById("connectionDetails"),
      aircraftList: document.getElementById("aircraftList"),
      aircraftCount: document.getElementById("aircraftCount"),
      flightDetails: document.getElementById("flightDetails"),
      flightsList: document.getElementById("flightsList"),
      completeFlightsList: document.getElementById("completeFlightsList"),
      subscribeAllBtn: document.getElementById("subscribeAllBtn"),
      unsubscribeAllBtn: document.getElementById("unsubscribeAllBtn"),
      collisionAlert: document.getElementById("collisionAlert"),
      collisionSection: document.getElementById("collisionSection"),
      collisionInfo: document.getElementById("collisionInfo"),
      flightSearch: document.getElementById("flightSearch"),
      searchResults: document.getElementById("searchResults"),
      sweepToggle: document.getElementById("sweepToggle"),
      landmarksToggle: document.getElementById("landmarksToggle"),
      collisionToggle: document.getElementById("collisionToggle"),
      regionMapToggle: document.getElementById("regionMapToggle"),
    }
  },

  // Initialize audio context
  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn("Audio context not supported:", e)
    }
  },

  // Update flight data
  updateFlight(flightData) {
    if (!flightData || !flightData.callsign || !flightData.latitude || !flightData.longitude) {
      console.warn("Invalid flight data received:", flightData)
      return
    }

    const distance = window.RadarUtils.calculateDistance(
      this.centerLat,
      this.centerLon,
      flightData.latitude,
      flightData.longitude,
    )

    const enrichedData = {
      ...flightData,
      timestamp: Date.now(),
      receivedTimestamp: Date.now(), // When we received this update
      distance: distance,
    }

    // ALWAYS add to complete flights list (independent of subscriptions)
    this.allDetectedFlights.set(flightData.callsign, enrichedData)

    // Add to active aircraft only if subscribed and within range
    //TODO: Workarronud to deactivate subscribe all button
    //if (this.subscribedFlights.has(flightData.callsign) && distance <= this.currentRange) {
      this.aircraft.set(flightData.callsign, enrichedData)

      // Update flight trail
      this.updateFlightTrail(flightData.callsign, flightData.latitude, flightData.longitude)
    /*
    } else if (!this.subscribedFlights.has(flightData.callsign)) {
      // Remove from active aircraft if not subscribed
      this.aircraft.delete(flightData.callsign)
    }*/

    // Update flight details if this is the selected flight
    if (this.selectedFlight === flightData.callsign && window.RadarUI) {
      window.RadarUI.updateFlightDetails(flightData.callsign)
    }

    // Update UI with throttling
    this.throttledUIUpdate()
  },

  // Throttled UI update to prevent excessive updates
  throttledUIUpdate:
    window.RadarUtils?.debounce(() => {
      if (window.RadarUI) {
        window.RadarUI.updateFlightLists()
        window.RadarUI.updateAircraftCount()
      }
    }, 1000) || (() => {}),

  // Update flight trail
  updateFlightTrail(callsign, lat, lon) {
    if (!this.flightTrails.has(callsign)) {
      this.flightTrails.set(callsign, [])
    }

    const trail = this.flightTrails.get(callsign)
    trail.push({
      lat: lat,
      lon: lon,
      timestamp: Date.now(),
    })

    // Keep only recent trail points
    const cutoffTime = Date.now() - window.RADAR_CONFIG.AIRCRAFT.TRAIL_LENGTH * 1000
    this.flightTrails.set(
      callsign,
      trail.filter((point) => point.timestamp > cutoffTime),
    )
  },

  // Remove flight from tracking
  removeFlight(callsign) {
    this.aircraft.delete(callsign)
    this.allDetectedFlights.delete(callsign)
    this.flightTrails.delete(callsign)
    this.subscribedFlights.delete(callsign)

    if (this.selectedFlight === callsign) {
      this.selectedFlight = null
      if (window.RadarUI) {
        window.RadarUI.clearFlightDetails()
      }
    }

    // Update UI
    if (window.RadarUI) {
      window.RadarUI.updateFlightLists()
      window.RadarUI.updateAircraftCount()
    }
  },

  // Clear only radar screen flights (for unsubscribe all)
  clearRadarFlights() {
    this.aircraft.clear()
    this.flightTrails.clear()
    this.subscribedFlights.clear()
    this.selectedFlight = null
    this.isSubscribedToAll = false

    // Update UI
    if (window.RadarUI) {
      window.RadarUI.updateFlightLists()
      window.RadarUI.updateAircraftCount()
      window.RadarUI.clearFlightDetails()
    }

    console.log("Radar screen cleared - all detected flights list preserved")
  },

  // Get flight data
  getFlight(callsign) {
    return this.allDetectedFlights.get(callsign)
  },

  // Get all flights as array
  getAllFlights() {
    return Array.from(this.allDetectedFlights.values())
  },

  // Get active flights (subscribed flights within radar range)
  getActiveFlights() {
    return Array.from(this.aircraft.values())
  },

  // Filter flights based on search query
  filterFlights(query) {
    if (!query || query.trim() === "") {
      this.filteredFlights = this.getAllFlights()
      return this.filteredFlights
    }

    const lowerQuery = query.toLowerCase().trim()
    this.filteredFlights = this.getAllFlights().filter(
      (flight) =>
        flight.callsign.toLowerCase().includes(lowerQuery) ||
        (flight.origin && flight.origin.toLowerCase().includes(lowerQuery)) ||
        (flight.destination && flight.destination.toLowerCase().includes(lowerQuery)),
    )

    return this.filteredFlights
  },

  // Select flight
  selectFlight(callsign) {
    this.selectedFlight = callsign
    console.log("Flight selected:", callsign)
    if (window.RadarUI) {
      window.RadarUI.updateFlightDetails(callsign)
      window.RadarUI.updateFlightLists()
    }
  },

  // Subscribe to flight updates
  subscribeToFlight(callsign) {
    this.subscribedFlights.add(callsign)
    console.log("Subscribed to flight:", callsign)

    // Move flight to active list if it exists and is within range
    const flight = this.allDetectedFlights.get(callsign)
    if (flight && flight.distance <= this.currentRange) {
      this.aircraft.set(callsign, flight)
    }

    if (window.RadarWebSocket) {
      window.RadarWebSocket.subscribeToFlight(callsign)
    }

    // Update UI immediately
    if (window.RadarUI) {
      window.RadarUI.updateFlightLists()
    }
  },

  // Unsubscribe from flight updates
  unsubscribeFromFlight(callsign) {
    this.subscribedFlights.delete(callsign)
    this.aircraft.delete(callsign) // Remove from active display
    console.log("Unsubscribed from flight:", callsign)
    if (window.RadarWebSocket) {
      window.RadarWebSocket.unsubscribeFromFlight(callsign)
    }

    // Update UI immediately
    if (window.RadarUI) {
      window.RadarUI.updateFlightLists()
    }
  },

  // Clean up old flights
  cleanupOldFlights() {
    const cutoffTime = Date.now() - 60000 // 1 minute

    // Clean up aircraft
    for (const [callsign, flight] of this.aircraft.entries()) {
      if (flight.timestamp < cutoffTime) {
        this.aircraft.delete(callsign)
      }
    }

    // Clean up all detected flights (longer timeout)
    const longCutoffTime = Date.now() - 300000 // 5 minutes
    for (const [callsign, flight] of this.allDetectedFlights.entries()) {
      if (flight.timestamp < longCutoffTime) {
        this.allDetectedFlights.delete(callsign)
        this.flightTrails.delete(callsign)
      }
    }

    // Update UI
    if (window.RadarUI) {
      window.RadarUI.updateFlightLists()
      window.RadarUI.updateAircraftCount()
    }
  },

  // Toggle radar controls
  toggleSweep() {
    this.sweepEnabled = !this.sweepEnabled
    if (this.elements.sweepToggle) {
      this.elements.sweepToggle.classList.toggle("active", this.sweepEnabled)
    }
    console.log("Sweep toggled:", this.sweepEnabled)
  },

  toggleLandmarks() {
    this.landmarksEnabled = !this.landmarksEnabled
    if (this.elements.landmarksToggle) {
      this.elements.landmarksToggle.classList.toggle("active", this.landmarksEnabled)
    }
    console.log("Landmarks toggled:", this.landmarksEnabled)
  },

  toggleCollisionDetection() {
    this.collisionDetectionEnabled = !this.collisionDetectionEnabled
    if (this.elements.collisionToggle) {
      this.elements.collisionToggle.classList.toggle("active", this.collisionDetectionEnabled)
    }

    if (!this.collisionDetectionEnabled) {
      // Clear collision alerts when disabled
      this.collisionPairs.clear()
      if (this.elements.collisionAlert) {
        this.elements.collisionAlert.style.display = "none"
      }
      if (this.elements.collisionSection) {
        this.elements.collisionSection.style.display = "none"
      }
    }
    console.log("Collision detection toggled:", this.collisionDetectionEnabled)
  },

  toggleRegionMap() {
    // Region map feature removed - do nothing
    console.log("Region map feature has been removed")
  },
}
