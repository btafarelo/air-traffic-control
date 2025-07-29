package com.github.btafarelo.airtraffic.flightsimulation.domain.port.out;

import com.github.btafarelo.airtraffic.flightsimulation.domain.model.*;
import com.github.btafarelo.airtraffic.flightsimulation.domain.port.out.util.FlightUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public abstract class AFlightSimulationService implements IFlightObserver {

    final FlightUtils flightUtils;

    final Random random;

    protected final Map<Flight, FlightRoute> flightsMap;

    private static final int FLIGHT_MAX_CONCURRENT = 15;

    public AFlightSimulationService() {
        flightUtils = new FlightUtils();
        random = new Random();
        flightsMap = new HashMap<>(15);
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

        FlightRoute route = new RouteGeneratorService().generateRoute(origin, destination);

        return new FlightSimulator(flight, route, observer);
    }


}
