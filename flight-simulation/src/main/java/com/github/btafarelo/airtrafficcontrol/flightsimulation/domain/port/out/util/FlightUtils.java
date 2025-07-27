package com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.port.out.util;

import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model.AircraftType;
import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model.Airport;

import java.util.Random;

public class FlightUtils {

    private final Random random;

    public FlightUtils() {
        this.random = new Random();
    }

    private AircraftType getRandomAircraftType() {
        AircraftType[] types = AircraftType.values();
        return types[random.nextInt(types.length)];
    }

    public int generateOccupancy(AircraftType aircraftType) {
        // Generate occupancy between 60% and 95% of aircraft capacity
        int minOccupancy = (int) (aircraftType.getMaxCapacity() * 0.6);
        int maxOccupancy = (int) (aircraftType.getMaxCapacity() * 0.95);
        return minOccupancy + random.nextInt(maxOccupancy - minOccupancy + 1);
    }

    public Airport getRandomAirport() {
        Airport[] airports = Airport.values();
        return airports[random.nextInt(airports.length)];
    }

    /*
    public double generateAltitude() {
        return config.getIntProperty(PropertyKey.AIRCRAFT_ALTITUDE_MIN) +
                random.nextInt(config.getIntProperty(PropertyKey.AIRCRAFT_ALTITUDE_MAX) -
                        config.getIntProperty(PropertyKey.AIRCRAFT_ALTITUDE_MIN));
    }*/

    public double generateSpeed(AircraftType aircraftType) {
        return aircraftType.getMinSpeed() +
                random.nextInt(aircraftType.getMaxSpeed() - aircraftType.getMinSpeed());
    }
}
