package com.github.btafarelo.airtraffic.flightsimulation.domain.port.in;

import com.github.btafarelo.airtraffic.flightsimulation.domain.FlightSimulationService;

public interface IFlightSimulationService {

    public void start() throws InterruptedException;

    public void monitorThreads() throws InterruptedException;
}
