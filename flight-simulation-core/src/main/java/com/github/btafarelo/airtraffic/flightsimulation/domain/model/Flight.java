package com.github.btafarelo.airtraffic.flightsimulation.domain.model;

public class Flight {

    //Entity ID
    private final String callsign;

    private double latitude;
    private double longitude;
    private double altitude;
    private double speed;
    private AircraftType aircraftType;
    private int occupancy;
    private Airport origin;
    private Airport destination;
    private double distanceFromRadar;
    private boolean inRadarRange;
    private long generationTimestamp;

    public Flight(String callsign) {
        this.callsign = callsign;
    }

    public String getCallsign() {
        return callsign;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getAltitude() {
        return altitude;
    }

    public void setAltitude(double altitude) {
        this.altitude = altitude;
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public AircraftType getAircraftType() {
        return aircraftType;
    }

    public void setAircraftType(AircraftType aircraftType) {
        this.aircraftType = aircraftType;
    }

    public int getOccupancy() {
        return occupancy;
    }

    public void setOccupancy(int occupancy) {
        this.occupancy = occupancy;
    }

    public Airport getOrigin() {
        return origin;
    }

    public void setOrigin(Airport origin) {
        this.origin = origin;
    }

    public Airport getDestination() {
        return destination;
    }

    public void setDestination(Airport destination) {
        this.destination = destination;
    }

    public double getDistanceFromRadar() {
        return distanceFromRadar;
    }

    public void setDistanceFromRadar(double distanceFromRadar) {
        this.distanceFromRadar = distanceFromRadar;
    }

    public boolean isInRadarRange() {
        return inRadarRange;
    }

    public void setInRadarRange(boolean inRadarRange) {
        this.inRadarRange = inRadarRange;
    }

    public long getGenerationTimestamp() {
        return generationTimestamp;
    }

    public void setGenerationTimestamp(long generationTimestamp) {
        this.generationTimestamp = generationTimestamp;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;

        Flight flight = (Flight) o;
        return callsign.equals(flight.callsign);
    }

    @Override
    public int hashCode() {
        return callsign.hashCode();
    }

    public void setPosition(FlightPosition flightPosition) {
        this.latitude = flightPosition.latitude();
        this.longitude = flightPosition.longitude();
        this.altitude = flightPosition.currentAltitude();
        this.speed = flightPosition.currentSpeed();
        this.inRadarRange = flightPosition.inRadarRange();
        this.distanceFromRadar = flightPosition.distanceFromRadar();
        this.generationTimestamp = System.currentTimeMillis();
    }
}
