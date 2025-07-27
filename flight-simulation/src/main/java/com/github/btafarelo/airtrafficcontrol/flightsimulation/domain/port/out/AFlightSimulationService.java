package com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.port.out;

import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model.AircraftType;
import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model.Airport;
import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model.Flight;
import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model.FlightRoute;
import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.port.out.util.FlightUtils;
import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.port.out.util.RouteGenerator;

import java.util.*;

import static com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.Config.FLIGHT_UPDATE_INTERVAL_MS;

public abstract class AFlightSimulationService implements IFlightObserver {

    final FlightUtils flightUtils;

    final Random random;

    protected final Map<Flight, FlightRoute> flightsMap;

    private static final int FLIGHT_MAX_CONCURRENT = 15;

    public AFlightSimulationService() {
        flightUtils = new FlightUtils();
        random = new Random();
        flightsMap = new HashMap<>(15);

        //generateFlights();
    }

    public void updateFlightsLocation() {
        System.out.println("IFlightSimulationService.updateFlightLocation");

        flightsMap.forEach((flight, route) -> {
            flight.setGenerationTimestamp(System.currentTimeMillis());
            flight.setLatitude(46.2044);
            flight.setLongitude(6.1432);
            flight.setSpeed(100);
            flight.setAltitude(10000);
        });
    }

    public FlightSimulator generateFlight(int flightNumber, IFlightObserver observer) {
        Airport origin = flightUtils.getRandomAirport();
        Airport destination;

        do {
            destination = flightUtils.getRandomAirport();
        } while (destination == origin);

        // Generate aircraft characteristics
        AircraftType aircraftType = AircraftType.values()[random.nextInt(AircraftType.values().length)];
        String callsign = String.format("FLIGHT%03d", flightNumber);

        Flight flight = new Flight(callsign);
        flight.setAircraftType(aircraftType);
        flight.setOrigin(origin);
        flight.setDestination(destination);

        FlightRoute route = new RouteGenerator().generateRoute(origin, destination);

        return new FlightSimulator(flight, route, observer);
    }

    public void simulateFlight(Flight flight, FlightRoute route) throws InterruptedException {
        long startTime = System.currentTimeMillis();

        for (int step = 0; step <= route.steps.size(); step++) {
            flight.setPosition(route.getNextStep());

            // Kill thread if flight is out of radar range and has progressed significantly
            /*
            if (distanceFromRadar > config.getDoubleProperty(PropertyKey.RADAR_PERIMETER_DISTANCE_KM) && progress > 0.1) {
                logger.info("🛬 {} exited radar range at {}km - terminating thread",
                        flightTrackData.getCallsign(), distanceFromRadar);
                return false;
            }*/

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
