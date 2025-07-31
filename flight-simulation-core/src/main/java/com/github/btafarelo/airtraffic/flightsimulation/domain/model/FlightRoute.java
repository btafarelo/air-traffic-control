package com.github.btafarelo.airtraffic.flightsimulation.domain.model;

import java.util.*;

public class FlightRoute {

    private final double startLat;
    private final double startLon;
    private final double endLat;
    private final double endLon;
    private final double totalDistance;
    private final Airport origin;
    private final Airport destination;
    public List<FlightPosition> steps;

    public FlightRoute(double startLat, double startLon, double endLat, double endLon, double distance,
                       Airport origin, Airport destination) {
        this.startLat = startLat;
        this.startLon = startLon;
        this.endLat = endLat;
        this.endLon = endLon;
        this.origin = origin;
        this.destination = destination;
        this.totalDistance = distance;
        this.steps = new LinkedList<>();
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

    public List<FlightPosition> getSteps() {
        return this.steps;
    }
}
