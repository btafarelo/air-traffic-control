package com.github.btafarelo.airtraffic.radardetection.adapters.in.rabbitmq;

import com.github.btafarelo.airtraffic.radardetection.adapters.out.websocket.BroadcastFlightDetectedService;
import com.github.btafarelo.airtraffic.radardetection.domain.port.in.IFlightDetectedService;
import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class FlightDetectedListener implements IFlightDetectedService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FlightDetectedListener.class);

    private final BroadcastFlightDetectedService broadcastFlightDetectedService;

    public FlightDetectedListener(BroadcastFlightDetectedService broadcastFlightDetectedService) {
        this.broadcastFlightDetectedService = broadcastFlightDetectedService;
    }

    @Override
    @RabbitListener(queues = "flightDetectedStream")
    public void onFlightDetected(FlightDetectedEvent event) {
        LOGGER.info("FlightDetectedEvent -> {}", event.getFlight().getCallsign());

        broadcastFlightDetectedService.sendFlightDetectedEvent(event);
    }
}
