package com.github.btafarelo.airtrafficcontrol.flightsimulation.events;

import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model.Flight;

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
