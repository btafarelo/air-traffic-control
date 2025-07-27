package com.github.btafarelo.airtrafficcontrol.flightsimulation.adapters.out.rabbitmq;

import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.model.Flight;
import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.port.out.AFlightSimulationService;
import com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.port.out.FlightSimulator;
import com.github.btafarelo.airtrafficcontrol.flightsimulation.events.FlightDetectedEvent;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.Config.FLIGHT_STAGGER_MAX_SECONDS;
import static com.github.btafarelo.airtrafficcontrol.flightsimulation.domain.Config.FLIGHT_STAGGER_MIN_SECONDS;

@Service
public class FlightSimulationService extends AFlightSimulationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FlightSimulationService.class);

    @Autowired
    private AmqpTemplate amqpTemplate;

    @Autowired
    private Queue queue;

    private final List<Thread> simulationThreads = new ArrayList<>();

    private Random random = new Random();

    @PostConstruct
    public void startSimulation() throws InterruptedException {
        while (simulationThreads.size() < 15) {
            FlightSimulator flightSimulator = generateFlight(new Random().nextInt(), this);
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
