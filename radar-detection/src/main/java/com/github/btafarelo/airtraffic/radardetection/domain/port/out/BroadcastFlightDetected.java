package com.github.btafarelo.airtraffic.radardetection.domain.port.out;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;

public interface BroadcastFlightDetected {
    void sendFlightDetectedEvent(FlightDetectedEvent event);
}
