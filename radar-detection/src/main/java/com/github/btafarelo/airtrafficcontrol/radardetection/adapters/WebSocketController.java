package com.github.btafarelo.airtrafficcontrol.radardetection.adapters;

import com.github.btafarelo.airtrafficcontrol.flightsimulation.events.FlightDetectedEvent;
import com.github.btafarelo.airtrafficcontrol.radardetection.adapters.in.rabbitmq.FlightDetectedListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

