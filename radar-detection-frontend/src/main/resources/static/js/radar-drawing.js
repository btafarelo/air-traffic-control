// Radar drawing and animation functions
window.RadarDrawing = {
  animationId: null,
  lastFrameTime: 0,

  // Start animation loop
  startAnimation() {
    console.log("Starting radar animation...")
    this.lastFrameTime = performance.now()
    this.animate()
  },

  // Stop animation loop
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
      console.log("Radar animation stopped")
    }
  },

  // Main animation loop
  animate(currentTime) {
    this.animationId = requestAnimationFrame(this.animate.bind(this))

    const deltaTime = currentTime - this.lastFrameTime

    // Update at 30 FPS
    if (deltaTime >= 33) {
      this.updateSweep()
      this.draw()
      this.lastFrameTime = currentTime
    }
  },

  // Update sweep angle
  updateSweep() {
    const state = window.RadarState
    if (state.sweepEnabled) {
      state.sweepAngle = (state.sweepAngle + 2) % 360
    }
  },

  // Main drawing function
  draw() {
    const state = window.RadarState
    const ctx = state.ctx
    const canvas = state.canvas

    if (!ctx || !canvas) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw radar background
    this.drawRadarBackground(ctx, canvas)

    // Draw range rings
    this.drawRangeRings(ctx, canvas)

    // Draw landmarks
    if (state.landmarksEnabled) {
      this.drawLandmarks(ctx, canvas)
    }

    // Draw sweep
    if (state.sweepEnabled) {
      this.drawSweep(ctx, canvas)
    }

    // Draw aircraft
    this.drawAircraft(ctx, canvas)

    // Draw selected aircraft highlight
    if (state.selectedFlight) {
      this.drawSelectedAircraft(ctx, canvas)
    }
  },

  // Draw radar background
  drawRadarBackground(ctx, canvas) {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10

    // Background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "#001122"
    ctx.fill()
    ctx.strokeStyle = "#00ff00"
    ctx.lineWidth = 2
    ctx.stroke()
  },

  // Draw range rings
  drawRangeRings(ctx, canvas) {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 10
    const maxRange = window.RadarState.currentRange

    ctx.strokeStyle = "#004400"
    ctx.lineWidth = 1

    // Draw rings every 20km for 100km range
    for (let range = 20; range <= maxRange; range += 20) {
      const radius = (range / maxRange) * maxRadius

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.stroke()

      // Draw range labels
      ctx.fillStyle = "#00ff00"
      ctx.font = "12px monospace"
      ctx.fillText(`${range}km`, centerX + radius - 25, centerY - 5)
    }

    // Draw crosshairs
    ctx.beginPath()
    ctx.moveTo(centerX - maxRadius, centerY)
    ctx.lineTo(centerX + maxRadius, centerY)
    ctx.moveTo(centerX, centerY - maxRadius)
    ctx.lineTo(centerX, centerY + maxRadius)
    ctx.stroke()
  },

  // Draw landmarks around the perimeter
  drawLandmarks(ctx, canvas) {
    const state = window.RadarState

    window.LANDMARKS.forEach((landmark) => {
      const coords = window.RadarUtils.latLonToCanvas(
        landmark.lat,
        landmark.lon,
        state.centerLat,
        state.centerLon,
        canvas.width,
        state.currentRange,
      )

      if (coords.distance <= state.currentRange) {
        // Draw landmark symbol
        ctx.fillStyle = this.getLandmarkColor(landmark.type)

        switch (landmark.type) {
          case "city":
            ctx.fillRect(coords.x - 3, coords.y - 3, 6, 6)
            break
          case "town":
            ctx.beginPath()
            ctx.arc(coords.x, coords.y, 2, 0, 2 * Math.PI)
            ctx.fill()
            break
          case "airport":
            this.drawAirportSymbol(ctx, coords.x, coords.y)
            break
          case "mountain":
            this.drawMountainSymbol(ctx, coords.x, coords.y)
            break
          case "lake":
            ctx.strokeStyle = "#0088ff"
            ctx.beginPath()
            ctx.arc(coords.x, coords.y, 4, 0, 2 * Math.PI)
            ctx.stroke()
            break
        }

        // Draw landmark name in gray
        ctx.fillStyle = "#666666"
        ctx.font = "10px monospace"
        ctx.fillText(landmark.name, coords.x + 5, coords.y - 5)
      }
    })
  },

  // Get landmark color by type
  getLandmarkColor(type) {
    switch (type) {
      case "city":
        return "#888888"
      case "town":
        return "#666666"
      case "airport":
        return "#ff0000"
      case "mountain":
        return "#8B4513"
      case "lake":
        return "#0088ff"
      default:
        return "#666666"
    }
  },

  // Draw airport symbol
  drawAirportSymbol(ctx, x, y) {
    ctx.strokeStyle = "#ff0000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x - 4, y)
    ctx.lineTo(x + 4, y)
    ctx.moveTo(x, y - 4)
    ctx.lineTo(x, y + 4)
    ctx.stroke()
  },

  // Draw mountain symbol
  drawMountainSymbol(ctx, x, y) {
    ctx.fillStyle = "#8B4513"
    ctx.beginPath()
    ctx.moveTo(x, y - 4)
    ctx.lineTo(x - 3, y + 2)
    ctx.lineTo(x + 3, y + 2)
    ctx.closePath()
    ctx.fill()
  },

  // Draw radar sweep
  drawSweep(ctx, canvas) {
    const state = window.RadarState
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10

    const sweepAngle = (state.sweepAngle * Math.PI) / 180

    // Create gradient for sweep
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, "rgba(0, 255, 0, 0.3)")
    gradient.addColorStop(0.8, "rgba(0, 255, 0, 0.1)")
    gradient.addColorStop(1, "rgba(0, 255, 0, 0)")

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(sweepAngle)

    // Draw sweep beam
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, radius, -Math.PI / 12, Math.PI / 12)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.restore()
  },

  // Draw aircraft with enhanced clickable areas
  drawAircraft(ctx, canvas) {
    const state = window.RadarState

    state.aircraft.forEach((flight, callsign) => {
      const coords = window.RadarUtils.latLonToCanvas(
        flight.latitude,
        flight.longitude,
        state.centerLat,
        state.centerLon,
        canvas.width,
        state.currentRange,
      )

      if (coords.distance <= state.currentRange) {
        // Draw aircraft symbol
        this.drawAircraftSymbol(ctx, coords.x, coords.y, flight.heading || 0)

        // Draw callsign with background for better clicking
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(coords.x + 6, coords.y - 20, callsign.length * 7 + 4, 14)

        ctx.fillStyle = "#00ff00"
        ctx.font = "11px monospace"
        ctx.fillText(callsign, coords.x + 8, coords.y - 8)

        // Draw altitude with background
        if (flight.altitude) {
          const altText = `${Math.round(flight.altitude)}ft`
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
          ctx.fillRect(coords.x + 6, coords.y + 5, altText.length * 6 + 4, 12)

          ctx.fillStyle = "#00ff00"
          ctx.font = "9px monospace"
          ctx.fillText(altText, coords.x + 8, coords.y + 15)
        }
      }
    })
  },

  // Draw aircraft symbol
  drawAircraftSymbol(ctx, x, y, heading) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((heading * Math.PI) / 180)

    // Draw aircraft triangle
    ctx.fillStyle = "#00ff00"
    ctx.beginPath()
    ctx.moveTo(0, -6)
    ctx.lineTo(-4, 4)
    ctx.lineTo(4, 4)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  },

  // Draw selected aircraft highlight
  drawSelectedAircraft(ctx, canvas) {
    const state = window.RadarState
    const selectedFlight = state.aircraft.get(state.selectedFlight)

    if (selectedFlight) {
      const coords = window.RadarUtils.latLonToCanvas(
        selectedFlight.latitude,
        selectedFlight.longitude,
        state.centerLat,
        state.centerLon,
        canvas.width,
        state.currentRange,
      )

      // Draw selection circle
      ctx.strokeStyle = "#ffff00"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(coords.x, coords.y, 12, 0, 2 * Math.PI)
      ctx.stroke()
    }
  },

  // Enhanced aircraft clicking detection with better precision
  getAircraftAtPosition(x, y) {
    const state = window.RadarState
    let closestAircraft = null
    let closestDistance = Number.POSITIVE_INFINITY

    for (const [callsign, flight] of state.aircraft) {
      const coords = window.RadarUtils.latLonToCanvas(
        flight.latitude,
        flight.longitude,
        state.centerLat,
        state.centerLon,
        state.canvas.width,
        state.currentRange,
      )

      if (coords.distance <= state.currentRange) {
        // Check aircraft symbol area (circle around aircraft)
        const symbolDistance = Math.sqrt(Math.pow(coords.x - x, 2) + Math.pow(coords.y - y, 2))

        // Check if click is within aircraft symbol (15px radius)
        if (symbolDistance <= 15 && symbolDistance < closestDistance) {
          closestDistance = symbolDistance
          closestAircraft = callsign
        }

        // Check text area (callsign and altitude labels)
        const textStartX = coords.x + 6
        const textStartY = coords.y - 20
        const textWidth = callsign.length * 7 + 10
        const textHeight = 40 // Covers both callsign and altitude

        if (x >= textStartX && x <= textStartX + textWidth && y >= textStartY && y <= textStartY + textHeight) {
          const textDistance = Math.sqrt(
            Math.pow(textStartX + textWidth / 2 - x, 2) + Math.pow(textStartY + textHeight / 2 - y, 2),
          )
          if (textDistance < closestDistance) {
            closestDistance = textDistance
            closestAircraft = callsign
          }
        }
      }
    }

    return closestAircraft
  },
}
