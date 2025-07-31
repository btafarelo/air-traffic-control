package com.github.btafarelo.airtraffic.flightsimulation.adapters.in.spring;

import com.github.btafarelo.airtraffic.flightsimulation.domain.FlightSimulationService;
import com.github.btafarelo.airtraffic.flightsimulation.domain.port.in.ISimulation;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class Simulation extends ISimulation {

    private final FlightSimulationService service;

    public Simulation(final FlightSimulationService service) {
        super(service);
        this.service = service;
    }

    @Override
    @PostConstruct
    public void start() throws InterruptedException {
        service.startSimulation();
    }

    @Override
    @Scheduled(fixedRate = 1000) // Check every 1 second
    public void monitorThreads() throws InterruptedException {
        service.monitorThreads();
    }
}
