package com.github.btafarelo.airtraffic.radardetection.adapters.in.rabbitmq;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("rabbitmq")
public class RabbitConfig {

    private String flightDetectedStreamQueue = "flightDetectedStream";

    public String getFlightDetectedStreamQueue() {
        return flightDetectedStreamQueue;
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public Queue queue() {
        return new Queue(flightDetectedStreamQueue);
    }
}
