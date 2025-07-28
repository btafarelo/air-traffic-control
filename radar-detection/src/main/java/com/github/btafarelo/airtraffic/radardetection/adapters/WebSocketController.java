package com.github.btafarelo.airtraffic.radardetection.adapters;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/flightDetected") // Endpoint for receiving messages
    @SendTo("/topic/flightUpdates") // Broadcast to all subscribers
    public FlightDetectedEvent handleFlightDetected(FlightDetectedEvent event) {
        return event; // Return the event to be sent to clients
    }
}

