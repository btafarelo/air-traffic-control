package com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.port.out;

import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model.Flight;

public interface IFlightObserver {

    void onFlightUpdated(Flight flight);
}
