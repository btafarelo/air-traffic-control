// Collision detection system
window.RadarCollision = {
  // Minimum separation distances
  HORIZONTAL_SEPARATION: 5, // km
  VERTICAL_SEPARATION: 1000, // feet

  // Detect potential collisions
  detectCollisions() {
    const state = window.RadarState

    if (!state.collisionDetectionEnabled) {
      return
    }

    const activeFlights = state.getActiveFlights()
    const currentCollisions = new Map()

    // Check all pairs of aircraft
    for (let i = 0; i < activeFlights.length; i++) {
      for (let j = i + 1; j < activeFlights.length; j++) {
        const flight1 = activeFlights[i]
        const flight2 = activeFlights[j]

        const collision = this.checkCollisionRisk(flight1, flight2)
        if (collision) {
          const pairKey = this.getPairKey(flight1.callsign, flight2.callsign)
          currentCollisions.set(pairKey, { flight1, flight2, ...collision })
        }
      }
    }

    // Update collision state
    this.updateCollisionAlerts(currentCollisions)
    state.collisionPairs = currentCollisions
  },

  // Check collision risk between two flights
  checkCollisionRisk(flight1, flight2) {
    // Calculate horizontal distance
    const horizontalDistance = window.RadarUtils.calculateDistance(
      flight1.latitude,
      flight1.longitude,
      flight2.latitude,
      flight2.longitude,
    )

    // Calculate vertical separation
    const verticalSeparation = Math.abs((flight1.altitude || 0) - (flight2.altitude || 0))

    // Check if within danger zone
    const horizontalRisk = horizontalDistance < this.HORIZONTAL_SEPARATION
    const verticalRisk = verticalSeparation < this.VERTICAL_SEPARATION

    if (horizontalRisk && verticalRisk) {
      return {
        horizontalDistance,
        verticalSeparation,
        riskLevel: this.calculateRiskLevel(horizontalDistance, verticalSeparation),
      }
    }

    return null
  },

  // Calculate risk level
  calculateRiskLevel(horizontalDistance, verticalSeparation) {
    const horizontalRatio = horizontalDistance / this.HORIZONTAL_SEPARATION
    const verticalRatio = verticalSeparation / this.VERTICAL_SEPARATION

    const overallRisk = Math.min(horizontalRatio, verticalRatio)

    if (overallRisk < 0.3) return "CRITICAL"
    if (overallRisk < 0.6) return "HIGH"
    return "MEDIUM"
  },

  // Generate pair key for collision tracking
  getPairKey(callsign1, callsign2) {
    return [callsign1, callsign2].sort().join("-")
  },

  // Update collision alerts
  updateCollisionAlerts(currentCollisions) {
    const state = window.RadarState

    if (currentCollisions.size > 0) {
      // Show collision alert for the highest risk pair
      let highestRisk = null
      let highestRiskLevel = 0

      for (const [pairKey, collision] of currentCollisions) {
        const riskValue = this.getRiskValue(collision.riskLevel)
        if (riskValue > highestRiskLevel) {
          highestRiskLevel = riskValue
          highestRisk = collision
        }
      }

      if (highestRisk && window.RadarUI) {
        window.RadarUI.showCollisionAlert(highestRisk.flight1, highestRisk.flight2)
      }
    } else {
      // Hide collision alert
      if (window.RadarUI) {
        window.RadarUI.hideCollisionAlert()
      }
    }
  },

  // Get numeric risk value for comparison
  getRiskValue(riskLevel) {
    switch (riskLevel) {
      case "CRITICAL":
        return 3
      case "HIGH":
        return 2
      case "MEDIUM":
        return 1
      default:
        return 0
    }
  },

  // Get all current collisions
  getCurrentCollisions() {
    return window.RadarState.collisionPairs
  },

  // Clear all collision alerts
  clearAllAlerts() {
    const state = window.RadarState
    state.collisionPairs.clear()

    if (window.RadarUI) {
      window.RadarUI.hideCollisionAlert()
    }
  },
}
