package com.github.btafarelo.airtraffic.radardetection.adapters.in.kafka;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import com.github.btafarelo.airtraffic.radardetection.adapters.out.websocket.BroadcastFlightDetectedService;
import com.github.btafarelo.airtraffic.radardetection.domain.port.in.IFlightDetectedService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Profile("kafka")
public class FlightDetectedListener implements IFlightDetectedService {

    private static final Logger LOG = LoggerFactory.getLogger(FlightDetectedListener.class);

    private final BroadcastFlightDetectedService broadcastFlightDetectedService;

    public FlightDetectedListener(BroadcastFlightDetectedService broadcastFlightDetectedService) {
        this.broadcastFlightDetectedService = broadcastFlightDetectedService;
    }

    @Override
    @KafkaListener(topics = "flightDetectedStream", groupId = "radarDetectionApplication")
    public void onFlightDetected(FlightDetectedEvent event) {
        LOG.info("FlightDetectedEvent -> {}", event.getFlight().getCallsign());

        broadcastFlightDetectedService.sendFlightDetectedEvent(event);
    }
}