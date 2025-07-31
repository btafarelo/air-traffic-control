package com.github.btafarelo.airtraffic.radardetection.domain.port.out;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

public interface FlightDetected {
    @MessageMapping("/flightDetected") // Endpoint for receiving messages
    @SendTo("/topic/flightUpdates")
        // Broadcast to all subscribers
    FlightDetectedEvent handleFlightDetected(FlightDetectedEvent event);
}
