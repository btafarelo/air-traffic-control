package com.github.btafarelo.airtraffic.flightsimulation.domain;

import com.github.btafarelo.airtraffic.flightsimulation.domain.model.*;
import com.github.btafarelo.airtraffic.flightsimulation.domain.port.out.IFlightObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

import static com.github.btafarelo.airtraffic.flightsimulation.domain.Config.FLIGHT_STAGGER_MAX_SECONDS;
import static com.github.btafarelo.airtraffic.flightsimulation.domain.Config.FLIGHT_STAGGER_MIN_SECONDS;

public class FlightSimulationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FlightSimulationService.class);

    private final Random random;

    protected final Map<Flight, FlightRoute> flightsMap;

    private final List<Thread> simulationThreads;

    private final IFlightObserver observer;

    public FlightSimulationService(final IFlightObserver observer) {
        this.random = new Random();
        this.flightsMap = new HashMap<>(15);
        this.simulationThreads = new ArrayList<>();
        this.observer = observer;
    }

    public void startSimulation() throws InterruptedException {
        while (simulationThreads.size() < Config.MAX_NUMBER_OF_FLIGHTS) {
            FlightSimulator flightSimulator = generateFlight(random.nextInt());
            Thread simulationThread = new Thread(flightSimulator);
            simulationThread.start();
            simulationThreads.add(simulationThread);

            // Stagger flight starts
            int staggerTime = FLIGHT_STAGGER_MIN_SECONDS * 1000 +
                    random.nextInt((FLIGHT_STAGGER_MAX_SECONDS - FLIGHT_STAGGER_MIN_SECONDS) * 1000);
            Thread.sleep(staggerTime);
        }
    }

    public void monitorThreads() throws InterruptedException {
        for (int i = 0; i < simulationThreads.size(); i++) {
            Thread thread = simulationThreads.get(i);
            if (!thread.isAlive()) {
                LOGGER.info("Thread {} has died. Restarting...", thread.getName());
                simulationThreads.remove(i);
                startSimulation(); // Start a new thread
                i--; // Adjust index after removal
            }
        }
    }

    public FlightSimulator generateFlight(int flightNumber) {
        Airport origin = getRandomAirport();
        Airport destination;

        do {
            destination = getRandomAirport();
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

    private AircraftType getRandomAircraftType() {
        AircraftType[] types = AircraftType.values();
        return types[random.nextInt(types.length)];
    }

    private int generateOccupancy(AircraftType aircraftType) {
        // Generate occupancy between 60% and 95% of aircraft capacity
        int minOccupancy = (int) (aircraftType.getMaxCapacity() * 0.6);
        int maxOccupancy = (int) (aircraftType.getMaxCapacity() * 0.95);
        return minOccupancy + random.nextInt(maxOccupancy - minOccupancy + 1);
    }

    private Airport getRandomAirport() {
        Airport[] airports = Airport.values();
        return airports[random.nextInt(airports.length)];
    }

    /*
    public double generateAltitude() {
        return config.getIntProperty(PropertyKey.AIRCRAFT_ALTITUDE_MIN) +
                random.nextInt(config.getIntProperty(PropertyKey.AIRCRAFT_ALTITUDE_MAX) -
                        config.getIntProperty(PropertyKey.AIRCRAFT_ALTITUDE_MIN));
    }*/

    private double generateSpeed(AircraftType aircraftType) {
        return aircraftType.getMinSpeed() +
                random.nextInt(aircraftType.getMaxSpeed() - aircraftType.getMinSpeed());
    }
}
