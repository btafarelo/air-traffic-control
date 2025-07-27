// Radar control handlers
window.RadarControls = {
  // Initialize control event listeners
  init() {
    console.log("Initializing radar controls...")
    this.setupToggleControls()
    this.setupSubscriptionControls()
    this.setupSearchControls()
    this.setupCanvasEvents()
    console.log("Radar controls initialized")
  },

  // Setup toggle button controls
  setupToggleControls() {
    const state = window.RadarState

    // Sweep toggle
    if (state.elements.sweepToggle) {
      state.elements.sweepToggle.addEventListener("click", () => {
        state.toggleSweep()
      })
      state.elements.sweepToggle.classList.toggle("active", state.sweepEnabled)
    }

    // Landmarks toggle
    if (state.elements.landmarksToggle) {
      state.elements.landmarksToggle.addEventListener("click", () => {
        state.toggleLandmarks()
      })
      state.elements.landmarksToggle.classList.toggle("active", state.landmarksEnabled)
    }

    // Collision detection toggle
    if (state.elements.collisionToggle) {
      state.elements.collisionToggle.addEventListener("click", () => {
        state.toggleCollisionDetection()
      })
      state.elements.collisionToggle.classList.toggle("active", state.collisionDetectionEnabled)
    }

    // Hide region map toggle since feature is removed
    if (state.elements.regionMapToggle) {
      state.elements.regionMapToggle.style.display = "none"
    }
  },

  // Setup subscription controls
  setupSubscriptionControls() {
    const state = window.RadarState

    // Subscribe all button
    if (state.elements.subscribeAllBtn) {
      state.elements.subscribeAllBtn.addEventListener("click", () => {
        window.RadarWebSocket.subscribeToAll()
        this.updateSubscriptionButtons()
      })
    }

    // Unsubscribe all button
    if (state.elements.unsubscribeAllBtn) {
      state.elements.unsubscribeAllBtn.addEventListener("click", () => {
        window.RadarWebSocket.unsubscribeFromAll()
        this.updateSubscriptionButtons()
      })
    }

    this.updateSubscriptionButtons()
  },

  // Update subscription button states
  updateSubscriptionButtons() {
    const state = window.RadarState

    if (state.elements.subscribeAllBtn) {
      state.elements.subscribeAllBtn.classList.toggle("active", state.isSubscribedToAll)
    }

    if (state.elements.unsubscribeAllBtn) {
      state.elements.unsubscribeAllBtn.classList.toggle("active", !state.isSubscribedToAll)
    }
  },

  // Setup search controls
  setupSearchControls() {
    const state = window.RadarState

    if (state.elements.flightSearch) {
      // Debounced search function
      const debouncedSearch = window.RadarUtils.debounce((query) => {
        this.performSearch(query)
      }, 300)

      state.elements.flightSearch.addEventListener("input", (e) => {
        debouncedSearch(e.target.value)
      })

      // Clear search on escape
      state.elements.flightSearch.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          e.target.value = ""
          this.performSearch("")
        }
      })
    }
  },

  // Perform flight search
  performSearch(query) {
    const state = window.RadarState
    const filteredFlights = state.filterFlights(query)

    if (window.RadarUI) {
      window.RadarUI.updateCompleteFlightsList(filteredFlights)
    }
  },

  // Setup canvas event listeners with improved click detection
  setupCanvasEvents() {
    const state = window.RadarState

    if (state.canvas) {
      // Enhanced click handling for aircraft selection
      state.canvas.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const rect = state.canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        console.log("Canvas clicked at:", x, y)

        const clickedAircraft = window.RadarDrawing.getAircraftAtPosition(x, y)
        console.log("Aircraft found:", clickedAircraft)

        if (clickedAircraft) {
          state.selectFlight(clickedAircraft)
        } else {
          // Clear selection if clicking empty space
          state.selectedFlight = null
          if (window.RadarUI) {
            window.RadarUI.clearFlightDetails()
            window.RadarUI.updateFlightLists()
          }
        }
      })

      // Change cursor on hover
      state.canvas.addEventListener("mousemove", (e) => {
        const rect = state.canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const hoveredAircraft = window.RadarDrawing.getAircraftAtPosition(x, y)
        state.canvas.style.cursor = hoveredAircraft ? "pointer" : "crosshair"
      })
    }
  },

  // Handle flight item clicks in lists with individual subscription support
  handleFlightItemClick(callsign, event) {
    const state = window.RadarState

    console.log("Flight item clicked:", callsign, "Ctrl/Meta:", event.ctrlKey || event.metaKey)

    if (event.ctrlKey || event.metaKey) {
      // Ctrl+click to subscribe/unsubscribe individual flights
      if (state.subscribedFlights.has(callsign)) {
        state.unsubscribeFromFlight(callsign)
      } else {
        state.subscribeToFlight(callsign)
      }
    } else {
      // Regular click to select
      state.selectFlight(callsign)
    }

    if (window.RadarUI) {
      window.RadarUI.updateFlightLists()
    }
  },

  // Handle keyboard shortcuts
  handleKeyboardShortcuts(event) {
    const state = window.RadarState

    switch (event.key.toLowerCase()) {
      case "s":
        if (event.ctrlKey) {
          event.preventDefault()
          state.toggleSweep()
        }
        break
      case "l":
        if (event.ctrlKey) {
          event.preventDefault()
          state.toggleLandmarks()
        }
        break
      case "c":
        if (event.ctrlKey) {
          event.preventDefault()
          state.toggleCollisionDetection()
        }
        break
      case "escape":
        // Clear selection
        state.selectedFlight = null
        if (window.RadarUI) {
          window.RadarUI.clearFlightDetails()
          window.RadarUI.updateFlightLists()
        }
        break
    }
  },
}

// Add keyboard event listener
document.addEventListener("keydown", (e) => {
  window.RadarControls.handleKeyboardShortcuts(e)
})
