package com.github.btafarelo.airtraffic.radardetection.adapters.out.websocket;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import com.github.btafarelo.airtraffic.radardetection.domain.port.out.BroadcastFlightDetected;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class BroadcastFlightDetectedService implements BroadcastFlightDetected {

    private static final Logger LOG = LoggerFactory.getLogger(BroadcastFlightDetectedService.class);

    private final SimpMessagingTemplate messagingTemplate;

    public BroadcastFlightDetectedService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void sendFlightDetectedEvent(FlightDetectedEvent event) {
        LOG.info("FlightDetectedEvent -> {}", event);
        messagingTemplate.convertAndSend("/topic/flightUpdates", event);
    }
}

