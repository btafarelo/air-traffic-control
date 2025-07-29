package com.github.btafarelo.airtraffic.flightsimulation.domain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.function.BiConsumer;

public class Config {

    private static final Logger LOGGER = LoggerFactory.getLogger(Config.class);

    private static final String FILENAME = "app.properties";

    public static int MAX_NUMBER_OF_FLIGHTS;
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

    private static final Map<Class<?>, BiConsumer<Field, String>> typeMap = new HashMap<>();

    static {
        typeMap.put(int.class, (field, value) -> setFieldValue(field, Integer.parseInt(value)));
        typeMap.put(double.class, (field, value) -> setFieldValue(field, Double.parseDouble(value)));
        typeMap.put(boolean.class, (field, value) -> setFieldValue(field, Boolean.parseBoolean(value)));
        typeMap.put(String.class, (field, value) -> setFieldValue(field, value));

        loadProperties();
    }

    private static void loadProperties() {
        Properties properties = new Properties();

        try (InputStream input = Config.class.getClassLoader().getResourceAsStream(FILENAME)) {
            if (input == null) {
                throw new FileNotFoundException(String.format("Unable to find %s", FILENAME));
            }

            properties.load(input);

            // Convert Properties to Map and set fields dynamically
            for (String key : properties.stringPropertyNames()) {
                propertiesMap.put(key, properties.getProperty(key));
                setStaticField(key, properties.getProperty(key));
            }
        } catch (Exception ex) {
            throw new RuntimeException(String.format("Unable to read %s", FILENAME), ex);
        }
    }

    private static void setStaticField(String key, String value) throws NoSuchFieldException {
        try {
            Field field = Config.class.getDeclaredField(key);

            if (field != null) {
                BiConsumer<Field, String> setter = typeMap.get(field.getType());

                setter.accept(field, value);
            }
        } catch (NoSuchFieldException e) {
            throw new NoSuchFieldException("Field not found or inaccessible: " + key);
        }
    }

    private static <T> void setFieldValue(Field field, T value) {
        try {
            field.setAccessible(true); // Allow access to private fields
            field.set(null, value);
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Field not found or inaccessible: " + field.getName());
        }
    }
}
