package com.github.btafarelo.airtraffic.radardetection.adapters;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import com.github.btafarelo.airtraffic.radardetection.domain.port.out.FlightDetected;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController implements FlightDetected {

    @MessageMapping("/flightDetected")
    @SendTo("/topic/flightUpdates")
    @Override
    public FlightDetectedEvent handleFlightDetected(FlightDetectedEvent event) {
        return event; // Return the event to be sent to clients
    }
}

