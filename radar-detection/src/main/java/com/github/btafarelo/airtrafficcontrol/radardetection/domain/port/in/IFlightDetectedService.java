package com.github.btafarelo.airtrafficcontrol.radardetection.domain.port.in;

import com.github.btafarelo.airtrafficcontrol.flightsimulation.events.FlightDetectedEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;

public interface IFlightDetectedService {

    @RabbitListener(queues = "#{@rabbitConfig.flightDetectedStreamQueue}")
    void onFlightDetected(FlightDetectedEvent event);
}
