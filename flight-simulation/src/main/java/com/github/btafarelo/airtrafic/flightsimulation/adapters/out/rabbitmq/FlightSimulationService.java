package com.github.btafarelo.airtrafic.flightsimulation.adapters.out.rabbitmq;

import com.github.btafarelo.airtraffic.flightsimulation.domain.Config;
import com.github.btafarelo.airtraffic.flightsimulation.domain.model.Flight;
import com.github.btafarelo.airtraffic.flightsimulation.domain.port.out.AFlightSimulationService;
import com.github.btafarelo.airtraffic.flightsimulation.domain.port.out.FlightSimulator;
import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Queue;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.github.btafarelo.airtraffic.flightsimulation.domain.Config.*;

@Service
public class FlightSimulationService extends AFlightSimulationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FlightSimulationService.class);

    private final AmqpTemplate amqpTemplate;

    private final Queue queue;

    private final List<Thread> simulationThreads;

    private final Random random;

    public FlightSimulationService(AmqpTemplate amqpTemplate, Queue queue) {
        this.amqpTemplate = amqpTemplate;
        this.queue = queue;
        this.simulationThreads = new ArrayList<>();
        this.random = new Random();
    }

    @PostConstruct
    public void startSimulation() throws InterruptedException {
        while (simulationThreads.size() < Config.MAX_NUMBER_OF_FLIGHTS) {
            FlightSimulator flightSimulator = generateFlight(random.nextInt(), this);
            Thread simulationThread = new Thread(flightSimulator);
            simulationThread.start();
            simulationThreads.add(simulationThread);

            // Stagger flight starts
            int staggerTime = FLIGHT_STAGGER_MIN_SECONDS * 1000 +
                    random.nextInt((FLIGHT_STAGGER_MAX_SECONDS - FLIGHT_STAGGER_MIN_SECONDS) * 1000);
            Thread.sleep(staggerTime);
        }
    }

    @Scheduled(fixedRate = 1000) // Check every 1 second
    public void monitorThreads() throws InterruptedException {
        for (int i = 0; i < simulationThreads.size(); i++) {
            Thread thread = simulationThreads.get(i);
            if (!thread.isAlive()) {
                LOGGER.info("Thread {} has died. Restarting...", thread.getName());
                simulationThreads.remove(i);
                startSimulation(); // Start a new thread
                i--; // Adjust index after removal
            }
        }
    }

    @Override
    public void onFlightUpdated(Flight flight) {
        amqpTemplate.convertAndSend(queue.getName(), new FlightDetectedEvent(flight));
    }
}
