package com.github.btafarelo.airtraffic.radardetection.domain.port.in;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;

public interface IFlightDetectedService {

    void onFlightDetected(FlightDetectedEvent event);
}
