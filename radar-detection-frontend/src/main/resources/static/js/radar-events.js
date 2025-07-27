// Event handling system for radar application
window.RadarEvents = {
  // Initialize event system
  init() {
    console.log("Initializing radar event system...")
    this.setupWindowEvents()
    this.setupPeriodicTasks()
    console.log("Radar event system initialized")
  },

  // Setup window-level events
  setupWindowEvents() {
    // Handle window resize
    window.addEventListener("resize", this.handleResize.bind(this))

    // Handle page visibility changes
    document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this))

    // Handle beforeunload
    window.addEventListener("beforeunload", this.handleBeforeUnload.bind(this))

    // Handle errors
    window.addEventListener("error", this.handleError.bind(this))
    window.addEventListener("unhandledrejection", this.handleUnhandledRejection.bind(this))
  },

  // Setup periodic tasks
  setupPeriodicTasks() {
    // Cleanup old flights every 30 seconds
    setInterval(() => {
      window.RadarState.cleanupOldFlights()
    }, 30000)

    // Collision detection every 2 seconds
    setInterval(() => {
      if (window.RadarCollision) {
        window.RadarCollision.detectCollisions()
      }
    }, 2000)

    // Connection health check every 10 seconds
    setInterval(() => {
      this.checkConnectionHealth()
    }, 10000)
  },

  // Handle window resize
  handleResize() {
    const state = window.RadarState
    if (state.canvas) {
      // Recalculate center coordinates
      state.centerX = state.canvas.width / 2
      state.centerY = state.canvas.height / 2
    }
  },

  // Handle page visibility changes
  handleVisibilityChange() {
    if (document.hidden) {
      console.log("Page hidden - reducing update frequency")
      // Could reduce animation frame rate here
    } else {
      console.log("Page visible - resuming normal operation")
      // Resume normal operation
    }
  },

  // Handle before page unload
  handleBeforeUnload(event) {
    // Cleanup WebSocket connection
    if (window.RadarWebSocket) {
      window.RadarWebSocket.disconnect()
    }

    // Stop animation
    if (window.RadarDrawing) {
      window.RadarDrawing.stopAnimation()
    }
  },

  // Handle JavaScript errors
  handleError(event) {
    console.error("JavaScript error:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    })

    // Could send error to logging service here
    this.logError("JavaScript Error", event.message, event.filename, event.lineno)
  },

  // Handle unhandled promise rejections
  handleUnhandledRejection(event) {
    console.error("Unhandled promise rejection:", event.reason)
    this.logError("Promise Rejection", event.reason)
  },

  // Check WebSocket connection health
  checkConnectionHealth() {
    const state = window.RadarState

    if (!state.ws || state.ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket connection unhealthy")

      // Attempt reconnection if not already trying
      if (state.connectionAttempts === 0) {
        console.log("Attempting to reconnect...")
        window.RadarWebSocket.connect()
      }
    }
  },

  // Log errors (could be extended to send to server)
  logError(type, message, filename = "", lineno = 0) {
    const errorData = {
      type: type,
      message: message,
      filename: filename,
      lineno: lineno,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    console.error("Error logged:", errorData)

    // Could send to error tracking service
    // this.sendErrorToServer(errorData);
  },

  // Custom event dispatcher
  dispatchCustomEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail: detail,
      bubbles: true,
      cancelable: true,
    })

    document.dispatchEvent(event)
  },

  // Listen for custom events
  addEventListener(eventName, handler) {
    document.addEventListener(eventName, handler)
  },

  // Remove custom event listeners
  removeEventListener(eventName, handler) {
    document.removeEventListener(eventName, handler)
  },
}

// Custom events that can be dispatched
window.RadarEvents.EVENTS = {
  FLIGHT_SELECTED: "flight-selected",
  FLIGHT_UPDATED: "flight-updated",
  CONNECTION_STATUS_CHANGED: "connection-status-changed",
  COLLISION_DETECTED: "collision-detected",
  RADAR_SETTINGS_CHANGED: "radar-settings-changed",
}
