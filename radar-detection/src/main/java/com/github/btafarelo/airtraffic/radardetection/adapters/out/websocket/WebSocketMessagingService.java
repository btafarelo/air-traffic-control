package com.github.btafarelo.airtraffic.radardetection.adapters.out.websocket;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketMessagingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketMessagingService.class);

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketMessagingService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendFlightDetectedEvent(FlightDetectedEvent event) {
        LOGGER.info("FlightDetectedEvent -> {}", event);
        messagingTemplate.convertAndSend("/topic/flightUpdates", event);
    }
}

