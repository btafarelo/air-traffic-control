package com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model;

public enum AircraftType {
    BOEING_737("B737", 189, 450, 600),
    BOEING_777("B777", 396, 500, 650),
    BOEING_787("B787", 330, 490, 640),
    AIRBUS_A320("A320", 180, 460, 610),
    AIRBUS_A330("A330", 335, 480, 630),
    AIRBUS_A350("A350", 366, 500, 650),
    AIRBUS_A380("A380", 853, 490, 640),
    EMBRAER_E190("E190", 114, 420, 550);

    private final String code;
    private final int maxCapacity;
    private final int minSpeed;
    private final int maxSpeed;

    AircraftType(String code, int maxCapacity, int minSpeed, int maxSpeed) {
        this.code = code;
        this.maxCapacity = maxCapacity;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
    }

    public String getCode() { return code; }
    public int getMaxCapacity() { return maxCapacity; }
    public int getMinSpeed() { return minSpeed; }
    public int getMaxSpeed() { return maxSpeed; }
}
