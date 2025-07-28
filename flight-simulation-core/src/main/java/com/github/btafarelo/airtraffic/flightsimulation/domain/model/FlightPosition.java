package com.github.btafarelo.airtraffic.flightsimulation.domain.model;

public record FlightPosition(
        double latitude,
        double longitude,
        double distanceFromRadar,
        boolean inRadarRange,
        double currentAltitude,
        double currentSpeed) {

}
