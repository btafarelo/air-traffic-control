package com.github.btafarelo.airtraffic.flightsimulation.domain.events;

import com.github.btafarelo.airtraffic.flightsimulation.domain.model.Flight;

public class FlightDetectedEvent {

    private Flight flight;

    public FlightDetectedEvent(Flight flight) {
        this.flight = flight;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }
}
