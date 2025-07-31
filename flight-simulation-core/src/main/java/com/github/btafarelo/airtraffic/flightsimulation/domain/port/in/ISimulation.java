package com.github.btafarelo.airtraffic.flightsimulation.domain.port.in;

import com.github.btafarelo.airtraffic.flightsimulation.domain.FlightSimulationService;

public abstract class ISimulation {

    public ISimulation(final FlightSimulationService service) {

    }

    public abstract void start() throws InterruptedException;

    public abstract void monitorThreads() throws InterruptedException;
}
