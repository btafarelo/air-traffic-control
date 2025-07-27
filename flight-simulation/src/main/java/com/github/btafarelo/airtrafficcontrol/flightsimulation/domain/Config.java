package com.github.btafarelo.airtrafficcontrol.flightsimulation.domain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class Config {

    private static final Logger LOGGER = LoggerFactory.getLogger(Config.class);

    public static int FLIGHT_STAGGER_MIN_SECONDS;
    public static int FLIGHT_STAGGER_MAX_SECONDS;
    public static double EARTH_RADIUS_KM;
    public static double RADAR_CENTER_LATITUDE;
    public static double RADAR_CENTER_LONGITUDE;
    public static double RADAR_PERIMETER_DISTANCE_KM;
    public static int FLIGHT_DURATION_SECONDS;
    public static int FLIGHT_UPDATE_INTERVAL_MS;
    public static double AIRCRAFT_ALTITUDE_VARIATION;
    public static double AIRCRAFT_SPEED_VARIATION;

    private static final Map<String, String> propertiesMap = new HashMap<>();

    static {
        loadProperties();
    }

    private static void loadProperties() {
        Properties properties = new Properties();

        try (InputStream input = Config.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (input == null) {
                throw new FileNotFoundException("Unable to find application.properties");
            }

            properties.load(input);

            // Convert Properties to Map and set fields dynamically
            for (String key : properties.stringPropertyNames()) {
                propertiesMap.put(key, properties.getProperty(key));
                setStaticField(key, properties.getProperty(key));
            }
        } catch (Exception ex) {
            throw new RuntimeException("Unable to read application.properties", ex);
        }
    }

    private static void setStaticField(String key, String value) {
        try {
            Field field = Config.class.getDeclaredField(key);
            if (field != null) {
                field.setAccessible(true); // Allow access to private fields
                switch (field.getType().getSimpleName()) {
                    case "int":
                        field.setInt(null, Integer.parseInt(value));
                        break;
                    case "double":
                        field.setDouble(null, Double.parseDouble(value));
                        break;
                    case "boolean":
                        field.setBoolean(null, Boolean.parseBoolean(value));
                        break;
                    case "String":
                        field.set(null, value);
                        break;
                    // Add more types as needed
                    default:
                        System.err.println("Unsupported type for field: " + key);
                }
            }
        } catch (NoSuchFieldException | IllegalAccessException e) {
            System.err.println("Field not found or inaccessible: " + key);
        }
    }

    public static String getProperty(String key) {
        return propertiesMap.get(key);
    }
}
