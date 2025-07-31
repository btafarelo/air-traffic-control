package com.github.btafarelo.airtraffic.flightsimulation.adapters.out.rabbitmq;

import com.github.btafarelo.airtraffic.flightsimulation.domain.model.Flight;
import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import com.github.btafarelo.airtraffic.flightsimulation.domain.port.out.IFlightObserver;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Queue;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQGateway implements IFlightObserver {

    private final AmqpTemplate amqpTemplate;

    private final Queue queue;

    public RabbitMQGateway(AmqpTemplate amqpTemplate, Queue queue) {
        this.amqpTemplate = amqpTemplate;
        this.queue = queue;
    }

    @Override
    public void onFlightUpdated(Flight flight) {
        amqpTemplate.convertAndSend(queue.getName(), new FlightDetectedEvent(flight));
    }
}
