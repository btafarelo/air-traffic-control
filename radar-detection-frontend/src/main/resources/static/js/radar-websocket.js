// WebSocket communication handler

window.RadarWebSocket = {
  ws: null,
  reconnectTimer: null,
  heartbeatTimer: null,

  stompSocket: new StompJs.Client({
      client: null,
      observers: new Map(),
      brokerURL: 'ws://localhost:8081/flight-feed',
      connectHeaders: {
         login: 'user',
         passcode: 'password',
       },

       reconnectDelay: 5000,
       heartbeatIncoming: 4000,
       heartbeatOutgoing: 4000,

      init: function() {
          this.activate();
          //this.subscriptions();
      },

      onConnect: function (frame) {
       const subscription = this.subscribe('/topic/flightUpdates', (message) => {
          const flightUpdate = JSON.parse(new TextDecoder().decode(message._binaryBody)).flight;

          if (!flightUpdate.inRadarRange)
            window.RadarState.removeFlight(flightUpdate.callsign);
          else
            window.RadarState.updateFlight(flightUpdate);

           this.notifyObservers(message);
       });

       console.log('subscription > ' + subscription);
      },

      notifyObservers: function(event) {
          const data = JSON.parse(event.body);

          if (this.observers.get(data.service)) {
              this.observers.get(data.service).handleServerRequest(event, data);
              Broadcast.alertMessage(event.data);
          }
      },

      subscribeObserver: function(serviceType, callback) {
          this.observers.set(serviceType, callback);
          //this.observers[eventType].push(callback);
      },
  }),

  // Initialize WebSocket connection
  init() {
    console.log("Initializing WebSocket connection...")
    this.connect();
    this.stompSocket.init();
  },

  // Connect to WebSocket
  connect() {
    const state = window.RadarState

    try {
      console.log("Connecting to WebSocket:", window.WS_CONFIG.URL)
      this.ws = new WebSocket(window.WS_CONFIG.URL)
      this.ws.binaryType = "arraybuffer";
      state.ws = this.ws

      this.ws.onopen = this.onOpen.bind(this)
      this.ws.onmessage = this.onMessage.bind(this)
      this.ws.onclose = this.onClose.bind(this)
      this.ws.onerror = this.onError.bind(this)
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      this.scheduleReconnect()
    }
  },

  // Handle WebSocket open
  onOpen(event) {
    const state = window.RadarState
    console.log("WebSocket connected")

    state.connectionAttempts = 0
    this.updateConnectionStatus("Connected", "connected")

    // Start heartbeat
    //this.startHeartbeat()

    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  },

  // Handle WebSocket message
  onMessage(event) {
    const data = JSON.parse(event.data);

    try {
    /*
        protobuf.load("js/proto/flight-track-data.proto", function(err, root) {
            if (err)
                throw err;

            var MessageWrapper = root.lookupType("MessageWrapper");
            const Command = root.lookupEnum("Command");

            var messageWrapper = MessageWrapper.decode(new Uint8Array(event.data));

            if (Command.values.FLIGHT_UPDATE == messageWrapper.command)
                for(let i=0; i<messageWrapper.data.length; i++)
                    window.RadarState.updateFlight(messageWrapper.data[i]);
        });
*/

/*
      if (data.type === "flightUpdate" && data.data) {
        // Handle individual flight update
        window.RadarState.updateFlight(data.data)
      } else if (data.type === "currentFlights" && data.data) {
        // Handle batch of current flights
        console.log("Received current flights:", data.data.length)
        data.data.forEach((flight) => {
          window.RadarState.updateFlight(flight)
        })
      } else if (data.type === "subscriptionConfirmed") {
        console.log("Subscription confirmed for:", data.callsign)
      } else if (data.type === "unsubscriptionConfirmed") {
        console.log("Unsubscription confirmed for:", data.callsign)
      } else if (data.type === "error") {
        console.error("Server error:", data.message)
        if (window.RadarUI) {
          window.RadarUI.showNotification("Server error: " + data.message, "error")
        }
      } else if (data.type === "heartbeat") {
        console.log("Heartbeat received")
      } else {
        console.log("Unknown message type:", data.type, data)
      }
      */
    } catch (error) {
      console.error("Error parsing WebSocket message:", error)
    }
  },

  // Handle WebSocket close
  onClose(event) {
    console.log("WebSocket disconnected:", event.code, event.reason)
    this.updateConnectionStatus("Disconnected", "disconnected")

    // Stop heartbeat
    this.stopHeartbeat()

    // Schedule reconnect if not intentional
    if (event.code !== 1000) {
      this.scheduleReconnect()
    }
  },

  // Handle WebSocket error
  onError(error) {
    console.error("WebSocket error:", error)
    this.updateConnectionStatus("Error", "disconnected")
  },

  // Schedule reconnection
  scheduleReconnect() {
    const state = window.RadarState

    if (state.connectionAttempts >= window.WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.log("Max reconnection attempts reached")
      this.updateConnectionStatus("Failed", "disconnected")
      return
    }

    state.connectionAttempts++
    const delay = window.WS_CONFIG.RECONNECT_INTERVAL * state.connectionAttempts

    console.log(`Reconnecting in ${delay}ms (attempt ${state.connectionAttempts})`)
    this.updateConnectionStatus(`Reconnecting... (${state.connectionAttempts})`, "connecting")

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  },

  // Start heartbeat
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "heartbeat" }))
      }
    }, window.WS_CONFIG.HEARTBEAT_INTERVAL)
  },

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  },

  // Subscribe to all flights
  subscribeToAll() {
    const state = window.RadarState
    console.log("Subscribing to all flights")

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          action: "subscribe",
          callsign: "ALL",
        }),
      )
      state.isSubscribedToAll = true

      // Add all current flights to subscribed set
      state.getAllFlights().forEach((flight) => {
        state.subscribedFlights.add(flight.callsign)
        // Move to active list if within range
        if (flight.distance <= state.currentRange) {
          state.aircraft.set(flight.callsign, flight)
        }
      })

      if (window.RadarUI) {
        window.RadarUI.updateFlightLists()
      }
    }
  },

  // Unsubscribe from all flights
  unsubscribeFromAll() {
    const state = window.RadarState
    console.log("Unsubscribing from all flights")

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          action: "unsubscribe",
          callsign: "ALL",
        }),
      )
    }

    // Clear radar screen but preserve all detected flights
    state.clearRadarFlights()
  },

  // Subscribe to individual flight
  subscribeToFlight(callsign) {
    const state = window.RadarState
    console.log("Subscribing to flight:", callsign)

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          action: "subscribe",
          callsign: callsign,
        }),
      )
    }
  },

  // Unsubscribe from individual flight
  unsubscribeFromFlight(callsign) {
    const state = window.RadarState
    console.log("Unsubscribing from flight:", callsign)

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          action: "unsubscribe",
          callsign: callsign,
        }),
      )
    }
  },

  // Update connection status in UI
  updateConnectionStatus(status, type) {
    const state = window.RadarState
    const statusElement = state.elements.connectionStatus
    const detailsElement = state.elements.connectionDetails

    if (statusElement) {
      statusElement.textContent = status
    }

    if (detailsElement) {
      detailsElement.textContent = `WebSocket: ${status}`
    }

    // Update status indicator
    const indicator = document.querySelector(".status-indicator")
    if (indicator) {
      indicator.className = `status-indicator status-${type}`
    }
  },

  // Disconnect WebSocket
  disconnect() {
    console.log("Disconnecting WebSocket")

    // Stop timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.stopHeartbeat()

    // Close connection
    if (this.ws) {
      this.ws.close(1000, "Manual disconnect")
      this.ws = null
      window.RadarState.ws = null
    }

    this.updateConnectionStatus("Disconnected", "disconnected")
  }
}
