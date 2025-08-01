package com.github.btafarelo.airtraffic.flightsimulation.adapters.in.spring;

import com.github.btafarelo.airtraffic.flightsimulation.adapters.out.kafka.KafkaStreamGateway;
import com.github.btafarelo.airtraffic.flightsimulation.adapters.out.rabbitmq.RabbitMQGateway;
import com.github.btafarelo.airtraffic.flightsimulation.domain.FlightSimulationService;
import com.github.btafarelo.airtraffic.flightsimulation.domain.port.in.IFlightSimulationService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class Config {

    @Bean
    @Profile("rabbitmq")
    public IFlightSimulationService getFlightSimulationServiceBeanRabbitMQ(RabbitMQGateway rabbitMQGateway) {
        return new FlightSimulationService(rabbitMQGateway);
    }

    @Bean
    @Profile("kafka")
    public IFlightSimulationService getFlightSimulationServiceBeanKafka(KafkaStreamGateway kafkaStreamGateway) {
        return new FlightSimulationService(kafkaStreamGateway);
    }
}
