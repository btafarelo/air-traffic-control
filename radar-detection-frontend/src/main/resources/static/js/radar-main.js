// Main radar application initialization and coordination
window.RadarMain = {
  // Initialize the complete radar system
  init() {
    console.log("Initializing Radar Application...")

    try {
      // Initialize components in order
      this.initializeComponents()

      // Start the application
      this.startApplication()

      console.log("Radar application initialized successfully")
    } catch (error) {
      console.error("Failed to initialize radar application:", error)
      this.handleInitializationError(error)
    }
  },

  // Initialize all components
  initializeComponents() {
    console.log("Initializing components...")

    // Initialize state first
    window.RadarState.init()

    // Initialize UI components
    window.RadarUI.init()

    // Initialize controls
    window.RadarControls.init()

    // Initialize event system
    window.RadarEvents.init()

    console.log("All components initialized")
  },

  // Start the application
  startApplication() {
    console.log("Starting radar application...")

    // Start drawing/animation
    window.RadarDrawing.startAnimation()

    // Connect to WebSocket
    window.RadarWebSocket.init()

    // Set up periodic tasks
    this.setupPeriodicTasks()

    console.log("Radar application started")
  },

  // Setup periodic maintenance tasks
  setupPeriodicTasks() {
    // Update UI every 5 seconds
    setInterval(() => {
      if (window.RadarUI) {
        window.RadarUI.updateAircraftCount()
      }
    }, 5000)

    // Cleanup every 60 seconds
    setInterval(() => {
      if (window.RadarState) {
        window.RadarState.cleanupOldFlights()
      }
    }, 60000)
  },

  // Handle initialization errors
  handleInitializationError(error) {
    console.error("Initialization error:", error)

    // Show error message to user
    const errorDiv = document.createElement("div")
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 20px;
      border: 2px solid #ff0000;
      font-family: 'Courier New', monospace;
      text-align: center;
      z-index: 10000;
    `
    errorDiv.innerHTML = `
      <h3>Radar System Error</h3>
      <p>Failed to initialize the radar system.</p>
      <p>Please refresh the page to try again.</p>
      <button onclick="location.reload()" style="
        background: #ff0000;
        color: white;
        border: 1px solid white;
        padding: 5px 10px;
        margin-top: 10px;
        cursor: pointer;
      ">Refresh Page</button>
    `

    document.body.appendChild(errorDiv)
  },

  // Shutdown the application
  shutdown() {
    console.log("Shutting down radar application...")

    // Stop animation
    if (window.RadarDrawing) {
      window.RadarDrawing.stopAnimation()
    }

    // Disconnect WebSocket
    if (window.RadarWebSocket) {
      window.RadarWebSocket.disconnect()
    }

    // Clear intervals and timeouts
    // Note: In a real application, you'd track these IDs and clear them

    console.log("Radar application shutdown complete")
  },

  // Get application status
  getStatus() {
    const state = window.RadarState
    return {
      connected: state.ws && state.ws.readyState === WebSocket.OPEN,
      activeFlights: state.aircraft.size,
      totalFlights: state.allDetectedFlights.size,
      selectedFlight: state.selectedFlight,
      subscribedFlights: state.subscribedFlights.size,
      sweepEnabled: state.sweepEnabled,
      landmarksEnabled: state.landmarksEnabled,
      collisionDetectionEnabled: state.collisionDetectionEnabled,
      regionMapEnabled: state.regionMapEnabled,
    }
  },

  // Debug information
  getDebugInfo() {
    const state = window.RadarState
    return {
      canvas: {
        width: state.canvas?.width,
        height: state.canvas?.height,
        centerX: state.centerX,
        centerY: state.centerY,
      },
      geographic: {
        centerLat: state.centerLat,
        centerLon: state.centerLon,
        currentRange: state.currentRange,
      },
      data: {
        aircraft: Array.from(state.aircraft.keys()),
        allFlights: Array.from(state.allDetectedFlights.keys()),
        trails: Array.from(state.flightTrails.keys()),
        subscribed: Array.from(state.subscribedFlights),
      },
      websocket: {
        url: window.WS_CONFIG.URL,
        readyState: state.ws?.readyState,
        connectionAttempts: state.connectionAttempts,
      },
    }
  },
}

// Global error handler
window.addEventListener("error", (event) => {
  console.error("Global error:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  })
  console.error("Error details:", event.error)
})

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded - initializing radar system...")
  window.RadarMain.init()
})

// Export for debugging
window.Radar = window.RadarMain
