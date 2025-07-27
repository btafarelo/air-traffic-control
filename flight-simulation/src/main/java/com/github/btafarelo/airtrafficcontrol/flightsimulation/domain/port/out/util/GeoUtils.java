package com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.port.out.util;

import static com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.Config.EARTH_RADIUS_KM;

public class GeoUtils {

    private static final double RADIANS_TO_DEGREES = 180.0 / Math.PI;

    private static final double DEGREES_TO_RADIANS = Math.PI / 180.0;

    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return EARTH_RADIUS_KM * c;
    }

    public static double[] getCoordinatesAtDistance(double centerLat, double centerLon,
                                                    double distance, double angle) {

        double latOffset = distance / EARTH_RADIUS_KM * RADIANS_TO_DEGREES;
        double lonOffset = distance / EARTH_RADIUS_KM * Math.cos(centerLat * DEGREES_TO_RADIANS) * RADIANS_TO_DEGREES;

        double newLat = centerLat + latOffset * Math.sin(angle);
        double newLon = centerLon + lonOffset * Math.cos(angle);

        return new double[]{newLat, newLon};
    }
}
