package com.github.btafarelo.airtraffic.flightsimulation.domain;

import com.github.btafarelo.airtraffic.flightsimulation.domain.model.Flight;
import com.github.btafarelo.airtraffic.flightsimulation.domain.model.FlightPosition;
import com.github.btafarelo.airtraffic.flightsimulation.domain.model.FlightRoute;
import com.github.btafarelo.airtraffic.flightsimulation.domain.port.out.IFlightObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import static com.github.btafarelo.airtraffic.flightsimulation.domain.Config.*;

public class FlightSimulator implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(FlightSimulator.class);

    private final Flight flight;
    private final FlightRoute route;
    private final IFlightObserver flightObserver;
    private final int staggerTime;

    public FlightSimulator(Flight flight, FlightRoute route, IFlightObserver flightObserver, int staggerTime) {
        this.flight = flight;
        this.route = route;
        this.flightObserver = flightObserver;
        this.staggerTime = staggerTime;
    }

    @Override
    public void run() {
        try {
            Thread.sleep(staggerTime);
            simulateFlight();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Restore interrupted status
        }
    }

    private void simulateFlight() throws InterruptedException {
        LOG.info("Started new thread -> {}", flight.getCallsign());

        long startTime = System.currentTimeMillis();
        List<FlightPosition> steps = route.getSteps();

        for (int step = 0; step < steps.size(); step++) {
            flight.setPosition(route.steps.get(step));

            flightObserver.onFlightUpdated(flight); // Notify observer of the update

            // Precise timing control
            long expectedTime = startTime + (step * FLIGHT_UPDATE_INTERVAL_MS);
            long currentTime = System.currentTimeMillis();
            long sleepTime = expectedTime - currentTime;

            if (sleepTime > 0) {
                Thread.sleep(sleepTime);
            }
        }
    }
}
