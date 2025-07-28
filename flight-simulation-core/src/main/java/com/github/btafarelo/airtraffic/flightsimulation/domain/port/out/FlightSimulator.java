package com.github.btafarelo.airtraffic.flightsimulation.domain.port.out;

import com.github.btafarelo.airtraffic.flightsimulation.domain.model.Flight;
import com.github.btafarelo.airtraffic.flightsimulation.domain.model.FlightPosition;
import com.github.btafarelo.airtraffic.flightsimulation.domain.model.FlightRoute;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.github.btafarelo.airtraffic.flightsimulation.domain.Config.FLIGHT_UPDATE_INTERVAL_MS;

public class FlightSimulator implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(FlightSimulator.class);

    private final Flight flight;
    private final FlightRoute route;
    private final IFlightObserver flightObserver;

    public FlightSimulator(Flight flight, FlightRoute route, IFlightObserver flightObserver) {
        this.flight = flight;
        this.route = route;
        this.flightObserver = flightObserver;
    }

    @Override
    public void run() {
        try {
            simulateFlight();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Restore interrupted status
        }
    }

    private void simulateFlight() throws InterruptedException {
        LOGGER.info("Started new thread -> {}", flight.getCallsign());

        long startTime = System.currentTimeMillis();
        int steps = route.steps.size();

        for (int step = 0; step <= route.steps.size(); step++) {
            if (step == route.steps.size())
                flight.setPosition(new FlightPosition(0.0,0.0,0.0,false,0.0,0.0));
            else
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
