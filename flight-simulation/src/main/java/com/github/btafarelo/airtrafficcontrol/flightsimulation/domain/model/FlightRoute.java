package com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model;

import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.port.out.util.GeoUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FlightRoute {

    private final double startLat;
    private final double startLon;
    private final double endLat;
    private final double endLon;
    private final double totalDistance;
    private final Airport origin;
    private final Airport destination;
    public List<FlightPosition> steps;

    public FlightRoute(double startLat, double startLon, double endLat, double endLon,
                       Airport origin, Airport destination) {
        this.startLat = startLat;
        this.startLon = startLon;
        this.endLat = endLat;
        this.endLon = endLon;
        this.origin = origin;
        this.destination = destination;
        this.totalDistance = GeoUtils.calculateDistance(startLat, startLon, endLat, endLon);
        this.steps = Collections.synchronizedList(new ArrayList<>());
    }

    // Getters
    public double getStartLat() { return startLat; }
    public double getStartLon() { return startLon; }
    public double getEndLat() { return endLat; }
    public double getEndLon() { return endLon; }
    public double getTotalDistance() { return totalDistance; }
    public Airport getOrigin() { return origin; }
    public Airport getDestination() { return destination; }

    public void addStep(FlightPosition step) {
        this.steps.add(step);
    }

    public FlightPosition getNextStep() {
        return this.steps.remove(0);
    }
}
