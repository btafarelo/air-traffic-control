// Radar configuration constants
window.RADAR_CONFIG = {
  CENTER_LAT: 37.7749,
  CENTER_LON: -122.4194,
  RANGE_KM: 200,
  CANVAS_SIZE: 500,
  TRAIL_LENGTH: 30,
  TRAIL_FADE_TIME: 300000,
  SWEEP_SPEED: 10000,
  AIRCRAFT: {
    WARNING_DISTANCE: 10,
    TRAIL_LENGTH: 30,
  },
  DEFAULTS: {
    SWEEP_ENABLED: true,
    LANDMARKS_ENABLED: true,
    COLLISION_DETECTION_ENABLED: false,
    SOUND_ENABLED: true,
    TRAILS_ENABLED: true,
    REGION_MAP_ENABLED: false,
  },
  GENEVA_LAT: 46.2044,
  GENEVA_LON: 6.1432,
  MAX_RANGE_KM: 100,
}

// WebSocket configuration
window.WS_CONFIG = {
  URL: "ws://localhost/flight-feed",
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 10,
  HEARTBEAT_INTERVAL: 30000,
}

// Perimeter landmarks - 8 landmarks around the perimeter
window.LANDMARKS = [
  // North
  { name: "Lausanne", lat: 46.5197, lon: 6.6323, type: "city" },
  // Northeast
  { name: "Montreux", lat: 46.4312, lon: 6.9123, type: "town" },
  // East
  { name: "Martigny", lat: 46.1022, lon: 7.0719, type: "town" },
  // Southeast
  { name: "Chamonix", lat: 45.9237, lon: 6.8694, type: "city" },
  // South
  { name: "Annecy", lat: 45.8992, lon: 6.1294, type: "city" },
  // Southwest
  { name: "Bellegarde", lat: 46.1067, lon: 5.8267, type: "town" },
  // West
  { name: "Gex", lat: 46.3333, lon: 6.0583, type: "town" },
  // Northwest
  { name: "Nyon", lat: 46.3833, lon: 6.2333, type: "town" },
]
