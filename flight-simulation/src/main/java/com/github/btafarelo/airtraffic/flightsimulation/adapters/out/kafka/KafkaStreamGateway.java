package com.github.btafarelo.airtraffic.flightsimulation.adapters.out.kafka;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import com.github.btafarelo.airtraffic.flightsimulation.domain.model.Flight;
import com.github.btafarelo.airtraffic.flightsimulation.domain.port.out.IFlightObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Profile("kafka")
public class KafkaStreamGateway implements IFlightObserver {

    private static final Logger LOG = LoggerFactory.getLogger(KafkaStreamGateway.class);

    private final KafkaTemplate<String, FlightDetectedEvent> kafkaTemplate;

    public KafkaStreamGateway(KafkaTemplate<String, FlightDetectedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void onFlightUpdated(Flight flight) {
        kafkaTemplate.send("flightDetectedStream", new FlightDetectedEvent(flight));
    }
}
