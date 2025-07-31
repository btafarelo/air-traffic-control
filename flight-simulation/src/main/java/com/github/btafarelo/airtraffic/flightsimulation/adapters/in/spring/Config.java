package com.github.btafarelo.airtraffic.flightsimulation.adapters.in.spring;

import com.github.btafarelo.airtraffic.flightsimulation.adapters.out.rabbitmq.RabbitMQGateway;
import com.github.btafarelo.airtraffic.flightsimulation.domain.FlightSimulationService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    @Bean
    public FlightSimulationService getFlightSimulationServiceBean(RabbitMQGateway rabbitMQGateway) {
        return new FlightSimulationService(rabbitMQGateway);
    }
}
