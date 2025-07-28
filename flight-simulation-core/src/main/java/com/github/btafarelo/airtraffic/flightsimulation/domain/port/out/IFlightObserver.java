package com.github.btafarelo.airtraffic.flightsimulation.domain.port.out;

import com.github.btafarelo.airtraffic.flightsimulation.domain.model.Flight;

public interface IFlightObserver {

    void onFlightUpdated(Flight flight);
}
