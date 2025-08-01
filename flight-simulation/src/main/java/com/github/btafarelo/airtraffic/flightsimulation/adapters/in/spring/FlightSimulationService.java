package com.github.btafarelo.airtraffic.flightsimulation.adapters.in.spring;

import com.github.btafarelo.airtraffic.flightsimulation.domain.port.in.IFlightSimulationService;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class FlightSimulationService implements IFlightSimulationService {

    private final IFlightSimulationService service;

    public FlightSimulationService(final IFlightSimulationService service) {
        this.service = service;
    }

    @Override
    @PostConstruct
    public void start() throws InterruptedException {
        service.start();
    }

    @Override
    @Scheduled(fixedRate = 1000) // Check every 1 second
    public void monitorThreads() throws InterruptedException {
        service.monitorThreads();
    }
}
