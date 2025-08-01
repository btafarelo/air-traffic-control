package com.github.btafarelo.airtraffic.flightsimulation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FlightSimulationApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlightSimulationApplication.class, args);
    }
}