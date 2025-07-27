package com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model;

public enum Airport {
    GENEVA("GVA", "Geneva", 46.2044, 6.1432),
    MADRID("MAD", "Madrid", 40.4719, -3.5626),
    LISBON("LIS", "Lisbon", 38.7813, -9.1363),
    LONDON("LHR", "London Heathrow", 51.4700, -0.4543),
    PARIS("CDG", "Paris Charles de Gaulle", 49.0097, 2.5479),
    NEW_YORK("JFK", "New York JFK", 40.6413, -73.7781),
    GUARULHOS("GRU", "São Paulo Guarulhos", -23.4356, -46.4731),
    BEIJING("PEK", "Beijing Capital", 40.0799, 116.6031);

    private final String code;
    private final String name;
    private final double latitude;
    private final double longitude;

    Airport(String code, String name, double latitude, double longitude) {
        this.code = code;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getCode() { return code; }
    public String getName() { return name; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
}
