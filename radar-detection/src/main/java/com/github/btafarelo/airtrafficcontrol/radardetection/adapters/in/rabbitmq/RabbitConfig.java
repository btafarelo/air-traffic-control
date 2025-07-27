package com.github.btafarelo.airtrafficcontrol.radardetection.adapters.in.rabbitmq;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Value("${spring.rabbitmq.queues.flightDetectedStream}")
    private String flightDetectedStreamQueue;

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
